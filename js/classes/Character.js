
class Character {
    constructor(name, preview) {
        this.name = name;
        this.preview = preview;
        this.poses = [];
        this.selectedPoseIndex = 0;

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
            case "Chihiro":
                this.addPose(new Pose("A", new Eyes(798, 1025), new Mouth(798, 1273), this));
                break;
            case "Yuko":
                this.addPose(new Pose("A", new Eyes(688, 1002), new Mouth(688, 1250), this));
                break;
            case "Mitsuru":
                this.addPose(new Pose("A", new Eyes(885, 995), new Mouth(885, 1243), this));
                this.addPose(new Pose("B", new Eyes(843, 996), new Mouth(843, 1244), this));
                break;
            case "Shinji":
                this.addPose(new Pose("A", new Eyes(938, 1059), new Mouth(938, 1307), this));
                this.addPose(new Pose("B", new Eyes(824, 943), new Mouth(825, 1179), this));
                break;
            case "Aigis":
                this.addPose(new Pose("A", new Eyes(695, 1052), new Mouth(695, 1300), this));
                this.addPose(new Pose("B", new Eyes(768, 1049), new Mouth(768, 1297), this));
                break;
            default:
                console.log("Unimplemented character: ", name);
        }
    }

    addPose(pose) {
        this.poses.push(pose);
    }

    nextPose() {
        if(this.poses.length === 1) return;
        this.selectedPoseIndex = (this.selectedPoseIndex + 1) % this.poses.length;
        this.loadAssets();
    }

    getCurrentPose() {
        return this.poses[this.selectedPoseIndex];
    }

    loadAssets() {
        controller.clearImages();
        this.poses[this.selectedPoseIndex].requestAssets();
        updateSelectedCharacterView();
    }

}
