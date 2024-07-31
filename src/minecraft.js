const {Client} = require('minecraft-launcher-core')

const path = require('path')
const storage = require('electron-json-storage')

const auth = require("./auth")
const win = require("./index")

const currentDownload = {
    progress: null,
    total: null,

    get getProgress() {return this.progress},
    get getTotal() {return this.total},

    set setProgress(_progress) {this.progress = _progress},
    set setTotal(_total) {this.total = _total},
}

async function launchGame(mcVersion) {
    const launcher = new Client()

    let opts = {
        clientPackage: null,
        authorization: auth.token.getToken.mclc(),
        root: path.join(storage.getDefaultDataPath(), ".minecraft"),
        version: {
            number: mcVersion,
            type: "release",
        },
        memory: {
            max: "6G",
            min: "4G"
        },
    }
    launcher.launch(opts)

    launcher.on('debug', (e) => console.log(e));
    launcher.on('data', (e) => console.log(e));
    launcher.on('progress', (e) => {
        win.window.getWindow.webContents.send("updateProgress", e.task, e.total)
    });
}

exports.launchGame = launchGame
exports.currentDownload = currentDownload