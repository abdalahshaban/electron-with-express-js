"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var path = require("path");
var server = require('./app.js');
var tray = null;
var mainWindow = null;
var gotTheLock = electron_1.app.requestSingleInstanceLock();
if (!gotTheLock) {
    electron_1.app.quit();
}
else {
    electron_1.app.on('second-instance', function (event, commandLine, workingDirectory) {
        // Someone tried to run a second instance, we should focus our window.
        if (mainWindow) {
            if (mainWindow.isMinimized())
                mainWindow.restore();
            mainWindow.focus();
        }
    });
    // Create win, load the rest of the app, etc...
    electron_1.app.whenReady().then(createWindow);
}
function createWindow() {
    mainWindow = new electron_1.BrowserWindow({
        frame: false,
        show: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: true,
            enableRemoteModule: true // true if you want to run 2e2 test  with Spectron or use remote module in renderer context (ie. Angular)
        },
    });
    mainWindow.loadURL('http://localhost:3000');
    mainWindow.hide();
    initTray();
}
function initTray() {
    tray = new electron_1.Tray(path.join(__dirname, './assets/img/icon.jpg'));
    var contextMenu = electron_1.Menu.buildFromTemplate([
        {
            label: 'App Name',
            click: function () {
            }
        },
        {
            label: 'Quit',
            type: 'normal',
            click: function () {
                electron_1.app.quit();
            }
        }
    ]);
    tray.setToolTip('App Name');
    tray.setContextMenu(contextMenu);
    tray.on('double-click', function (event) {
        console.log('double-click');
    });
}
electron_1.app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        electron_1.app.quit();
    }
});
electron_1.app.on('will-quit', function (event) {
    console.log('will-quit');
});
electron_1.app.on('activate', function () {
    if (electron_1.BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
