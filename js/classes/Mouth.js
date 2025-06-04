class Mouth {
    constructor(offsetX, offsetY) {
        this.offsetX = offsetX;
        this.offsetY = offsetY;
        this.images = [];
        this.assetsLoaded = false;
    }

    setImages(images) {
        this.images = images;
        this.assetsLoaded = true;
    }

    appendImages() {
        let container = document.getElementById("mouths");
        for (const image of this.images) {
            container.appendChild(image);
        }
        //console.log("Displaying mouths");
        
    }

    hideImages(){
        for(const img of this.images)
            img.style.display = "none";
    }

    showImages(){
        for(const img of this.images)
            img.style.display = "inline";
    }
}