import { app, BrowserWindow , ipcMain} from 'electron';
import * as path from 'path';
var Gpio = require('onoff').Gpio;
var led4 = new Gpio(4, 'out');
// import WebSocket from 'isomorphic-ws';

// const WebSocket = require('ws');
// const wss = new WebSocket.Server({ port: 7071 });

function createWindow() {
  const mainWindow = new BrowserWindow({
    height: 500,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false
    
    },
  
    width: 500,
    frame:false
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
    console.log("GPIO",arg)
    if(arg==='ON'){
        led4.write(1)
    }
    else{
        led4.write(0)
    }
  });

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
