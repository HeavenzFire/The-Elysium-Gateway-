const { app, BrowserWindow, Menu, Tray, dialog, ipcMain, shell, session } = require("electron");
const { spawn } = require("node:child_process");
const path = require("node:path");
const fs = require("node:fs/promises");
const os = require("node:os");
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
let localNodeId;
let heartbeatTimer;
let quitting = false;
let cleanupComplete = false;

const appRoot = path.resolve(__dirname, "..");
const serverBundle = path.join(appRoot, "dist", "server.cjs");
const isDevelopment = !app.isPackaged;
const smokeTest = process.argv.includes("--smoke-test");

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

function collectLocalHealth() {
  return {
    cpuCount: os.cpus().length,
    totalMemoryBytes: os.totalmem(),
    freeMemoryBytes: os.freemem(),
    processMemoryBytes: process.memoryUsage().rss,
  };
}

async function getLocalNodeId() {
  const idPath = path.join(app.getPath("userData"), "desktop-node-id");
  await fs.mkdir(app.getPath("userData"), { recursive: true });
  try {
    const existing = (await fs.readFile(idPath, "utf8")).trim();
    if (/^[0-9a-f-]{36}$/i.test(existing)) return existing;
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
  const generated = crypto.randomUUID();
  try {
    await fs.writeFile(idPath, generated, { flag: "wx", mode: 0o600 });
    return generated;
  } catch (error) {
    if (error.code !== "EEXIST") throw error;
    return (await fs.readFile(idPath, "utf8")).trim();
  }
}

async function registerLocalNode() {
  localNodeId = await getLocalNodeId();
  const kind = process.platform === "win32" ? "windows" : process.platform === "darwin" ? "macos" : "linux";
  const node = {
    id: localNodeId,
    label: os.hostname(),
    kind,
    capabilities: ["health-report"],
    platform: `${os.type()} ${os.release()} ${os.arch()}`,
    appVersion: app.getVersion(),
    health: collectLocalHealth(),
  };
  await apiRequest("/api/control-plane/nodes", { method: "POST", body: JSON.stringify(node) });
  heartbeatTimer = setInterval(() => {
    apiRequest(`/api/control-plane/nodes/${encodeURIComponent(localNodeId)}/heartbeat`, {
      method: "POST",
      body: JSON.stringify({ health: collectLocalHealth() }),
    }).catch((error) => console.error('[Desktop] Node heartbeat failed:', error.message));
  }, 30_000);
}

function registerControlPlaneIpc() {
  ipcMain.handle("heavenzfire:desktop-info", (event) => {
    assertTrustedRenderer(event);
    return {
      name: "HeavenzFire Desktop",
      version: app.getVersion(),
      gateway: "online",
      nodeId: localNodeId,
      dataDirectory: app.getPath("userData"),
    };
  });

  ipcMain.handle("heavenzfire:workspace:select", async (event) => {
    assertTrustedRenderer(event);
    const result = await dialog.showOpenDialog(mainWindow, { properties: ["openDirectory"] });
    return result.canceled ? null : result.filePaths[0] || null;
  });

  ipcMain.handle("heavenzfire:project:register", async (event, project) => {
    assertTrustedRenderer(event);
    return apiRequest("/api/control-plane/projects", {
      method: "POST",
      body: JSON.stringify(project),
    });
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
  session.defaultSession.setPermissionRequestHandler((webContents, permission, callback, details) => {
    let sameOrigin = false;
    try { sameOrigin = new URL(details.requestingUrl || webContents.getURL()).origin === gatewayOrigin; }
    catch { sameOrigin = false; }
    callback(Boolean(mainWindow && webContents === mainWindow.webContents && sameOrigin && permission === "media"));
  });

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

  mainWindow.once("ready-to-show", () => { if (!smokeTest) mainWindow.show(); });
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
    await registerLocalNode();
    registerControlPlaneIpc();
    createApplicationMenu();
    await createWindow();
    await createTray();
    if (smokeTest) {
      const [info, registry, integrity] = await mainWindow.webContents.executeJavaScript("Promise.all([window.heavenzfireDesktop.getDesktopInfo(), window.heavenzfireDesktop.getRegistry(), window.heavenzfireDesktop.verifyRegistry()])");
      if (!info.nodeId || !registry.nodes.some((node) => node.id === info.nodeId) || !integrity.valid) {
        throw new Error("DESKTOP_SMOKE_TEST_FAILED");
      }
      console.log("[Desktop] Smoke test passed: native window, preload bridge, local gateway, node enrollment, and registry verification.");
      app.quit();
    }
  } catch (error) {
    process.exitCode = 1;
    dialog.showErrorBox("HeavenzFire Desktop could not start", error instanceof Error ? error.message : String(error));
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow) mainWindow.show();
});

app.on("before-quit", (event) => {
  if (cleanupComplete) return;
  event.preventDefault();
  if (quitting) return;
  quitting = true;
  if (heartbeatTimer) clearInterval(heartbeatTimer);
  void (async () => {
    if (localNodeId && gatewayOrigin) {
      await apiRequest(`/api/control-plane/nodes/${encodeURIComponent(localNodeId)}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: "offline" }),
      }).catch(() => undefined);
    }
    if (gatewayProcess && !gatewayProcess.killed) gatewayProcess.kill();
    cleanupComplete = true;
    app.quit();
  })();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin" && !tray) app.quit();
});
