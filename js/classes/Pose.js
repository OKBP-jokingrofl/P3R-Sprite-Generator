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
        else{
            this.displayImages();
        }
    }

    setImages(images) {
        this.outfitImages = images;
        this.outfitsLoaded = true;
    }

    setUpElements(){
        if(this.character.characterHandle){
            this.character.characterHandle.setUpElements();
        }
    }

}