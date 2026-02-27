const { app, BrowserWindow, ipcMain, globalShortcut, Tray, Menu, nativeImage } = require('electron');
const path = require('path');
const fs = require('fs');

function createWindow() {
  const win = new BrowserWindow({
    width: 420,
    height: 660,
    minWidth: 360,
    minHeight: 500,
    frame: false,
    transparent: true,
    resizable: true,
    alwaysOnTop: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
    icon: path.join(__dirname, 'icon.png'),
    backgroundColor: '#00000000',
  });

  win.loadFile('index.html');
  return win; // Return window reference
}

let mainWindow = null;
let tray = null;

// IPC handlers for window controls
ipcMain.on('win-minimize', (event) => {
  BrowserWindow.fromWebContents(event.sender)?.minimize();
});

ipcMain.on('win-close', (event) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  if (win) {
    win.hide(); // Hide to tray instead of closing
  }
});

ipcMain.on('win-set-top', (event, flag) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  if (win) {
    win.setAlwaysOnTop(flag, 'screen-saver'); // Use highest possible level
  }
});

ipcMain.handle('get-startup-status', () => {
  return app.getLoginItemSettings().openAtLogin;
});

ipcMain.on('toggle-startup', (event, enable) => {
  app.setLoginItemSettings({
    openAtLogin: enable,
    path: app.getPath('exe')
  });
});

ipcMain.on('open-external', (event, url) => {
  require('electron').shell.openExternal(url);
});

ipcMain.handle('pick-color', async () => {
  try {
    const { getColorHexRGB } = require('electron-color-picker');
    const color = await getColorHexRGB();
    return color; // returns e.g. '#FF0000' or '' if canceled
  } catch (err) {
    console.error('Color picker error:', err);
    return null;
  }
});

let currentShortcut = null;

ipcMain.on('register-shortcut', (event, keys) => {
  if (currentShortcut) {
    globalShortcut.unregister(currentShortcut);
  }

  if (!keys) return; // allows clearing shortcut by sending empty string

  try {
    const success = globalShortcut.register(keys, async () => {
      try {
        const { getColorHexRGB } = require('electron-color-picker');
        const color = await getColorHexRGB();
        if (color && mainWindow) {
          mainWindow.webContents.send('shortcut-color-picked', color);
          mainWindow.show(); // Bring app to front when picked
        }
      } catch (err) {
        console.error('Global shortcut picker error:', err);
      }
    });

    if (success) {
      currentShortcut = keys;
    } else {
      console.error('Failed to register shortcut', keys);
    }
  } catch (e) {
    console.error('Invalid shortcut string', e);
  }
});

app.whenReady().then(() => {
  mainWindow = createWindow();

  // Create Tray
  const iconPath = path.join(__dirname, 'icon.png');
  const trayIcon = fs.existsSync(iconPath)
    ? nativeImage.createFromPath(iconPath)
    : nativeImage.createFromDataURL('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAA6SURBVDhPY/z//z8DzQAT1MCQAaMGoAHEVAGjBgwbMAxmgBEww/QzMAJmmH4GRsAM08/ACJhh+hkoYAAWzCEF13kO5wAAAABJRU5ErkJggg==');

  tray = new Tray(trayIcon);
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Show Color Picker', click: () => mainWindow.show() },
    { type: 'separator' },
    {
      label: 'Quit', click: () => {
        app.isQuitting = true;
        app.quit();
      }
    }
  ]);
  tray.setToolTip('Color Picker');
  tray.setContextMenu(contextMenu);
  tray.on('click', () => {
    mainWindow.show();
  });
});

app.on('window-all-closed', () => {
  // Overriding default behavior to stay alive for tray
  globalShortcut.unregisterAll();
  app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    mainWindow = createWindow();
  }
});
