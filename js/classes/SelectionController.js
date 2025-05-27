const { Jimp } = require("jimp");

class SelectionController {

    constructor(canvas, ctx, img, saveBtn) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.img = img;
        this.outfit = null;
        this.mouth = null;
        this.eyes = null;
        this.toast = document.querySelector(".toast");
        this.imgContainer = document.getElementById("imgContainer");
        this.img.onload = () => {
            console.log("onload triggered");
            this.clearCanvas();
            this.canvas.width = this.img.naturalWidth;
            this.canvas.height = this.img.naturalHeight;
            this.ctx.drawImage(this.img, 0, 0, this.canvas.width, this.canvas.height);
        };
        this.saveBtn = saveBtn;
        this.saveBtn.onclick = e => {
            this.saveSprite();
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
        this.imgContainer.innerHTML = "";
        if (this.outfit)
            this.outfit.element.classList.remove("selected");
        if (this.eyes)
            this.eyes.element.classList.remove("selected");
        if (this.mouth)
            this.mouth.element.classList.remove("selected");
        this.outfit = null;
        this.eyes = null;
        this.mouth = null;
        this.showingKimonoElements = false;
    }

    saveSprite() {
        let fileName = Math.floor(Date.now() * Math.random());
        //this.img.write(`output/${fileName}.png`);
        this.img.write(`${outputFolder}/${fileName}.png`);
        document.getElementById("message").innerText = `Saved image as ${fileName}.png`;
    }

    async drawSpriteToCanvas() {
        if (this.outfit && this.eyes && this.mouth) {
            const outfit = await Jimp.read(this.outfit.src);
            const eyes = await Jimp.read(this.eyes.src);
            const mouth = await Jimp.read(this.mouth.src);
            outfit.composite(eyes, selectedCharacter.getCurrentPose().eyes.offsetX, selectedCharacter.getCurrentPose().eyes.offsetY);
            outfit.composite(mouth, selectedCharacter.getCurrentPose().mouth.offsetX, selectedCharacter.getCurrentPose().mouth.offsetY);
            const imageData = new ImageData(
                new Uint8ClampedArray(outfit.bitmap.data),
                outfit.bitmap.width,
                outfit.bitmap.height
            );

            this.img = outfit;
            this.canvas.width = outfit.bitmap.width;
            this.canvas.height = outfit.bitmap.height;
            // Write back to the canvas
            this.ctx.putImageData(imageData, 0, 0);
        }
    }

    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    setSelection(src, type, element) {
        element.classList.add("selected");

        switch (type) {
            case "outfit":
                if (selectedCharacter.characterHandle) {
                    selectedCharacter.characterHandle.handleSelection(element);
                }
                if (this.outfit)
                    this.outfit.element.classList.remove("selected");
                this.outfit = { src: src, element: element };
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