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

function srcToImgElement(src, type, imageSet="general") {
    let newElement = document.createElement("img");
    newElement.classList.add("selectable");
    newElement.src = src;
    newElement.setAttribute("data-type", type);
    newElement.setAttribute("image-set", imageSet);
    return newElement;
}

ipcRenderer.on("images", (e, images, type) => {
    let elements = [];
    for (let img of images) {
        let newElement = srcToImgElement(img, type);
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
            selectedCharacter.getCurrentPose().addGeneralImageSet();
            break;
        default:
            console.log("Error");
    }

});

ipcRenderer.on("specialOutfits", (e, cases) => {
    selectedCharacter.getCurrentPose().setSpecialOutfits(cases);
});

const controller = new SelectionController(document.getElementById("canvas"), document.getElementById("saveBtn"));