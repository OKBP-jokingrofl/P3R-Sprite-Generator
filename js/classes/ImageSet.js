//class for organizing images that are part of a set
class ImageSet {
    /**
     * 
     * @param {string} name 
     * @param {[DOMElement]} outfits 
     * @param {[DOMElement]} eyes 
     * @param {[DOMElement]} mouths 
     */
    constructor(name, outfits, eyes, mouths, pose) {
        this.name = name;
        this.outfits = [];
        this.pose = pose;
        if (eyes && eyes.length > 0)
            this.setEyes(eyes);
        if (mouths && mouths.length > 0)
            this.setMouths(mouths);
        for (const outfit of outfits) {
            this.addOutfit(outfit);
        }
        //console.log(`Constructed imageset ${name} with following outfits:`, this.outfits);
    }

    addOutfit(outfit) {
        outfit.onclick = e => {
            controller.setSelection(outfit, "outfit");
            this.onImageSetChange(this.pose.selectedImageSet, this);
        }
        this.outfits.push(outfit);
    }

    onImageSetChange(previousSet, newSet) {
        if (previousSet && (previousSet.name === newSet.name)) return;
        console.log("Redraw triggered");
        for (const imageSet of newSet.pose.imageSets) {
            //console.log(imageSet);
            imageSet[1].hideSet();
        }
        newSet.showSet();
        if (previousSet) {
            const sameEyes = (previousSet.eyes[0] === newSet.eyes[0]);
            const sameMouths = (previousSet.mouths[0] === newSet.mouths[0]);
            console.log("Same Eyes: ", sameEyes, "Same Mouths: ", sameMouths);
            this.pose.selectImageSet(newSet, !sameEyes, !sameMouths);
        }
        else
            this.pose.selectImageSet(newSet);
    }

    showSet() {
        if (this.eyes[0] && this.eyes[0].style.display !== "inline")
            this.showEyes();
        if (this.mouths[0] && this.mouths[0].style.display !== "inline")
            this.showMouths();
    }

    showEyes() {
        for (const eye of this.eyes)
            eye.style.display = "inline";
    }

    showMouths() {
        for (const mouth of this.mouths)
            mouth.style.display = "inline";
    }

    hideSet() {
        if (this.eyes[0] && this.eyes[0].style.display !== "none")
            this.hideEyes();
        if (this.mouths[0] && this.mouths[0].style.display !== "none")
            this.hideMouths();
    }

    hideEyes() {
        for (const eye of this.eyes)
            eye.style.display = "none";
    }

    hideMouths() {
        for (const mouth of this.mouths)
            mouth.style.display = "none";
    }

    setEyes(eyes) {
        this.eyes = eyes;
        for (const eye of eyes) {
            eye.onclick = e => {
                controller.setSelection(eye, "eyes");
            }
        }
    }

    setMouths(mouths) {
        this.mouths = mouths;
        for (const mouth of mouths) {
            mouth.onclick = e => {
                controller.setSelection(mouth, "mouth");
            }
        }
    }

}