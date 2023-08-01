window.addEventListener("DOMContentLoaded", (event) => {
    listenForSwitchChange()
});

function listenForSwitchChange() {
    const checkboxSwitch = document.getElementById("js-switch-upload-data-type");
    const firstLabel = document.getElementById("js-fist-switch-label");
    const secondLabel = document.getElementById("js-second-switch-label");
    const uploadField = document.getElementById("js-json-upload");
    const uploadFieldSpan = document.getElementById("js-json-upload-span");

    checkboxSwitch.addEventListener("change", (box)=>{
        if (checkboxSwitch.checked) {
            firstLabel.classList.add("gray-out");
            secondLabel.classList.remove("gray-out");
            uploadField.multiple = true;
            uploadFieldSpan.textContent = "Upload JSON(s)"
        }else{
            firstLabel.classList.remove("gray-out");
            secondLabel.classList.add("gray-out");
            uploadField.multiple = false;
            uploadFieldSpan.textContent = "Upload a JSON"
        }
    });
}