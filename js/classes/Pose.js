class Pose {
    constructor(name, eyes, mouth, character) {
        this.name = name;
        this.character = character;
        this.eyes = eyes;
        this.mouth = mouth;
        this.eyes.pose = this;
        this.mouth.pose = this;
        this.outfitImages = [];
        this.characterName = character.name;
        this.outfitsPath = path.join(__dirname, "assets", this.characterName, `Pose ${name}`);
        this.eyesPath = path.join(__dirname, "assets", this.characterName, `Pose ${name}`, "Eyes");
        this.mouthPath = path.join(__dirname, "assets", this.characterName, `Pose ${name}`, "Mouth");
        this.outfitsLoaded = false;
    }

    appendImages() {
        let container = document.getElementById("outfits");
        for (const image of this.outfitImages)
            container.appendChild(image);
        this.eyes.appendImages();
        this.mouth.appendImages();
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

    setSpecialCases(specialCases) {
        this.specialCases = [];
        for (const specialCase of specialCases) {
            const outfitsContainer = document.getElementById("outfits");
            const eyesContainer = document.getElementById("eyes");
            const mouthsContainer = document.getElementById("mouths");
            const eyes = [];
            const mouths = [];
            if (specialCase.eyes) {
                for (const eye of specialCase.eyes) {
                    let newElement = srcToImgElement(eye, "eyes");
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
                    let newElement = srcToImgElement(mouth, "mouth");
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
                const newElement = srcToImgElement(outfitPath, "outfit");
                outfitsContainer.appendChild(newElement);
                const newSpecialCase = new SpecialCase(newElement, eyes, mouths, specialCase.name);
                newElement.onclick = e => {
                    if (newElement.classList.contains("selected")) return;
                    newSpecialCase.showEyes();
                    newSpecialCase.showMouths();
                    controller.setSelection(newElement.src, newElement.getAttribute("data-type"), newElement, sameSpecialCaseName => {
                        //console.log("Deselect callback for special case called")
                        //console.log("Same special case?", sameSpecialCaseName);
                        if (sameSpecialCaseName) return;
                        newSpecialCase.hideEyes();
                        newSpecialCase.hideMouths();
                        this.showEyes();
                        this.showMouths();
                    }, newSpecialCase);
                    if (newSpecialCase.eyes.length > 0)
                        this.hideEyes();
                    if (newSpecialCase.mouths.length > 0)
                        this.hideMouths();
                }
                this.specialCases.push(newSpecialCase);
            }
        }
    }
}