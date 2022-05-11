import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Gpio = require('onoff').Gpio;
const led4 = new Gpio(4, 'out');
const led17 = new Gpio(17, 'in', 'both');
let statusPorta = 0;
let win: BrowserWindow;
function createWindow() {
  const mainWindow = new BrowserWindow({
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false,
    },
    fullscreen: true,
    width: 1024,
    frame: false,
  });

  mainWindow.loadFile(path.join(__dirname, '../index.html'));

  led17.watch((err: Error, value: number) => {
    if (err) throw err;
    statusPorta = value;
  });
  win = mainWindow;
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

ipcMain.on('GPIO', (event, arg) => {
  console.log('GPIO', arg);
  led4.write(PortaStatus[arg]);
  setTimeout(() => {
    led4.write(PortaStatus.OFF);
    if (statusPorta == PortaStatus.OFF) {
      win.webContents.send('fechar-modal', null);
      return;
    }
    const interval = setInterval(() => {
      if (statusPorta == PortaStatus.OFF) {
        clearInterval(interval);
        win.webContents.send('fechar-modal', null);
        win.webContents.send('porta-fechada', null);
      }
    }, 1);
  }, 3000);
});

ipcMain.handle('status-porta', () => statusPorta);

enum PortaStatus {
  ON = 1,
  OFF = 0,
}

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
