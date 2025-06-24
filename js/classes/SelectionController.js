const { Jimp } = require("jimp");

class SelectionController {

    constructor(canvas, saveBtn) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.img = new Image();
        this.outfit = null;
        this.mouth = null;
        this.eyes = null;
        this.specialCase = null;
        this.toast = document.querySelector(".toast");
        this.outfitsContainer = document.getElementById("outfits");
        this.eyesContainer = document.getElementById("eyes");
        this.mouthsContainer = document.getElementById("mouths");
        this.img.onload = () => {
            console.log("onload triggered");
            this.clearCanvas();
            this.canvas.width = this.img.naturalWidth;
            this.canvas.height = this.img.naturalHeight;
            this.ctx.drawImage(this.img, 0, 0, this.canvas.width, this.canvas.height);
        };
        this.saveBtn = saveBtn;
        this.saveBtn.onclick = e => {
            //this.saveSprite();
            this.saveCroppedSprite();
            this.showToast();
        };

    }

    showToast() {
        this.toast.style.display = "block";
        const hideT = this.hideToast.bind(this);
        setTimeout(hideT, 4000);
    }

    hideToast() {
        this.toast.style.display = "none";
    }

    clearImages() {
        this.outfitsContainer.innerHTML = "";
        this.eyesContainer.innerHTML = "";
        this.mouthsContainer.innerHTML = "";
        this.deselectOutfit();
        this.deselectEyes();
        this.deselectMouth();
    }

    deselectOutfit() {
        if (this.outfit)
            this.deselectElement(this.outfit.element);
    }

    deselectEyes() {
        if (this.eyes)
            this.deselectElement(this.eyes.element);
    }

    deselectMouth() {
        if (this.mouth)
            this.deselectElement(this.mouth.element);
    }

    deselectElement(element) {
        element.classList.remove("selected");
        switch (element.getAttribute("data-type")) {
            case "outfit":
                this.outfit = null;
                break;
            case "eyes":
                this.eyes = null;
                break;
            case "mouth":
                this.mouth = null;
                break;
            default:
                console.log("Error: Deselecting unknown type");
        }
    }

    saveSprite() {
        let fileName = Math.floor(Date.now() * Math.random());
        this.img.write(`${outputFolder}/${fileName}.png`);
        document.getElementById("message").innerText = `Saved image as ${fileName}.png`;
    }

    autocropSprite() {
        this.img.autocrop({ cropOnlyFrames: false });
    }

    saveCroppedSprite() {
        let fileName = Math.floor(Date.now() * Math.random());
        this.img.autocrop({ cropOnlyFrames: false });
        console.log(`Saving cropped image as ${outputFolder}/${fileName}.png`);
        this.img.write(`${outputFolder}/${fileName}.png`);
        document.getElementById("message").innerText = `Saved image as ${fileName}.png`;
    }

    updateCanvas() {
        const imageData = new ImageData(
            new Uint8ClampedArray(this.img.bitmap.data),
            this.img.bitmap.width,
            this.img.bitmap.height
        );
        this.canvas.width = this.img.bitmap.width;
        this.canvas.height = this.img.bitmap.height;
        // Write back to the canvas
        this.ctx.putImageData(imageData, 0, 0);
    }

    async drawSpriteToCanvas() {
        if (this.outfit && this.eyes && this.mouth) {
            const outfit = await Jimp.read(this.outfit.src);
            const eyes = await Jimp.read(this.eyes.src);
            const mouth = await Jimp.read(this.mouth.src);
            outfit.composite(mouth, selectedCharacter.getCurrentPose().mouth.offsetX, selectedCharacter.getCurrentPose().mouth.offsetY);
            outfit.composite(eyes, selectedCharacter.getCurrentPose().eyes.offsetX, selectedCharacter.getCurrentPose().eyes.offsetY);

            // if (selectedCharacter.name === "Igor") {
            //     outfit.composite(mouth, selectedCharacter.getCurrentPose().mouth.offsetX, selectedCharacter.getCurrentPose().mouth.offsetY);
            //     outfit.composite(eyes, selectedCharacter.getCurrentPose().eyes.offsetX, selectedCharacter.getCurrentPose().eyes.offsetY);
            // }
            // else {
            //     outfit.composite(eyes, selectedCharacter.getCurrentPose().eyes.offsetX, selectedCharacter.getCurrentPose().eyes.offsetY);
            //     outfit.composite(mouth, selectedCharacter.getCurrentPose().mouth.offsetX, selectedCharacter.getCurrentPose().mouth.offsetY);
            // }

            this.img = outfit;
            this.updateCanvas();
        }
    }

    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    setOutfit(src, outfitElement) {
        this.outfit = { src: src, element: outfitElement };
    }

    selectDefaultEyes() {
        this.selectElement(selectedCharacter.getCurrentPose().eyes.images[0], "eyes");
    }

    selectDefaultMouth() {
        this.selectElement(selectedCharacter.getCurrentPose().mouth.images[0], "mouth");
    }

    selectElement(element, type) {
        if (element)
            this.setSelection(element, type);
        else
            console.log("Invalid parameters for selectElement:", element, type);
    }

    setSelection(element, type) {
        const src = element.src;
        if (element.classList.contains("selected"))
            return;
        element.classList.add("selected");
        switch (type) {
            case "outfit":
                if (this.outfit) {
                    this.outfit.element.classList.remove("selected");
                }
                this.setOutfit(src, element);
                const currentPose = selectedCharacter.getCurrentPose();
                const imageSetName = element.getAttribute("image-set");
                if (currentPose.selectedImageSet) {
                    currentPose.imageSets.get(imageSetName).onImageSetChange(currentPose.selectedImageSet, currentPose.imageSets.get(imageSetName));
                }
                else
                    currentPose.selectedImageSet = currentPose.imageSets.get(imageSetName);
                break;
            case "eyes":
                if (this.eyes)
                    this.eyes.element.classList.remove("selected");
                this.eyes = { src: src, element: element };
                break;
            case "mouth":
                if (this.mouth)
                    this.mouth.element.classList.remove("selected");
                this.mouth = { src: src, element: element };
                break;
            default:
                console.log("Invalid selection");
        }

        this.drawSpriteToCanvas(src);
    }

}