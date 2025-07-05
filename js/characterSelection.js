const characterList = [];
let selectedCharacter = null;

function updateSelectedCharacterView(){
    document.getElementById("currentSelection").innerText = `${selectedCharacter.name}`;
    document.getElementById("poseName").innerText = `Pose ${selectedCharacter.getCurrentPose().name}`;
    document.getElementById("posesCounter").innerText = `Pose ${selectedCharacter.selectedPoseIndex + 1} of ${selectedCharacter.poses.length}`;
}

function selectCharacter(character) {
    selectedCharacter = character;
    updateSelectedCharacterView();
}

ipcRenderer.send("requestCharacters");
const characterSelect = document.querySelector(".characterSelect");
function closeCharacterSelect() { characterSelect.style.display = "none"; }
function openCharacterSelect() { characterSelect.style.display = "block"; }
document.querySelector(".circle").onclick = closeCharacterSelect;
document.getElementById("characterSelectBtn").onclick = openCharacterSelect;
document.getElementById("nextPoseBtn").onclick = e => {selectedCharacter.nextPose()};

ipcRenderer.on("characters", (e, characters) => {
    console.log("Received characters:");
    console.log(characters);
    for (let character of characters) {
        let newCharacter = new Character(character.name, character.preview, character.folderName);
        characterList.push(newCharacter);
        const container = document.createElement("div");
        container.classList.add("characterContainer");
        const preview = document.createElement("img");
        const name = document.createElement("span");
        preview.src = character.preview;
        preview.classList.add("characterImg");
        name.innerText = character.name;
        container.appendChild(preview);
        container.appendChild(name);
        document.querySelector(".characterGrid").appendChild(container);
        container.onclick = e => {
            for (let char of characterList) {
                if (char.name === character.name){
                    selectedCharacter = newCharacter;
                    newCharacter.loadAssets();
                    closeCharacterSelect();
                }  
            }
        };
    }
});