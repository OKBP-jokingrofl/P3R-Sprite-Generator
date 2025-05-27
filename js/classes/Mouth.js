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
        this.pose.setUpElements();
    }

    displayImages() {
        let container = document.getElementById("imgContainer");
        for (const image of this.images) {
            container.appendChild(image);
        }
        //console.log("Displaying mouths");
        
    }
}