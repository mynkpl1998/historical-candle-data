const electron = require("electron");
const app = electron.app;
const path = require("path");
const url = require("url");
const BrowserWindow = electron.BrowserWindow;


let window;
function createMainWindow() {
    window = new BrowserWindow({
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            sandbox: false
        }
    });
    
    window.loadFile(path.join(__dirname, "html/landing.html"));
    
    //window.webContents.openDevTools();
    
    window.on("ready-to-show", () => {

    })
}

app.on("ready", createMainWindow);
