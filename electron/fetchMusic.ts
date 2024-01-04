const path = require("path")
const fs = require("fs")
const os = require("os")

function pathToMusicDir() {
    const username = os.userInfo().username
    if (process.platform === "win32") return `C:\\Users\\${username}\\Music`
    else if (process.platform === "linux") return `/home/${username}/Music`
    else if (process.platform === "darwin") return `/Users/${username}/Music`
    else return null
}

export function fetchMusic() {
    const musicDir = pathToMusicDir()
    if (!musicDir) return []

    const musicList = []
    const musicListRaw = fs.readdirSync(musicDir)
    for (const music of musicListRaw) {
        const musicPath = path.join(musicDir, music)
        const musicStat = fs.statSync(musicPath)
        if (musicStat.isFile()) musicList.push(musicPath)
    }
    return musicList
}
