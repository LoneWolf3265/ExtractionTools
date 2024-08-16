window.addEventListener("DOMContentLoaded", (event) => {
});

function mainCopyButton() {
    const button = document.getElementById("js-copy-btn");
    const input = document.getElementById("js-generated-json-data");

    button.addEventListener("click", () => {
        navigator.clipboard.writeText(input.value);
        appendLog("Copy to clipboard");
    });
}

function createCopyBtnListener(BtnId, inputId){
    const button = document.getElementById(BtnId);
    const input = document.getElementById(inputId);

    button.addEventListener("click", () => {
        navigator.clipboard.writeText(input.value);
        appendLog("Copy to clipboard");
    });
}
