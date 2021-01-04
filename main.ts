import { app, Tray, Menu, BrowserWindow, dialog, remote } from 'electron';
import * as path from 'path';
import * as fs from 'fs';
const screenshot = require('screenshot-desktop')
const server = require('./app.js');

let tray: Tray = null;
let mainWindow: BrowserWindow = null;

const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
    app.quit();
} else {
    app.on('second-instance', (event, commandLine, workingDirectory) => {

        // Someone tried to run a second instance, we should focus our window.
        if (mainWindow) {
            if (mainWindow.isMinimized()) mainWindow.restore()
            mainWindow.focus()
        }
    });

    // Create win, load the rest of the app, etc...
    app.whenReady().then(createWindow);
}

function createWindow() {

    mainWindow = new BrowserWindow({
        frame: false,
        show: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: true,  // false if you want to run 2e2 test with Spectron
            enableRemoteModule: true // true if you want to run 2e2 test  with Spectron or use remote module in renderer context (ie. Angular)
        },
    });

    
    mainWindow.loadURL('http://localhost:3000');
    mainWindow.hide();
    initTray();
    screenshot({ format: 'png', filename: 'test.png' });

}


function initTray() {

    tray = new Tray(path.join(__dirname, './assets/img/icon.jpg'));
    const contextMenu = Menu.buildFromTemplate([
        {
            label: 'App Name',
            click: function () {
                console.log(mainWindow.title);
            }
        },
        {
            label: 'Quit',
            type: 'normal',
            role: 'quit',
            toolTip: "will exit from app",
            click: function () {
                app.quit();
            }
        }
    ]);
    tray.setToolTip('App Name');
    tray.setContextMenu(contextMenu);

    tray.on('double-click', (event) => {
        console.log('double-click');
    })

}

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('will-quit', (event) => {
    console.log('will-quit');
})

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});




