window.addEventListener("DOMContentLoaded", (event) => {
    init();
});

function init() {
    const extractDataBtn = document.getElementById("js-check-uploaded-files");

    extractDataBtn.addEventListener("click", () => {
        initExtractJsonData();
    });
}

function initExtractJsonData() {
    const uploadField = document.getElementById("js-json-upload");
    const files = uploadField.files[0];

    if (!files) {
        appendLog("Please Upload a JSON first", "failed");
        return null;
    }

    const isFileJson = checkIfDataIsJson(files);
    if (!isFileJson) {
        return null;
    }
    hideAndShow("js-first-form", false);
    showLoading();
    performTask(initReadTraderPlusFile(files)).then(function (result) {
        if (result === false) {
            // initResetForm();
            appendLog("A uploaded JSON is not valid!", "failed");
            appendLog("Please upload a valid Json");
        } else {
            console.log("[STATUS] Completed reading JSON Files");
            console.log(
                "[EVENTEND] Completed creating HTML elements from JSON data"
            );
            appendLog("Completed reading JSON Files", "update");
            appendLog(
                "Completed creating HTML elements from JSON data",
                "eventend"
            );
            hideLoading();
            hideAndShow("js-second-form", true);
        }
    });
}

function checkIfDataIsJson(files) {
    let isJsonFile = false;

    if (files.length === 0) {
        appendLog("No File found!", "failed");
        console.log("No File found!");
        return isJsonFile;
    }

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.type !== "application/json") {
            let message = "File: " + file.name + " is not a .json File!";
            console.log(message);
            appendLog(message, "failed");
            return isJsonFile;
        }
    }
    appendLog("File is a JSON!");
    console.log("File is a JSON!");
    isJsonFile = true;
    return isJsonFile;
}

/**
 *
 * @param {*} id id of html element
 * @param {*} status bool true-show false-hide
 */
function hideAndShow(id, status) {
    const element = document.getElementById(id);

    if (status) {
        element.classList.remove("hide");
    } else {
        element.classList.add("hide");
    }
}

function isJSONValid(jsonString) {
    try {
        JSON.parse(jsonString);
        return true;
    } catch (error) {
        return false;
    }
}
function performTask(promise) {
    return new Promise(function (resolve) {
        setTimeout(function () {
            resolve(promise);
        }, 2000);
    });
}
