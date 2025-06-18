//class for organizing images that are part of a set
class ImageSet{
    /**
     * 
     * @param {string} name 
     * @param {[DOMElement]} outfits 
     * @param {[DOMElement]} eyes 
     * @param {[DOMElement]} mouths 
     */
    constructor(name, outfits, eyes, mouths){
        this.name = name;
        this.outfits = outfits;
        this.eyes = eyes;
        this.mouths = mouths;
    }

    addOutfit(outfit){
        this.outfits.push(outfit);
    }

    showSet(){
        if(this.eyes[0] && this.eyes[0].style.display !== "inline")
            this.showEyes();
        if(this.mouths[0] && this.mouths[0].style.display !== "inline")
            this.showMouths();
    }

    showEyes(){
        for(const eye of this.eyes)
            eye.style.display = "inline";
    }

    showMouths(){
        for(const mouth of this.mouths)
            mouth.style.display = "inline";
    }

    hideEyes(){
        for(const eye of this.eyes)
            eye.style.display = "none";
    }

    hideMouths(){
        for(const mouth of this.mouths)
            mouth.style.display = "none";
    }

    setEyes(eyes){
        this.eyes = eyes;
    }

    setMouths(mouths){
        this.mouths = mouths;
    }

}