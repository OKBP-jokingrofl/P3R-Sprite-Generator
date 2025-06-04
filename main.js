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
    if (!fs.existsSync(outputFolder)) {
        fs.mkdirSync(outputFolder);
        console.log("Output directory created");
    }
    win.webContents.send("outputFolder", outputFolder);
});

//return paths to images in a given directory
function grabImagesFromDir(directory) {
    let images = [];
    const folders = [];
    const specialCases = [];
    const specialObjects = [];
    const items = fs.readdirSync(directory);
    for (const item of items) {
        const completePath = path.join(directory, item);
        if (item.includes(".png"))
            images.push(completePath);
        else {
            const stats = fs.statSync(completePath);
            if (stats.isDirectory())
                folders.push(item);
        }
    }
    //console.log("Folders: ", folders);
    for (const folder of folders) {
        if (folder !== "Eyes" && folder !== "Mouth") {
            console.log("Special case found:", folder);
            specialCases.push(folder);
        }
    }
    const allOutfitPaths = [];
    for (const specialCase of specialCases) {
        const outfitPaths = [];
        for (const item of items) {
            if (item.includes(specialCase) && item.includes(".png")) {
                outfitPaths.push(path.join(directory, item));
                allOutfitPaths.push(path.join(directory, item));
            }

        }
        let eyes, x = undefined;
        if (fs.existsSync(path.join(directory, specialCase, "Eyes"))) {
            [eyes, x] = grabImagesFromDir(path.join(directory, specialCase, "Eyes"));
        }

        let specialObject = null;
        if (fs.existsSync(path.join(directory, specialCase, "Mouth"))) {
            const [mouths, y] = grabImagesFromDir(path.join(directory, specialCase, "Mouth"));
            specialObject = new SpecialCase(path.join(directory, specialCase), outfitPaths, eyes, mouths, specialCase);
        }
        else {
            specialObject = new SpecialCase(path.join(directory, specialCase), outfitPaths, eyes, undefined, specialCase);
        }
        specialObjects.push(specialObject);
    }

    images = images.filter(img => !allOutfitPaths.includes(img));

    return [images, specialObjects];
}


ipcMain.on("requestAssets", (e, assetsPath) => {
    console.log("Received request for", assetsPath);
    const [outfits, specialCases] = grabImagesFromDir(assetsPath);
    if (specialCases.length > 0) {
        //console.log(specialCases);
        win.webContents.send("specialCases", specialCases);
    }

    win.webContents.send("images", outfits, "outfit");
    const [eyes] = grabImagesFromDir(path.join(assetsPath, "Eyes"));
    win.webContents.send("images", eyes, "eyes");
    const [mouths] = grabImagesFromDir(path.join(assetsPath, "Mouth"));
    win.webContents.send("images", mouths, "mouth");
});

app.whenReady().then(() => {
    createWindow();
});

class SpecialCase {
    constructor(folderPath, outfitPaths, eyes, mouths, name) {
        this.folderPath = folderPath;
        this.outfitPaths = outfitPaths;
        this.eyes = eyes;
        this.mouths = mouths;
        this.name = name;
    }
}