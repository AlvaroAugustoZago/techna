import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Gpio = require('onoff').Gpio;
const led4 = new Gpio(4, 'out');
const led17 = new Gpio(17, 'in');
// import WebSocket from 'isomorphic-ws';

// const WebSocket = require('ws');
// const wss = new WebSocket.Server({ port: 7071 });

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
  //app.allowRendererProcessReuse = false

  // mainWindow.webContents.openDevTools();
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
  if (arg === 'ON') {
    led4.write(1);
  } else {
    led4.write(0);
  }
});

ipcMain.handle('is-porta-aberta', () => led17.readSync() === 1);

async function waitUntil(condition: boolean) {
  return await new Promise((resolve) => {
    const interval = setInterval(() => {
      if (condition) {
        resolve('foo');
        clearInterval(interval);
      }
    }, 5);
  });
}
ipcMain.handle('wait-close-port', async (event) => {
  return await waitUntil(led17.readSync() === 0);
});

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
