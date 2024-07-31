const {Auth} = require("msmc")

const os = require('os')
const crypto = require('crypto')
const storage = require('electron-json-storage')
const fs = require('fs')
const path = require('path')

const token = {
    token: null,

    get getToken() {return this.token},
    set setToken(t) {this.token = t}
}

exports.token = token;

async function login() {
    const authManager = new Auth("select_account")
    await authManager.launch("raw").then(async xboxManager => {
        const token = xboxManager.getMinecraft()
        token.setToken = await xboxManager.getMinecraft()
        const dKey = os.cpus()[0].model + " - " + os.hostname() + " - " + os.type();

        const cipher = crypto.createCipher('aes-128-cbc', dKey)
        const eToken = cipher.update(xboxManager.msToken.refresh_token, 'utf8', 'hex') + cipher.final('hex')

        storage.set('mc', {
            token: eToken,
        }, (err) => {
            if (err) throw err;
        })
    })
}

async function refreshLogin() {
    if (fs.existsSync(path.join(storage.getDefaultDataPath(), "mc.json"))) {
        storage.get('mc', (err, data) => {
            if (err) throw err;
            const authManager = new Auth('login')

            const dKey = os.cpus()[0].model + " - " + os.hostname() + " - " + os.type();
            const decipher = crypto.createDecipher('aes-128-cbc', dKey)
            const dToken = decipher.update(data.token, 'hex', 'utf8') + decipher.final('utf8')

            authManager.refresh(dToken).then(async xboxManager => {
                token.setToken = await xboxManager.getMinecraft();
                console.log("logged in")
            })
        })
    }
}

exports.login = login
exports.refreshLogin = refreshLogin