class Pose {
    constructor(name, eyes, mouth, character) {
        this.name = name;
        this.character = character;
        this.eyes = eyes;
        this.mouth = mouth;
        this.eyes.pose = this;
        this.mouth.pose = this;
        this.outfitImages = [];
        this.specialOutfits = [];
        this.characterFolderName = character.folderName;
        this.outfitsPath = path.join(__dirname, "assets", this.characterFolderName, `Pose ${name}`);
        this.eyesPath = path.join(__dirname, "assets", this.characterFolderName, `Pose ${name}`, "Eyes");
        this.mouthPath = path.join(__dirname, "assets", this.characterFolderName, `Pose ${name}`, "Mouth");
        this.outfitsLoaded = false;
        this.imageSets = new Map();
        this.selectedImageSet = null;
    }

    selectImageSet(imageSet, resetEyes, resetMouths) {
        this.selectedImageSet = imageSet;
        if(resetEyes)
            controller.setSelection(imageSet.eyes[0], "eyes");
        if(resetMouths)
            controller.setSelection(imageSet.mouths[0], "mouth");
    }

    addGeneralImageSet() {
        this.imageSets.set("general", new ImageSet("general", this.outfitImages, this.eyes.images, this.mouth.images, this));
        this.selectedImageSet = this.imageSets.get("general");
    }

    appendImages() {
        let outfitsContainer = document.getElementById("outfits");
        const eyesContainer = document.getElementById("eyes");
        const mouthsContainer = document.getElementById("mouths")

        for (const image of this.outfitImages)
            outfitsContainer.appendChild(image);
        if (this.specialOutfits.length > 0) {
            for (const specialOutfit of this.specialOutfits) {
                outfitsContainer.appendChild(specialOutfit.outfitElement);
                for (const eye of specialOutfit.eyes)
                    eyesContainer.appendChild(eye);
                for (const mouth of specialOutfit.mouths)
                    mouthsContainer.appendChild(mouth);
            }
        }
        this.eyes.appendImages();
        this.mouth.appendImages();
        this.drawDefaultSprite();
    }

    drawDefaultSprite() {
        controller.setSelection(this.outfitImages[0], "outfit");
        controller.setSelection(this.eyes.images[0], "eyes");
        controller.setSelection(this.mouth.images[0], "mouth");
    }

    requestAssets() {
        if (!this.outfitsLoaded) {
            ipcRenderer.send("requestAssets", this.outfitsPath);
        }
        else {
            this.appendImages();
        }
        
    }

    setImages(images) {
        this.outfitImages = images;
        this.outfitsLoaded = true;
    }

    setSpecialOutfits(specialCases) {
        for (const specialCase of specialCases) {
            const outfitsContainer = document.getElementById("outfits");
            const eyesContainer = document.getElementById("eyes");
            const mouthsContainer = document.getElementById("mouths");
            const eyes = [];
            const mouths = [];
            if (specialCase.eyes) {
                for (const eye of specialCase.eyes) {
                    let newElement = srcToImgElement(eye, "eyes", specialCase.name);
                    newElement.style.display = "none";
                    eyes.push(newElement);
                    eyesContainer.appendChild(newElement);
                }
            }

            if (specialCase.mouths) {
                for (const mouth of specialCase.mouths) {
                    let newElement = srcToImgElement(mouth, "mouth", specialCase.name);
                    newElement.style.display = "none";
                    mouths.push(newElement);
                    mouthsContainer.appendChild(newElement);
                }
            }

            for (const outfitPath of specialCase.outfitPaths) {
                const newElement = srcToImgElement(outfitPath, "outfit", specialCase.name);
                outfitsContainer.appendChild(newElement);
                const newSpecialOutfit = new SpecialOutfit(newElement, eyes, mouths, specialCase.name, this);
                this.specialOutfits.push(newSpecialOutfit);
            }
        }
    }
}