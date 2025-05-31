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

    displayImages() {
        let container = document.getElementById("imgContainer");
        for (const image of this.outfitImages) {
            container.appendChild(image);
        }
        //console.log("Displaying outfits");

        this.eyes.displayImages();
        this.mouth.displayImages();
    }

    requestAssets() {
        if (!this.outfitsLoaded) {
            ipcRenderer.send("requestAssets", this.outfitsPath);
        }
        else {
            this.displayImages();
        }
    }

    setImages(images) {
        this.outfitImages = images;
        this.outfitsLoaded = true;
    }

    setUpElements() {
        if (this.character.characterHandle) {
            this.character.characterHandle.setUpElements();
        }
    }

    setSpecialCases(specialCases) {
        this.specialCases = [];
        for (const specialCase of specialCases) {
            const container = document.getElementById("imgContainer");
            const eyes = [];
            const mouths = [];
            for (const eye of specialCase.eyes) {
                let newElement = srcToImgElement(eye, "eyes");
                newElement.style.display = "none";
                newElement.onclick = e => {
                    if (newElement.classList.contains("selected"))
                        return;
                    controller.setSelection(newElement.src, newElement.getAttribute("data-type"), newElement);
                }
                eyes.push(newElement);
                container.appendChild(newElement);
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
                    container.appendChild(newElement);
                }
            }

            for (const outfitPath of specialCase.outfitPaths) {
                const newElement = srcToImgElement(outfitPath, "outfit");
                container.appendChild(newElement);
                const newSpecialCase = new SpecialCase(newElement, eyes, mouths);
                newElement.onclick = e => {
                    if (newElement.classList.contains("selected")) return;
                    newSpecialCase.showEyes();
                    newSpecialCase.showMouths();
                    controller.setSelection(newElement.src, newElement.getAttribute("data-type"), newElement, e => {
                        newSpecialCase.hideEyes();
                        newSpecialCase.hideMouths();
                    });
                }
                this.specialCases.push(newSpecialCase);
            }
        }
    }

    //handle selection when a special case outfit is selected
    handleSelection(element) {
        console.log("Deprecate");

    }

}