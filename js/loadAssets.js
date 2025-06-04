const { ipcMain, ipcRenderer, shell } = require('electron');
const path = require('path');
let outfitsLoaded = false;
let mouthLoaded = false;
let eyesLoaded = false;
let appPath = "";
let outputFolder = "";

ipcRenderer.send("requestAppPath");
ipcRenderer.on("appPath", (e, response) => {
    appPath = response;
    document.getElementById("openOutput").onclick = (e) => {
        shell.openPath(outputFolder);
    };
});

ipcRenderer.on("outputFolder", (e, response) => {
    outputFolder = response;
});

ipcRenderer.on("alert", (e, message) => {
    console.log(message);
});

function srcToImgElement(src, type) {
    let newElement = document.createElement("img");
    newElement.classList.add('selection');
    newElement.src = src;
    newElement.setAttribute("data-type", type);
    return newElement;
}

ipcRenderer.on("images", (e, images, type) => {
    let elements = [];
    for (let img of images) {
        let newElement = srcToImgElement(img, type);
        newElement.onclick = e => {
            if (newElement.classList.contains("selected"))
                return;
            controller.setSelection(newElement.src, newElement.getAttribute("data-type"), newElement);
        }
        elements.push(newElement);
    }

    switch (type) {
        case "outfit":
            outfitsLoaded = true;
            selectedCharacter.getCurrentPose().setImages(elements);
            break;
        case "eyes":
            eyesLoaded = true;
            selectedCharacter.getCurrentPose().eyes.setImages(elements);
            break;
        case "mouth":
            mouthLoaded = true;
            selectedCharacter.getCurrentPose().mouth.setImages(elements);
            selectedCharacter.getCurrentPose().appendImages();
            break;
        default:
            console.log("Error");
    }

});

ipcRenderer.on("specialCases", (e, cases) => {
    selectedCharacter.getCurrentPose().setSpecialCases(cases);
});

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const img = new Image();
const controller = new SelectionController(canvas, ctx, img, document.getElementById("saveBtn"));

