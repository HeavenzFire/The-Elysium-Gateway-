const { app, BrowserWindow, Menu, Tray, dialog, ipcMain, shell } = require("electron");
const { spawn } = require("node:child_process");
const path = require("node:path");
const crypto = require("node:crypto");

app.setName("HeavenzFire Desktop");
const dataRoot = process.platform === "win32"
  ? path.join(process.env.LOCALAPPDATA || app.getPath("appData"), "HeavenzFire")
  : path.join(app.getPath("appData"), "HeavenzFire");
app.setPath("userData", dataRoot);

let mainWindow;
let tray;
let gatewayProcess;
let gatewayOrigin;
let controlToken;
let quitting = false;

const appRoot = path.resolve(__dirname, "..");
const serverBundle = path.join(appRoot, "dist", "server.cjs");
const isDevelopment = !app.isPackaged;

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isTrustedRenderer(event) {
  if (!mainWindow || event.sender !== mainWindow.webContents || !gatewayOrigin) return false;
  try {
    return new URL(event.senderFrame.url).origin === gatewayOrigin;
  } catch {
    return false;
  }
}

function assertTrustedRenderer(event) {
  if (!isTrustedRenderer(event)) throw new Error("UNTRUSTED_RENDERER");
}

async function apiRequest(route, options = {}) {
  if (!gatewayOrigin || !controlToken) throw new Error("GATEWAY_NOT_READY");
  const response = await fetch(new URL(route, gatewayOrigin), {
    ...options,
    headers: {
      Authorization: `Bearer ${controlToken}`,
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...(options.headers || {}),
    },
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error || `CONTROL_PLANE_HTTP_${response.status}`);
  return payload;
}

async function startGateway() {
  if (!require("node:fs").existsSync(serverBundle)) {
    throw new Error("SERVER_BUNDLE_MISSING: run npm run build before launching the desktop shell");
  }

  controlToken = crypto.randomBytes(32).toString("hex");
  const childEnv = {
    ...process.env,
    ELECTRON_RUN_AS_NODE: "1",
    NODE_ENV: "production",
    HOST: "127.0.0.1",
    PORT: "0",
    HEAVENZFIRE_DATA_DIR: app.getPath("userData"),
    HEAVENZFIRE_CONTROL_TOKEN: controlToken,
  };

  gatewayProcess = spawn(process.execPath, [serverBundle], {
    cwd: appRoot,
    env: childEnv,
    stdio: ["ignore", "pipe", "pipe"],
    windowsHide: true,
  });

  let stdoutBuffer = "";
  let settled = false;
  const ready = new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      if (!settled) {
        settled = true;
        reject(new Error("GATEWAY_START_TIMEOUT"));
      }
    }, 30_000);

    const finish = (error, value) => {
      if (settled) return;
      settled = true;
      clearTimeout(timeout);
      error ? reject(error) : resolve(value);
    };

    gatewayProcess.once("error", (error) => finish(error));
    gatewayProcess.once("exit", (code) => {
      if (!gatewayOrigin) finish(new Error(`GATEWAY_EXITED_BEFORE_READY_${code}`));
      else if (!quitting && mainWindow) {
        dialog.showErrorBox("HeavenzFire Gateway stopped", `The local gateway exited (code ${code ?? "unknown"}). Restart HeavenzFire Desktop to reconnect.`);
      }
    });

    gatewayProcess.stdout.on("data", (chunk) => {
      const text = chunk.toString();
      stdoutBuffer = (stdoutBuffer + text).slice(-16_384);
      if (isDevelopment) process.stdout.write(`[Gateway] ${text}`);
      const match = stdoutBuffer.match(/\[Server\] Live on http:\/\/127\.0\.0\.1:(\d+)/);
      if (match) finish(null, Number(match[1]));
    });

    gatewayProcess.stderr.on("data", (chunk) => {
      const text = chunk.toString();
      if (isDevelopment) process.stderr.write(`[Gateway] ${text}`);
    });
  });

  const port = await ready;
  gatewayOrigin = `http://127.0.0.1:${port}`;

  for (let attempt = 0; attempt < 30; attempt += 1) {
    try {
      const response = await fetch(new URL("/api/health", gatewayOrigin), { signal: AbortSignal.timeout(1_000) });
      if (response.ok) return;
    } catch {
      // The listener can announce its bound port just before accepting requests.
    }
    await delay(200);
  }
  throw new Error("GATEWAY_HEALTH_CHECK_FAILED");
}

function registerControlPlaneIpc() {
  ipcMain.handle("heavenzfire:desktop-info", (event) => {
    assertTrustedRenderer(event);
    return {
      name: "HeavenzFire Desktop",
      version: app.getVersion(),
      gateway: "online",
      dataDirectory: app.getPath("userData"),
    };
  });

  ipcMain.handle("heavenzfire:registry:get", async (event) => {
    assertTrustedRenderer(event);
    return apiRequest("/api/control-plane/registry");
  });

  ipcMain.handle("heavenzfire:registry:verify", async (event) => {
    assertTrustedRenderer(event);
    return apiRequest("/api/control-plane/registry/verify");
  });

  ipcMain.handle("heavenzfire:evidence:list", async (event, limit = 100) => {
    assertTrustedRenderer(event);
    const query = new URLSearchParams({ limit: String(limit) });
    return apiRequest(`/api/control-plane/evidence?${query.toString()}`);
  });

  ipcMain.handle("heavenzfire:evidence:verify", async (event) => {
    assertTrustedRenderer(event);
    return apiRequest("/api/control-plane/evidence/verify");
  });

  ipcMain.handle("heavenzfire:evidence:append", async (event, record) => {
    assertTrustedRenderer(event);
    return apiRequest("/api/control-plane/evidence", {
      method: "POST",
      body: JSON.stringify(record),
    });
  });
}

async function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 920,
    minWidth: 980,
    minHeight: 680,
    show: false,
    title: "HeavenzFire Desktop",
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith("https://")) shell.openExternal(url);
    return { action: "deny" };
  });

  mainWindow.webContents.on("will-navigate", (event, url) => {
    if (!gatewayOrigin || new URL(url).origin !== gatewayOrigin) event.preventDefault();
  });

  mainWindow.once("ready-to-show", () => mainWindow.show());
  mainWindow.on("close", (event) => {
    if (!quitting && tray) {
      event.preventDefault();
      mainWindow.hide();
    }
  });
  mainWindow.on("closed", () => { mainWindow = null; });

  await mainWindow.loadURL(gatewayOrigin);
}

function createApplicationMenu() {
  const template = [
    { label: "File", submenu: [{ label: "Hide Window", click: () => mainWindow?.hide() }, { type: "separator" }, { label: "Quit HeavenzFire", role: "quit" }] },
    { label: "View", submenu: [{ label: "Reload", role: "reload" }, ...(isDevelopment ? [{ label: "Developer Tools", role: "toggleDevTools" }] : [])] },
  ];
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

async function createTray() {
  try {
    const icon = await app.getFileIcon(process.execPath, { size: "small" });
    tray = new Tray(icon);
    tray.setToolTip("HeavenzFire Desktop");
    tray.setContextMenu(Menu.buildFromTemplate([
      { label: "Open HeavenzFire Desktop", click: () => mainWindow?.show() },
      { type: "separator" },
      { label: "Quit", click: () => app.quit() },
    ]));
    tray.on("double-click", () => mainWindow?.show());
  } catch {
    // The application remains usable without a tray icon.
  }
}

app.whenReady().then(async () => {
  try {
    await startGateway();
    registerControlPlaneIpc();
    createApplicationMenu();
    await createWindow();
    await createTray();
  } catch (error) {
    dialog.showErrorBox("HeavenzFire Desktop could not start", error instanceof Error ? error.message : String(error));
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow) mainWindow.show();
});

app.on("before-quit", () => {
  quitting = true;
  if (gatewayProcess && !gatewayProcess.killed) gatewayProcess.kill();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin" && !tray) app.quit();
});
