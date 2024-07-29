const {ipcRenderer: ipc} = require('electron-better-ipc');

document.querySelector('#loginButton').addEventListener("click", () => {
    ipc.invoke("sendLogin")
})