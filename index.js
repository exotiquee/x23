const { app, BrowserWindow, ipcMain, screen } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
      minWidth: 1080,
      minHeight: 720,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        enableRemoteModule: true,
      },
      // other options
  autoHideMenuBar: true
    });

      // Maximize the window on launch
    mainWindow.maximize();

  
    mainWindow.loadFile(path.join(__dirname, 'index.html'));
  
    mainWindow.on('closed', function () {
      mainWindow = null;
    });
  }

  
  
app.whenReady().then(() => {
  createWindow();
});

// handle app activation events on macOS
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// handle app window close events
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// add IPC event handlers here
