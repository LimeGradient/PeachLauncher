const {Auth} = require("msmc")

const os = require('os')
const crypto = require('crypto')
const storage = require('electron-json-storage')

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
        token.setToken = xboxManager.getMinecraft()
        const dKey = os.cpus()[0].model + " - " + os.hostname() + " - " + os.type();
        console.log(`token: ${(await token).getToken().mcToken}`)

        const cipher = crypto.createCipher('aes-128-cbc', dKey)
        const eToken = cipher.update(xboxManager.msToken.refresh_token, 'utf8', 'hex') + cipher.final('hex')

        storage.set('mc', {
            token: eToken,
        }, (err) => {
            if (err) throw err;
        })

        const decipher = crypto.createDecipher('aes-128-cbc', dKey)
        const dToken = decipher.update(eToken, 'hex', 'utf8') + decipher.final('utf8')
        console.log(`decrypted token: ${dToken}`)
    })
}

exports.login = login