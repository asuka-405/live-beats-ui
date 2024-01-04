import "./list.css"
import "./style.css"

let music: Array<string> = []

window.ipcRenderer.on("music", (_event, message) => {
    const musicList = document.querySelector(".music-list")
    if (!musicList) return
    musicList.innerHTML = ""

    music = message

    message.forEach((music: any) => {
        const cover = "https://loremflickr.com/480/480/abstract"
        const data = music.split(".")[0].split("-")
        const track = data[0].split("/").pop() || "Unknown"
        const artist = data[1] || "Unknown"
        const node = getMusicNode(cover, track, artist)
        musicList.appendChild(node)
    })
})

function getMusicNode(cover: string, name: string, artist: string) {
    const musicNode = document.createElement("div")
    musicNode.className = "music"
    const coverNode = document.createElement("div")
    coverNode.className = "cover"
    coverNode.style.backgroundImage = `url(${cover})`
    musicNode.appendChild(coverNode)
    const trackNode = document.createElement("div")
    trackNode.className = "track"
    trackNode.innerText = name
    musicNode.appendChild(trackNode)
    const artistNode = document.createElement("div")
    artistNode.className = "artist"
    artistNode.innerText = artist
    musicNode.appendChild(artistNode)
    document.getElementById("music-list")?.appendChild(musicNode)
    return musicNode
}
