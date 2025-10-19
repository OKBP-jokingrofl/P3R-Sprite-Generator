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
        this.extras = [];
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
        if (resetEyes)
            controller.setSelection(imageSet.eyes[0], "eyes");
        if (resetMouths)
            controller.setSelection(imageSet.mouths[0], "mouth");
    }

    addGeneralImageSet() {
        this.imageSets.set("general", new ImageSet("general", this.outfitImages, this.eyes.images, this.mouth.images, this));
        this.selectedImageSet = this.imageSets.get("general");
    }

    appendImages() {
        const outfitsContainer = document.getElementById("outfits");
        const eyesContainer = document.getElementById("eyes");
        const mouthsContainer = document.getElementById("mouths");
        const extrasContainer = document.getElementById("extrasContainer");

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
        for(const extra of this.extras){
            const nullChoiceContainer = document.createElement("div");
            nullChoiceContainer.classList.add("squareContainer");
            nullChoiceContainer.classList.add("default");
            const labelContainer = document.createElement("div");
            labelContainer.classList.add("squareContainer");
            const label = document.createElement("h4");
            label.innerText = `${extra.name}:`;
            labelContainer.appendChild(label);
            extrasContainer.appendChild(labelContainer);
            const nullChoice = document.createElement("h5");
            nullChoice.innerText = "None";
            nullChoiceContainer.setAttribute("data-type", "extra");
            nullChoiceContainer.classList.add("selectableExtra");
            nullChoiceContainer.onclick = e => {
                controller.setSelection(nullChoiceContainer, "extra");
            };
            nullChoiceContainer.appendChild(nullChoice);
            extrasContainer.appendChild(nullChoiceContainer);
            for(const file of extra.files){
                const choiceContainer = document.createElement("div");
                choiceContainer.classList.add("squareContainer");
                const choiceLabel = document.createElement("h5");
                choiceContainer.src = path.join(extra.path, file);
                choiceContainer.setAttribute("data-type", "extra");
                choiceContainer.xOffset = extra.xOffset;
                choiceContainer.yOffset = extra.yOffset;
                choiceLabel.innerText = file;
                choiceContainer.classList.add("selectableExtra");
                choiceContainer.onclick = e => {
                    controller.setSelection(choiceContainer, "extra");
                }
                choiceContainer.appendChild(choiceLabel);
                extrasContainer.appendChild(choiceContainer);
            }
        }
        this.drawDefaultSprite();
    }

    drawDefaultSprite() {
        controller.setSelection(this.outfitImages[0], "outfit");
        controller.setSelection(this.eyes.images[0], "eyes");
        controller.setSelection(this.mouth.images[0], "mouth");
        controller.selectDefaultExtra();
    }

    requestAssets() {
        if (!this.outfitsLoaded) {
            ipcRenderer.send("requestAssets", this.outfitsPath);
        }
        else {
            this.appendImages();
        }

    }

    addExtra(fileName, xOffset, yOffset) {
        this.extras.push(new Extra(fileName, xOffset, yOffset, this.character, `Pose ${this.name}`));
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