window.addEventListener("DOMContentLoaded", (event) => {
    mainCopyButton();
});

function mainCopyButton() {
    const button = document.getElementById("js-copy-btn");
    const input = document.getElementById("js-generated-json-data");

    button.addEventListener("click", () => {
        navigator.clipboard.writeText(input.value);
        appendLog("Copy to clipboard");
    });
}
