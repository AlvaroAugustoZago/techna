import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
enum PortaStatus {
  ON = 1,
  OFF = 0,
}

// eslint-disable-next-line @typescript-eslint/no-var-requires
const Gpio = require('onoff').Gpio;
const eletroima = new Gpio(14, 'out');
const porta = new Gpio(17, 'in', 'both');
let statusPorta = PortaStatus.OFF;
let ultimoStatusPorta = PortaStatus.OFF;

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
  let quantasVezesTrocouPara1 = 0;
  mainWindow.loadFile(path.join(__dirname, '../index.html'));
  setInterval(() => {
      ultimoStatusPorta = statusPorta;
      statusPorta = porta.readSync();      
      
      quantasVezesTrocouPara1+=1;
      if (statusPorta == PortaStatus.OFF) {  
        if (ultimoStatusPorta == PortaStatus.ON) {
          console.log("porta-fechada")
          win.webContents.send('porta-fechada', null);
        }
      }
      if (ultimoStatusPorta == PortaStatus.OFF) {
        if (statusPorta == PortaStatus.ON) {
          console.log("porta-aberta:", quantasVezesTrocouPara1)
          win.webContents.send('show-modal', null);
          win.webContents.send('porta-aberta', null);  
        }
      }

  }, 1)
  win = mainWindow;
}

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

// ipcMain.on('start', () => {
//   ultimoStatusPorta = PortaStatus.OFF;
//   statusPorta = PortaStatus.OFF;
//   const interval = setInterval(() => {
//     if (ultimoStatusPorta == PortaStatus.ON) {
//       if (statusPorta == PortaStatus.OFF) {
//         clearInterval(interval);
//         // win.webContents.send('fechar-modal', null);
//         win.webContents.send('porta-fechada', null);
//       }
//     }
//   }, 1);
  
// })

ipcMain.on('GPIO', (event, arg) => {
  console.log('GPIO', arg);
  eletroima.write(PortaStatus[arg]);
  if (Number(PortaStatus[arg]) == PortaStatus.ON) {
    setTimeout(() => {
      eletroima.write(PortaStatus.OFF);
      if (statusPorta == PortaStatus.OFF) {
        win.webContents.send('fechar-modal', null);
        return;
      }
    }, 3000);
  }
});

ipcMain.handle('status-porta', () => statusPorta);


// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
