
class SpecialCase {
    constructor(outfitElement, eyes, mouths, name) {
        this.outfitElement = outfitElement;
        this.eyes = eyes;
        this.mouths = mouths;
        this.name = name;
    }

    showEyes() {
        for (const eye of this.eyes) eye.style.display = "inline";
    }

    showMouths() {
        for (const mouth of this.mouths) mouth.style.display = "inline";
    }

    hideEyes() {
        for (const eye of this.eyes) eye.style.display = "none";
    }

    hideMouths() {
        for (const mouth of this.mouths) mouth.style.display = "none";
    }
}