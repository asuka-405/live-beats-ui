var playerTrack = document.querySelector("#player-track"),
    bgArtwork = document.querySelector("#bg-artwork"),
    bgArtworkUrl,
    albumName = document.querySelector("#album-name"),
    trackName = document.querySelector("#track-name"),
    albumArt = document.querySelector("#album-art"),
    sArea = document.querySelector("#s-area"),
    seekBar = document.querySelector("#seek-bar"),
    trackTime = document.querySelector("#track-time"),
    insTime = document.querySelector("#ins-time"),
    sHover = document.querySelector("#s-hover"),
    playPauseButton = document.querySelector("#play-pause-button"),
    i = playPauseButton.querySelector("i"),
    tProgress = document.querySelector("#current-time"),
    tTime = document.querySelector("#track-length"),
    seekT,
    seekLoc,
    seekBarPos,
    cM,
    ctMinutes,
    ctSeconds,
    curMinutes,
    curSeconds,
    durMinutes,
    durSeconds,
    playProgress,
    bTime,
    nTime = 0,
    buffInterval = null,
    tFlag = false,
    albums = [
        "Dawn",
        "Me & You",
        "Electro Boy",
        "Home",
        "Proxy (Original Mix)",
    ],
    trackNames = [
        "Skylike - Dawn",
        "Alex Skrindo - Me & You",
        "Kaaze - Electro Boy",
        "Jordan Schor - Home",
        "Martin Garrix - Proxy",
    ],
    albumArtworks = ["_1", "_2", "_3", "_4", "_5"],
    trackUrl = [
        "https://raw.githubusercontent.com/himalayasingh/music-player-1/master/music/2.mp3",
        "https://raw.githubusercontent.com/himalayasingh/music-player-1/master/music/1.mp3",
        "https://raw.githubusercontent.com/himalayasingh/music-player-1/master/music/3.mp3",
        "https://raw.githubusercontent.com/himalayasingh/music-player-1/master/music/4.mp3",
        "https://raw.githubusercontent.com/himalayasingh/music-player-1/master/music/5.mp3",
    ],
    playPreviousTrackButton = document.querySelector("#play-previous"),
    playNextTrackButton = document.querySelector("#play-next"),
    currIndex = -1,
    currAlbum,
    currTrackName,
    currArtwork,
    audio = new Audio()

function playPause() {
    setTimeout(function () {
        if (audio.paused) {
            playerTrack.classList.add("active")
            albumArt.classList.add("active")
            checkBuffering()
            i.className = "fas fa-pause"
            audio.play()
        } else {
            playerTrack.classList.remove("active")
            albumArt.classList.remove("active")
            clearInterval(buffInterval)
            albumArt.classList.remove("buffering")
            i.className = "fas fa-play"
            audio.pause()
        }
    }, 300)
}

function showHover(event) {
    seekBarPos = sArea.getBoundingClientRect()
    seekT = event.clientX - seekBarPos.left
    seekLoc = audio.duration * (seekT / sArea.offsetWidth)

    sHover.style.width = seekT + "px"

    cM = seekLoc / 60

    ctMinutes = Math.floor(cM)
    ctSeconds = Math.floor(seekLoc - ctMinutes * 60)

    if (ctMinutes < 0 || ctSeconds < 0) return

    if (ctMinutes < 0 || ctSeconds < 0) return

    if (ctMinutes < 10) ctMinutes = "0" + ctMinutes
    if (ctSeconds < 10) ctSeconds = "0" + ctSeconds

    if (isNaN(ctMinutes) || isNaN(ctSeconds)) insTime.textContent = "--:--"
    else insTime.textContent = ctMinutes + ":" + ctSeconds

    insTime.style.left = seekT + "px"
    insTime.style.marginLeft = "-21px"
    insTime.style.display = "block"
}

function hideHover() {
    sHover.style.width = "0"
    insTime.textContent = "00:00"
    insTime.style.left = "0px"
    insTime.style.marginLeft = "0px"
    insTime.style.display = "none"
}

function playFromClickedPos() {
    audio.currentTime = seekLoc
    seekBar.style.width = seekT + "px"
    hideHover()
}

function updateCurrTime() {
    nTime = new Date()
    nTime = nTime.getTime()

    if (!tFlag) {
        tFlag = true
        trackTime.classList.add("active")
    }

    curMinutes = Math.floor(audio.currentTime / 60)
    curSeconds = Math.floor(audio.currentTime - curMinutes * 60)

    durMinutes = Math.floor(audio.duration / 60)
    durSeconds = Math.floor(audio.duration - durMinutes * 60)

    playProgress = (audio.currentTime / audio.duration) * 100

    if (curMinutes < 10) curMinutes = "0" + curMinutes
    if (curSeconds < 10) curSeconds = "0" + curSeconds

    if (durMinutes < 10) durMinutes = "0" + durMinutes
    if (durSeconds < 10) durSeconds = "0" + durSeconds

    if (isNaN(curMinutes) || isNaN(curSeconds)) tProgress.textContent = "00:00"
    else tProgress.textContent = curMinutes + ":" + curSeconds

    if (isNaN(durMinutes) || isNaN(durSeconds)) tTime.textContent = "00:00"
    else tTime.textContent = durMinutes + ":" + durSeconds

    if (
        isNaN(curMinutes) ||
        isNaN(curSeconds) ||
        isNaN(durMinutes) ||
        isNaN(durSeconds)
    )
        trackTime.classList.remove("active")
    else trackTime.classList.add("active")

    seekBar.style.width = playProgress + "%"

    if (playProgress == 100) {
        i.className = "fa fa-play"
        seekBar.style.width = "0"
        tProgress.textContent = "00:00"
        albumArt.classList.remove("buffering")
        clearInterval(buffInterval)
    }
}

function checkBuffering() {
    clearInterval(buffInterval)
    buffInterval = setInterval(function () {
        if (nTime == 0 || bTime - nTime > 1000)
            albumArt.classList.add("buffering")
        else albumArt.classList.remove("buffering")

        bTime = new Date()
        bTime = bTime.getTime()
    }, 100)
}

function selectTrack(flag) {
    if (flag == 0 || flag == 1) ++currIndex
    else --currIndex

    if (currIndex > -1 && currIndex < albumArtworks.length) {
        if (flag == 0) i.className = "fa fa-play"
        else {
            albumArt.classList.remove("buffering")
            i.className = "fa fa-pause"
        }

        seekBar.style.width = "0"
        trackTime.classList.remove("active")
        tProgress.textContent = "00:00"
        tTime.textContent = "00:00"

        currAlbum = albums[currIndex]
        currTrackName = trackNames[currIndex]
        currArtwork = albumArtworks[currIndex]

        audio.src = trackUrl[currIndex]

        nTime = 0
        bTime = new Date()
        bTime = bTime.getTime()

        if (flag != 0) {
            audio.play()
            playerTrack.classList.add("active")
            albumArt.classList.add("active")

            clearInterval(buffInterval)
            checkBuffering()
        }

        albumName.textContent = currAlbum
        trackName.textContent = currTrackName
        albumArt.querySelector("img.active").classList.remove("active")
        document.querySelector("#" + currArtwork).classList.add("active")

        bgArtworkUrl = document
            .querySelector("#" + currArtwork)
            .getAttribute("src")

        bgArtwork.style.backgroundImage = "url(" + bgArtworkUrl + ")"
    } else {
        if (flag == 0 || flag == 1) --currIndex
        else ++currIndex
    }
}

function initPlayer() {
    selectTrack(0)

    audio.loop = false

    playPauseButton.addEventListener("click", playPause)

    sArea.addEventListener("mousemove", function (event) {
        showHover(event)
    })

    sArea.addEventListener("mouseout", hideHover)

    sArea.addEventListener("click", playFromClickedPos)

    audio.addEventListener("timeupdate", updateCurrTime)

    playPreviousTrackButton.addEventListener("click", function () {
        selectTrack(-1)
    })
    playNextTrackButton.addEventListener("click", function () {
        selectTrack(1)
    })
}

window.ipcRenderer.on("music", (event, message) => {
    message.forEach((music) => {
        const audioElement = new Audio(music)
        albums.push(audioElement.ablum || "Unknown")
        const title = music.split("/").pop().split(".")[0]
        trackNames.push(title.split("-")[0] || "Unknown")
        albumArtworks.push(`_${Math.floor(Math.random() * 5) + 1}`)
        trackUrl.push(`music://${music.split("/").pop()}`)
    })
})

initPlayer()
