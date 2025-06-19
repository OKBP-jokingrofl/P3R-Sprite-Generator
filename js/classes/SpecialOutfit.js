
class SpecialOutfit {
    /**
     * 
     * @param {DOMElement} outfitElement 
     * @param {[DOMElement]} eyes 
     * @param {[DOMElement]} mouths 
     * @param {string} name 
     * @param {Pose} pose 
     */
    constructor(outfitElement, eyes, mouths, name, pose) {
        this.outfitElement = outfitElement;
        this.eyes = eyes;
        this.mouths = mouths;
        this.name = name;
        this.showingImages = false;
        this.pose = pose;
        if(!this.pose.imageSets.has(name))
            this.pose.imageSets.set(name, new ImageSet(name, [this.outfitElement], this.eyes, this.mouths, this.pose));
        else
            this.pose.imageSets.get(name).addOutfit(this.outfitElement);

           
        if(this.eyes.length === 0)
            this.pose.imageSets.get(name).setEyes(this.pose.imageSets.get("general").eyes);
        if(this.mouths.length === 0)
            this.pose.imageSets.get(name).setMouths(this.pose.imageSets.get("general").mouths);
    }   
}