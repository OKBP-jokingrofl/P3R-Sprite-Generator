const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

let win;

const createWindow = () => {
    win = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            experimentalFeatures: true,
            enableRemoteModule: true,
            contextIsolation: false
        },
        width: 1062,
        height: 600
    });
    win.setAspectRatio(1.77);
    win.loadFile('index.html');
}

const getCharacters = () => {
    let characters = [];
    const assetsPath = path.join(app.getAppPath(), "assets");
    fs.readdir(assetsPath, (err, files) => {
        for (const character of files) {
            const characterPath = path.join(app.getAppPath(), "assets", character);
            const results = fs.readdirSync(characterPath);
            for (const file of results) {
                if (file.includes(".png")) {
                    //console.log({ name: character, preview: path.join(characterPath, file) });
                    characters.push({ name: character, preview: path.join(characterPath, file) });
                }
            }
        }
        win.webContents.send("characters", characters);
    });
}

ipcMain.on("requestCharacters", e => {
    getCharacters();
});

ipcMain.on("requestAppPath", e => {
    const outputFolder = path.join(app.getPath("documents"), "P3R Sprites");
    win.webContents.send("appPath", app.getAppPath());
    console.log("Output folder:", outputFolder);
    if(!fs.existsSync(outputFolder)){
        fs.mkdirSync(outputFolder);
        console.log("Output directory created");
    }
    win.webContents.send("outputFolder", outputFolder);
});

//return paths to images in a given directory
function grabImagesFromDir(directory){
    const images = [];
    const files = fs.readdirSync(directory);
    for (const img of files) {
        if (img.includes(".png")) {
            const completePath = path.join(directory, img);
            images.push(completePath);
        }
    }
    return images;
}


ipcMain.on("requestAssets", (e, assetsPath) => {
    console.log("Received request for", assetsPath);
    const outfits = grabImagesFromDir(assetsPath);
    win.webContents.send("images", outfits, "outfit");
    const eyes = grabImagesFromDir(path.join(assetsPath, "Eyes"));
    win.webContents.send("images", eyes, "eyes");
    const mouths = grabImagesFromDir(path.join(assetsPath, "Mouth"));
    win.webContents.send("images", mouths, "mouth");
});

app.whenReady().then(() => {
    createWindow()
});