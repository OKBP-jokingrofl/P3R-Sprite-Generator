//Abstract: All handler classes must implement the methods setUpElements and handleSelection
//setUpElements is triggered once all assets for a pose are loaded into DOM elements
//setUpElements should organize elements that go with a specific outfit into lists
//handleSelection is triggered when an outfit is selected
//handleSelection should show only the eyes and mouth that go with the selected outfit
//and hide the rest

class JunpeiHandler {
    constructor(character) {
        this.bwCapElements = [];
        this.lightElements = [];
        this.nonBwCapElements = [];
        this.character = character;
        this.selectedOutfitType = null;
    }

    setUpElements() {
        for (const image of this.character.getCurrentPose().outfitImages) {
            if (image.src.includes("bw-cap")) {
                image.setAttribute("data-bwCap", "true");
            }

        }
        for (const image of this.character.getCurrentPose().eyes.images) {
            if (image.src.includes("bw-cap")) {
                image.setAttribute("data-bwCap", "true");
                this.bwCapElements.push(image);
            }
            else if (image.src.includes("light")) {
                image.setAttribute("light", "true");
                this.lightElements.push(image);
            }
            else
                this.nonBwCapElements.push(image);
        }
        for (const image of this.character.getCurrentPose().mouth.images){
            if (image.src.includes("light")) {
                image.setAttribute("light", "true");
                this.lightElements.push(image);
            }
            else
                this.nonBwCapElements.push(image);
        }
    }

    handleSelection(selectedElement) {
        if (selectedElement.src.includes("bw-cap")) {
            this.selectedOutfitType = "bw-cap";
            for (const image of this.bwCapElements)
                image.style.display = "inline";
            for (const image of this.nonBwCapElements)
                image.style.display = "none";
        }
        else {
            this.selectedOutfitType = "fw-cap";
            for (const image of this.nonBwCapElements)
                image.style.display = "inline";
            for (const iamge of this.bwCapElements)
                iamge.style.display = "none";
        }
    }
}


//class to handle Yukari-specific images
class YukariHandle {
    constructor(character) {
        this.kimonoElements = [];
        this.nonKimonoElements = [];
        this.character = character;
        this.selectedOutfitType = null;
    }

    setUpElements() {
        //gather eyes that go with kimono hair ornament, they are labeled with "-ki"
        for (const image of this.character.getCurrentPose().eyes.images) {
            if (image.src.includes("-ki")) {
                image.setAttribute("data-ki", "true");
                this.kimonoElements.push(image);
            }
            else
                this.nonKimonoElements.push(image);
        }

        for (const image of this.character.getCurrentPose().outfitImages) {
            if (image.src.includes("kimono")) {
                image.setAttribute("data-kimono", "true");
            }
        }
    }

    handleSelection(selectedElement) {
        console.log("Handing selection of");
        console.log(selectedElement);
        const kimono = (selectedElement.getAttribute("data-kimono") === "true") ? "kimono" : "non-kimono";
        this.selectedOutfitType = kimono;
        this.filterElements(kimono);
    }

    //filter visible images according to selected outfit
    filterElements(type) {
        console.log("Filtering elements for type:", type);
        const toDisplay = (type === "kimono") ? "inline" : "none";
        console.log("toDisplay = ", toDisplay);
        console.log("kimono elements:");
        console.log(this.kimonoElements);
        for (const image of this.kimonoElements) {
            image.style.display = toDisplay;
        }
        const toDisplay2 = (type !== "kimono") ? "inline" : "none";
        console.log("toDisplay2 = ", toDisplay2);
        console.log("nonkimono elements:");
        console.log(this.nonKimonoElements);
        for (const image of this.nonKimonoElements) {
            image.style.display = toDisplay2;
        }
    }
}