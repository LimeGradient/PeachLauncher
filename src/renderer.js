const {ipcRenderer: ipc} = require('electron-better-ipc');

ipc.answerMain("launchGame", async () => {
    const versionDropdown = document.getElementById("mc-versions")
    return versionDropdown.value
})

ipc.on("updateProgress", (event, progress, total) => {
    const progressBar = document.getElementById("downloadProgress")
    progressBar.value = progress
    progressBar.max = total

    const progressLabel = document.getElementById("progressLabel")
    progressLabel.innerHTML = `${progress}/${total}`
})

document.querySelector('#loginButton').addEventListener("click", () => {
    ipc.invoke("sendLogin")
})

document.querySelector("#launchButton").addEventListener("click", async () => {
    ipc.invoke("launch_game")
})