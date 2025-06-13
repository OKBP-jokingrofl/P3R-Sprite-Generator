
class Character {
    constructor(name, preview) {
        this.name = name;
        this.preview = preview;
        this.poses = [];
        this.selectedPose = 0;

        //define offsets for eyes/mouth for each character pose here:
        switch (name) {
            case "Yukari":
                this.addPose(new Pose("A", new Eyes(668, 1072), new Mouth(668, 1310), this));
                this.addPose(new Pose("B", new Eyes(761, 1049), new Mouth(761, 1287), this));
                break;
            case "Makoto":
                this.addPose(new Pose("A", new Eyes(668, 1072), new Mouth(668, 1310), this));
                break;
            case "Junpei":
                this.addPose(new Pose("A", new Eyes(789, 1033), new Mouth(789, 1281), this));
                this.addPose(new Pose("B", new Eyes(844, 1102), new Mouth(844, 1354), this));
                this.addPose(new Pose("C", new Eyes(726, 690), new Mouth(729, 1158), this));
                this.addPose(new Pose("D", new Eyes(792, 931), new Mouth(792, 1182), this));
                break;
            case "Fuuka":
                this.addPose(new Pose("A", new Eyes(781, 1072), new Mouth(781, 1320), this));
                this.addPose(new Pose("B", new Eyes(702, 1011), new Mouth(702, 1261), this));
                break;
            case "Akihiko":
                this.addPose(new Pose("A", new Eyes(715, 1029), new Mouth(715, 1277), this));
                this.addPose(new Pose("B", new Eyes(851, 991), new Mouth(851, 1239), this));
                break;
            case "Ken":
                this.addPose(new Pose("A", new Eyes(703, 839), new Mouth(703, 1343), this));
                this.addPose(new Pose("B", new Eyes(651, 898), new Mouth(652, 1405), this));
                break;
            default:
                console.log("Unimplemented character: ", name);
        }
    }

    addPose(pose) {
        this.poses.push(pose);
    }

    nextPose() {
        this.selectedPose++;
        if (this.selectedPose >= this.poses.length)
            this.selectedPose = 0;
        this.loadAssets();
    }

    getCurrentPose() {
        return this.poses[this.selectedPose];
    }

    loadAssets() {
        controller.clearImages();
        this.poses[this.selectedPose].requestAssets();
        updateSelectedCharacterView();
    }

}
