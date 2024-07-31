const {app, BrowserWindow} = require('electron')
const {ipcMain: ipc} = require('electron-better-ipc')

const path = require('path')

const auth = require('./auth')
const mc = require('./minecraft')

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
    auth.refreshLogin()
}

app.whenReady().then(() => {
    createWindow()

    ipc.handle("sendLogin", () => auth.login())

    ipc.handle("launch_game", async () => {
        const mcVersion = await ipc.callFocusedRenderer("launchGame")
        mc.launchGame(mcVersion.toString())
    })

    ipc.answerRenderer("getDownloadProgress", async () => {
        return [mc.currentDownload.getProgress, mc.currentDownload.getTotal]
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })