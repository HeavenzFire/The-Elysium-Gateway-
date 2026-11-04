const { contextBridge, ipcRenderer } = require("electron");

const desktopApi = Object.freeze({
  getDesktopInfo: () => ipcRenderer.invoke("heavenzfire:desktop-info"),
  getRegistry: () => ipcRenderer.invoke("heavenzfire:registry:get"),
  selectWorkspace: () => ipcRenderer.invoke("heavenzfire:workspace:select"),
  registerProject: (project) => ipcRenderer.invoke("heavenzfire:project:register", project),
  verifyRegistry: () => ipcRenderer.invoke("heavenzfire:registry:verify"),
  listEvidence: (limit = 100) => ipcRenderer.invoke("heavenzfire:evidence:list", limit),
  verifyEvidence: () => ipcRenderer.invoke("heavenzfire:evidence:verify"),
  appendEvidence: (record) => ipcRenderer.invoke("heavenzfire:evidence:append", record),
});

contextBridge.exposeInMainWorld("heavenzfireDesktop", desktopApi);
