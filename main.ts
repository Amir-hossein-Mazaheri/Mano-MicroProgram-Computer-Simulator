const { join } = require("path");
const { app, BrowserWindow } = require("electron");


if (require("electron-squirrel-startup")) {
  app.quit();
}

const isDev = process.env.IS_DEV === "true";

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    webPreferences: {
      preload: join(__dirname, "preload.ts"),
      nodeIntegration: true,
      contextIsolation: false
    },
  });

    if(isDev) {
      mainWindow.webContents.openDevTools()
      mainWindow.loadURL("http://localhost:5173/")
    } else {
      mainWindow.loadFile(join(__dirname, "dist", "index.html"));
    }
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
