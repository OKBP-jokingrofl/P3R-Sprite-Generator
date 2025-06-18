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
        this.characterName = character.name;
        this.outfitsPath = path.join(__dirname, "assets", this.characterName, `Pose ${name}`);
        this.eyesPath = path.join(__dirname, "assets", this.characterName, `Pose ${name}`, "Eyes");
        this.mouthPath = path.join(__dirname, "assets", this.characterName, `Pose ${name}`, "Mouth");
        this.outfitsLoaded = false;
        this.imageSets = new Map();

    }

    addGeneralImageSet() {
        this.imageSets.set("general", new ImageSet("general", this.outfitImages, this.eyes.images, this.mouth.images));
    }

    appendImages() {
        let outfitsContainer = document.getElementById("outfits");
        const eyesContainer = document.getElementById("eyes");
        const mouthsContainer = document.getElementById("mouths")
        if (this.specialOutfits.length > 0) {
            for (const specialOutfit of this.specialOutfits) {
                outfitsContainer.appendChild(specialOutfit.outfitElement);
                for (const eye of specialOutfit.eyes)
                    eyesContainer.appendChild(eye);
                for (const mouth of specialOutfit.mouths)
                    mouthsContainer.appendChild(mouth);
            }
        }

        for (const image of this.outfitImages)
            outfitsContainer.appendChild(image);
        this.eyes.appendImages();
        this.mouth.appendImages();
        this.drawDefaultSprite();
    }

    drawDefaultSprite() {
        controller.setSelection(this.outfitImages[0].src, "outfit", this.outfitImages[0]);
        controller.setSelection(this.eyes.images[0].src, "eyes", this.eyes.images[0]);
        controller.setSelection(this.mouth.images[0].src, "mouth", this.mouth.images[0]);
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

    showEyes() { this.eyes.showImages(); }
    showMouths() { this.mouth.showImages(); }
    hideEyes() { this.eyes.hideImages(); }
    hideMouths() { this.mouth.hideImages(); }

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
                    newElement.onclick = e => {
                        if (newElement.classList.contains("selected"))
                            return;
                        controller.setSelection(newElement.src, newElement.getAttribute("data-type"), newElement);
                    }
                    eyes.push(newElement);
                    eyesContainer.appendChild(newElement);
                }
            }

            if (specialCase.mouths) {
                for (const mouth of specialCase.mouths) {
                    let newElement = srcToImgElement(mouth, "mouth", specialCase.name);
                    newElement.style.display = "none";
                    newElement.onclick = e => {
                        if (newElement.classList.contains("selected"))
                            return;
                        controller.setSelection(newElement.src, newElement.getAttribute("data-type"), newElement);
                    }
                    mouths.push(newElement);
                    mouthsContainer.appendChild(newElement);
                }
            }

            for (const outfitPath of specialCase.outfitPaths) {
                const newElement = srcToImgElement(outfitPath, "outfit", specialCase.name);
                outfitsContainer.appendChild(newElement);
                const newSpecialOutfit = new SpecialOutfit(newElement, eyes, mouths, specialCase.name, this);

                //when a special case is clicked
                newElement.onclick = e => {
                    if (newElement.classList.contains("selected")) return;
                    newSpecialOutfit.showEyes();
                    if (newSpecialOutfit.eyes.length > 0)
                        controller.selectElement(newSpecialOutfit.eyes[0], "eyes");
                    newSpecialOutfit.showMouths();
                    if (newSpecialOutfit.mouths.length > 0)
                        controller.selectElement(newSpecialOutfit.mouths[0], "mouth");
                    controller.setSelection(newElement.src, newElement.getAttribute("data-type"), newElement, (sameSpecialCaseName, nextPose) => {
                        console.log("Deselect callback for special case called")
                        console.log("Same special case?", sameSpecialCaseName);
                        if (sameSpecialCaseName || nextPose) return;
                        newSpecialOutfit.hideEyes();
                        controller.selectDefaultEyes();
                        newSpecialOutfit.hideMouths();
                        controller.selectDefaultMouth();
                        this.showEyes();
                        this.showMouths();
                    }, newSpecialOutfit);
                    if (newSpecialOutfit.eyes.length > 0)
                        this.hideEyes();
                    if (newSpecialOutfit.mouths.length > 0)
                        this.hideMouths();
                }
                this.specialOutfits.push(newSpecialOutfit);
            }
        }
    }
}