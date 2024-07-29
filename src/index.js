const {app, BrowserWindow} = require('electron')
const {ipcMain: ipc} = require('electron-better-ipc')

const path = require('path')

const auth = require('./auth')

const window = {
    window: null,
    get getWindow() {return this.window},
    set setWindow(win) {this.window = win}
}
exports.window = window

function createWindow() {
    const win = new BrowserWindow({
        width: 1280,
        height: 720,
        title: "HySky Client",
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    })
    window.setWindow = win
    win.loadFile(path.join(__dirname, "pages/index.html"))
}

app.whenReady().then(() => {
    createWindow()

    ipc.handle("sendLogin", () => auth.login())
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })