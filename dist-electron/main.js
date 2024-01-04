"use strict";
const electron = require("electron");
const path$1 = require("node:path");
const path = require("path");
const fs = require("fs");
const os = require("os");
function pathToMusicDir() {
  const username = os.userInfo().username;
  if (process.platform === "win32")
    return `C:\\Users\\${username}\\Music`;
  else if (process.platform === "linux")
    return `/home/${username}/Music`;
  else if (process.platform === "darwin")
    return `/Users/${username}/Music`;
  else
    return null;
}
function fetchMusic() {
  const musicDir = pathToMusicDir();
  if (!musicDir)
    return [];
  const musicList = [];
  const musicListRaw = fs.readdirSync(musicDir);
  for (const music of musicListRaw) {
    const musicPath = path.join(musicDir, music);
    const musicStat = fs.statSync(musicPath);
    if (musicStat.isFile())
      musicList.push(musicPath);
  }
  return musicList;
}
process.env.DIST = path$1.join(__dirname, "../dist");
process.env.VITE_PUBLIC = electron.app.isPackaged ? process.env.DIST : path$1.join(process.env.DIST, "../public");
let win;
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
function createWindow() {
  win = new electron.BrowserWindow({
    icon: path$1.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      preload: path$1.join(__dirname, "preload.js")
    }
  });
  win.webContents.on("did-finish-load", () => {
    win == null ? void 0 : win.webContents.send(
      "main-process-message",
      (/* @__PURE__ */ new Date()).toLocaleString()
    );
  });
  win.webContents.on("dom-ready", () => {
    win == null ? void 0 : win.webContents.send("music", fetchMusic());
  });
  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path$1.join(process.env.DIST, "index.html"));
  }
}
electron.app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    electron.app.quit();
    win = null;
  }
});
electron.app.on("activate", () => {
  if (electron.BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
electron.app.whenReady().then(() => {
  createWindow();
  electron.protocol.registerFileProtocol("music", (request, callback) => {
    const url = request.url.replace("musics://", "");
    const filePath = path$1.join("/home/asuka/Music/", url);
    callback({ path: filePath });
  });
});
