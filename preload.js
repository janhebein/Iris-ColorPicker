const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    minimize: () => ipcRenderer.send('win-minimize'),
    close: () => ipcRenderer.send('win-close'),
    pickColor: () => ipcRenderer.invoke('pick-color'),
    setAlwaysOnTop: (flag) => ipcRenderer.send('win-set-top', flag),
    registerShortcut: (keys) => ipcRenderer.send('register-shortcut', keys),
    registerBgShortcut: (keys) => ipcRenderer.send('register-bg-shortcut', keys),
    onShortcutPicked: (callback) => ipcRenderer.on('shortcut-color-picked', (_event, color) => callback(color)),
    onBgShortcutPicked: (callback) => ipcRenderer.on('bg-shortcut-color-picked', (_event, color) => callback(color)),
    getStartupStatus: () => ipcRenderer.invoke('get-startup-status'),
    toggleStartup: (enable) => ipcRenderer.send('toggle-startup', enable),
    openExternal: (url) => ipcRenderer.send('open-external', url),
});
