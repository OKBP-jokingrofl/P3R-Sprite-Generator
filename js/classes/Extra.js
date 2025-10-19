class Extra {
    constructor(name, xOffset, yOffset, character, poseName) {
        this.name = name;
        this.xOffset = xOffset;
        this.yOffset = yOffset;
        this.character = character;
        this.path = path.join(__dirname, "assets", this.character.folderName, poseName, "Extras", name);
        this.files = null;
        fs.readdir(this.path, (err, files) => {
            if (err) {
                console.log(err);
                return;
            }

            this.files = files;
        });
    }
}