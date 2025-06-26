
class Character {
    constructor(name, preview, folderName) {
        this.name = name;
        this.preview = preview;
        this.folderName = folderName;
        this.poses = [];
        this.selectedPoseIndex = 0;

        //define offsets for eyes/mouth for each character pose here:
        switch (name) {
            case "Yukari":
                this.addPose(new Pose("A", new Eyes(668, 1072), new Mouth(668, 1310), this));
                this.addPose(new Pose("B", new Eyes(761, 1049), new Mouth(761, 1287), this));
                this.addPose(new Pose("C", new Eyes(662, 857), new Mouth(662, 1095), this));
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
            case "Tanaka":
                //this.addPose(new Pose("A", new Eyes(861, 787), new Mouth(861, 1291), this));
                this.addPoseWrapper("A", 861, 787, 861, 1291);
                break;
            case "Elizabeth":
                //this.addPose(new Pose("A", new Eyes(839, 795), new Mouth(839, 1297), this));
                this.addPoseWrapper("A", 839, 795, 839, 1297);
                break;
            case "Chidori":
                this.addPose(new Pose("A", new Eyes(628, 773), new Mouth(629, 1280), this));
                break;
            case "Jin":
                this.addPose(new Pose("A", new Eyes(656, 973), new Mouth(656, 1221), this));
                break;
            case "Takaya":
                this.addPose(new Pose("A", new Eyes(793, 784), new Mouth(793, 1289), this));
                this.addPose(new Pose("B", new Eyes(746, 631), new Mouth(746, 1135), this));
                break;
            case "Koromaru":
                this.addPose(new Pose("D", new Eyes(515, 647), new Mouth(515, 647), this));
                break;
            case "Igor":
                this.addPose(new Pose("A", new Eyes(517, 865), new Mouth(517, 1266), this));
                break;
            case "Ryoji":
                this.addPose(new Pose("A", new Eyes(662, 1058), new Mouth(662, 1296), this));
                break;
            case "Kenji":
                this.addPose(new Pose("A", new Eyes(654, 738), new Mouth(654, 1242), this));
                break;
            case "Ikutsuki":
                this.addPose(new Pose("A", new Eyes(825, 757), new Mouth(825, 1254), this));
                this.addPose(new Pose("B", new Eyes(678, 696), new Mouth(705, 1200), this));
                break;
            default:
                console.log("Unimplemented character: ", name);
        }
    }

    addPose(pose) {
        this.poses.push(pose);
    }

    addPoseWrapper(name, eyesXOffset, eyesYOffset, mouthXOffset, mouthYOffset){
        this.addPose(new Pose(name, new Eyes(eyesXOffset, eyesYOffset), new Mouth(mouthXOffset, mouthYOffset), this));
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
