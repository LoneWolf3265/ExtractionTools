window.addEventListener("DOMContentLoaded", (event) => {
    mainCopyButton();
    mainDownloadButton();
});

function mainCopyButton() {
    const button = document.getElementById("js-copy-all-btn");
    const input = document.getElementById("js-extracted-data-final");

    button.addEventListener("click", () => {
        navigator.clipboard.writeText(input.value);
        appendLog("Copy to clipboard");
    });
}

function mainDownloadButton() {
    const button = document.getElementById("js-download-all-btn");

    button.addEventListener("click", () => {
        const mergeStatusValue = document.getElementById("js-extracted-data-merge-status").value;
        console.log("Final Merge download status", mergeStatusValue);
        if (mergeStatusValue === "true") {
            const fileName = document.getElementById("js-extracted-data-filename").value;
            const jsonString = document.getElementById("js-extracted-data-final");
            downloadJson(fileName, jsonString);
            appendLog("File Download");
        } else if (mergeStatusValue === "false") {
            const jsonContent = document.getElementById("js-extracted-data-final").value;
            const obj = JSON.parse(jsonContent);
            downloadJsonAsZip(obj, jsonFileNames);
            appendLog("ZIP Download");
        }else {
            appendLog("Donwload Failed. Please reload page and try again", "failed");
        }
    });
}

function downloadJsonAsZip(JsonObjects, filenames) {
    const zip = new JSZip();

    for (let i = 0; i < JsonObjects.length; i++) {
        const json = JsonObjects[i];
        zip.file(filenames[i], JSON.stringify(json, null, 4));
    }

    zip.generateAsync({ type: 'blob' }).then(function (content) {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(content);
        link.download = 'ExtractionData.zip';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });
}

function initIndividualActionButtons() {
    const allWrappers = document.getElementsByClassName("small-action-button-wrapper");

    for (let i = 0; i < allWrappers.length; i++) {
        const wrapper = allWrappers[i];
        let copyBtn = wrapper.getElementsByClassName("js-copy");
        let downloadBtn = wrapper.getElementsByClassName("js-download");

        copyBtn[0].addEventListener("click", function (event) {
            console.log("click", copyBtn);
            const currentId = event.target.id;
            const parentElement = event.target.parentElement;

            const parentElementId = parentElement.id;
            const number = parentElementId.split("js-wrapper-")[1];

            const hiddenInput = document.getElementById("js-single-data-" + number);

            navigator.clipboard.writeText(hiddenInput.value);
            appendLog("Copy to clipboard");
        });

        downloadBtn[0].addEventListener("click", function (event) {
            const parentElement = event.target.parentElement;

            const parentElementId = parentElement.id;
            const number = parentElementId.split("js-wrapper-")[1];
            const name = jsonFileNames[number];

            const hiddenInput = document.getElementById("js-single-data-" + number);
            downloadJson(name, hiddenInput);
        });
    }
}

function downloadJson(name, jsonContent) {
    const jsonData = jsonContent.value;

    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    const filename = name || 'extractionData.json';
    link.href = url;
    link.download = filename;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
