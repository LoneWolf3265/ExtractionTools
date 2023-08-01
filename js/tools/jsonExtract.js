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
    const files = uploadField.files;

    const isFileJson = checkIfDataIsJson(files);
    if (!isFileJson) {
        return null;
    }
    hideAndShow("js-first-form", false);
    showLoading();
    performTask(createJsonHTMLElements(files)).then(function (result) {
        if (result === true) {
            initResetForm();
            appendLog("A uploaded JSON is not valid!","failed");
            appendLog("Please upload a valid Json");
        } else {
            console.log("[STATUS] Completed reading JSON Files");
            console.log("[EVENTEND] Completed creating HTML elements from JSON data");
            appendLog("Completed reading JSON Files", 'update');
            appendLog("Completed creating HTML elements from JSON data", 'eventend');
        }
    });

    performTask(getJsonData(files)).then(function (result) {
        jsonDataString = result[0];
        jsonDataObj = result[1];
        jsonFileNames = result[2];
        setJsonDataInput(jsonDataString, "js-form-json-data");
        console.log("[JSON DATA EXTRACTED]");
        appendLog('JSON DATA EXTRACTED', 'saved');

        console.log(jsonDataString);
        console.log(jsonDataObj);
        console.log("FILENAMES", jsonFileNames);

        keyData = getAndSetKeys(jsonDataObj);
        if (keyData.get('keys').length === 0) {
            hideLoading();
            initResetForm();
            appendLog("No keys found.", "failed");
            appendLog("Please Upload a valid JSON with keys!");
        } else {
            console.log("[KEYS EXTRACTED]");
            appendLog("KEYS EXTRACTED", 'saved');
            initSecondForm(keyData);
        }
    });
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

function getAndSetKeys(jsonDataObj) {
    let keysWithNumbers = getAllKeys(jsonDataObj);
    let keys = removeNumbersFromKey(keysWithNumbers);
    let keysString = JSON.stringify(keys);
    setJsonDataInput(keysString, "js-form-json-all-keys");

    let keyData = new Map();
    keyData.set('keysWithNumbers', keysWithNumbers);
    keyData.set('keys', keys);
    keyData.set('keysString', keysString);

    return keyData;
}

function removeNumbersFromKey(keys) {
    var result = [];
    for (const key of keys) {
        if (isNaN(key)) { // Check if the word is not a number
            result.push(key);
        }
    }

    console.log(result);
    return result;
}

function getAllKeys(obj) {
    let keys = [];

    function iterate(obj) {
        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                if (typeof key === 'string') {
                    if (!keys.includes(key)) {
                        keys.push(key);
                    }
                }
                if (typeof obj[key] === 'object' && obj[key] !== null) {
                    iterate(obj[key]);
                }
            }
        }
    }

    iterate(obj);

    return keys;
}

function setJsonDataInput(jsonData, id) {
    const hiddenInput = document.getElementById(id);
    hiddenInput.value = jsonData;
}

function getJsonData(files) {
    return new Promise(function (resolve) {

        const jsonDataStrings = [];
        const jsonDataObj = [];
        const jsonFileNames = [];
        var currentIndex = 0;

        let fileReader = new FileReader();
        fileReader.onload = function (e) {
            let contents = e.target.result;
            if (!isJSONValid(contents)) {
                return true;
            }
            let parsedObject = JSON.parse(contents);
            let jsonString = JSON.stringify(parsedObject);

            jsonDataStrings.push(jsonString);
            jsonDataObj.push(parsedObject);

            currentIndex++;
            if (currentIndex < files.length) {
                readFile();
            } else {
                let data = [jsonDataStrings, jsonDataObj, jsonFileNames]
                resolve(data);
            }
        };

        function readFile() {
            var file = files[currentIndex];
            jsonFileNames.push(file.name);
            fileReader.readAsText(file);
        }

        if (files.length > 0) {
            readFile();
        };
    });
}

function createJsonHTMLElements(files) {
    return new Promise(function (resolve) {
        appendLog("Start reading JSON File(s)", 'eventstart');
        console.log("[EVENT] Start reading JSON File(s)");
        for (const file of files) {
            const reader = new FileReader();
            reader.onload = function (event) {
                const jsonContent = event.target.result;
                if (isJSONValid(jsonContent) === false) {
                    const failed = true
                    return resolve(failed);
                }
                const parsedJSON = JSON.parse(jsonContent);

                const fileName = file.name;
                const jsonContainer = document.getElementById("js-json-data-container");

                const fileNameElement = document.createElement('h3');
                fileNameElement.textContent = fileName;
                jsonContainer.appendChild(fileNameElement);

                const jsonDataElement = document.createElement('pre');
                jsonDataElement.textContent = JSON.stringify(parsedJSON, null, 4);
                jsonContainer.appendChild(jsonDataElement);

                appendLog(fileName, 'done');
                console.log("[DONE] ", fileName);
            };
            reader.readAsText(file);
        }
    });
}

function performTask(promise) {
    return new Promise(function (resolve) {
        setTimeout(function () {
            resolve(promise);
        }, 2000);
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
        if (file.type !== 'application/json') {
            let message = "File: " + file.name + " is not a .json File!"
            console.log(message);
            appendLog(message, 'failed');
            return isJsonFile;
        }
    }
    appendLog("File(s) are JSON!");
    console.log("File(s) are JSON!");
    isJsonFile = true
    return isJsonFile;

}

function isJSONValid(jsonString) {
    try {
        JSON.parse(jsonString);
        return true;
    } catch (error) {
        return false;
    }
}