

let autoCrop = true;
let autoCropCheckbox = document.getElementById("_checkbox");

autoCropCheckbox.oninput = e => {
    autoCrop = autoCropCheckbox.checked;
}