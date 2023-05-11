const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        enableRemoteModule: true,
      },
      // other options
  autoHideMenuBar: true
    });
  
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
