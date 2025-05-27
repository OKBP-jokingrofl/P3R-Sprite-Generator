const { ipcMain, ipcRenderer, shell } = require('electron');
const path = require('path');
let outfitsLoaded = false;
let mouthLoaded = false;
let eyesLoaded = false;
let appPath = "";
//let kimonoElements = [];
//let nonKimonoElements = [];
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

ipcRenderer.on("images", (e, images, type) => {
    //console.log("Received images:");
    //console.log(images);
    //let container = document.getElementById("imgContainer");
    let elements = [];
    for (let img of images) {
        let newElement = document.createElement("img");
        newElement.classList.add('selection');
        newElement.src = img;
        // if (img.includes("-ki")) { //gather hair ornament elements in a list
        //     newElement.setAttribute("data-ki", "true");
        //     kimonoElements.push(newElement);
        // }
        // else if (type === "eyes") { //gather non hair ornament elements in a list
        //     nonKimonoElements.push(newElement);
        // }
        // if (img.includes("kimono")) {
        //     newElement.setAttribute("data-kimono", "true");
        // }
        newElement.setAttribute("data-type", type);
        //container.appendChild(newElement);
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
            selectedCharacter.getCurrentPose().displayImages();
            break;
        default:
            console.log("Error");
    }

});

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const img = new Image();
const controller = new SelectionController(canvas, ctx, img, document.getElementById("saveBtn"));

