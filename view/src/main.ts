import { app, BrowserWindow } from 'electron';
import * as path from 'path';

// import WebSocket from 'isomorphic-ws';

// const WebSocket = require('ws');
// const wss = new WebSocket.Server({ port: 7071 });

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    height: 500,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
    width: 500,
  });

  // mainWindow.maximize();
  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, '../index.html'));

  // Open the DevTools.
    // mainWindow.webContents.openDevTools();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  createWindow();

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();

//     const ws = new WebSocket('wss://echo.websocket.org/', {
//       origin: 'https://websocket.org',
//     });

//     ws.onopen = function open() {
//       console.log('connected');
//       ws.send(Date.now());
//     };

//     ws.onclose = function close() {
//       console.log('disconnected');
//     };

//     ws.onmessage = function incoming(data) {
//       console.log(`Roundtrip time: ${Date.now() - data} ms`);

//       setTimeout(function timeout() {
//         ws.send(Date.now());
//       }, 500);
//     };
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

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
