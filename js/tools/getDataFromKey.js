window.addEventListener("DOMContentLoaded", (event) => {
    resetButton("js-reset-to-first-form-2");
    initResetToKeySelection("js-reset-to-key-selection");
});

function initThirdForm(keys) {
    appendLog("Start extracting Data from keys", "eventstart");
    console.log("ARRAY:", jsonDataObj);
    let extarctedData = initExtractData(keys);
    
    performTask(hideGivenElements("js-json-data-container")).then(function(result) {
        appendLog("JSON HTML Elements removed", "update");
        createHTMLElementsfromExtractedData(extarctedData, keys);
        addDataToActionBtn(extarctedData, keys);
        hideAndShow("js-action-btn-container", true);
        initIndividualActionButtons();
        hideAndShow("js-third-form", true);
        hideLoading();
    });
}



function initResetToKeySelection(id) {
    const button = document.getElementById(id);
    button.addEventListener("click", ()=>{
        resetToKeySelection("js-json-data-container");
    });
}

function addDataToActionBtn(extarctedData, keys) {
    const hiddenInput = document.getElementById("js-extracted-data-final");
    hiddenInput.value = JSON.stringify(extarctedData, null, 4);

    const mergeStatusInput = document.getElementById("js-extracted-data-merge-status");
    mergeStatusInput.value = keys.get("merge");
    const mergeFilename = document.getElementById("js-merge-fileName");
    if (mergeFilename) {
        const hiddenInputName = document.getElementById("js-extracted-data-filename");
        hiddenInputName.value = mergeFilename.textContent + ".json";
    }
    appendLog("Download is ready","update");
}

function createHTMLElementsfromExtractedData(extarctedData, keys){
    appendLog("Start creating Html elements", "eventstart");

    const jsonContainer = document.getElementById("js-json-data-container");
    const fileNames = jsonFileNames;
    const merge = keys.get('merge');

    if (merge) {

        const jsonDataElement = document.createElement('pre');
        jsonDataElement.textContent = JSON.stringify(extarctedData, null, 4);
        
        const now = new Date();
        const currentDate = now.toLocaleDateString(); 
        const currentTime = now.toLocaleTimeString();
        const dateTimeFormat = currentDate + "_" + currentTime;
        const newFileName = "Extracted_Data_";

        const fileNameElement = document.createElement('h3');
        fileNameElement.id = "js-merge-fileName";
        fileNameElement.textContent = newFileName + dateTimeFormat;
        jsonContainer.appendChild(fileNameElement);
        jsonContainer.appendChild(jsonDataElement);
       
        appendLog(newFileName, 'done');
        console.log("[DONE] ", newFileName);
        
    }else{
        for (let i = 0; i < extarctedData.length; i++) {
            const data = extarctedData[i];

            if (extarctedData.length > 1) {
                const btnContainer = document.createElement('div');
                btnContainer.classList.add('small-action-btn-container');

                const btnWrapper = document.createElement('div');
                btnWrapper.classList.add("small-action-button-wrapper");
                btnWrapper.id = "js-wrapper-" + i;

                const downloadBtn = document.createElement('button');
                downloadBtn.setAttribute("type", "button");
                downloadBtn.classList.add("individual-action-button", "js-download");
                downloadBtn.id="js-single-download-" +i;
                downloadBtn.textContent = "Download";

                const copyBtn = document.createElement('button');
                copyBtn.setAttribute("type", "button");
                copyBtn.classList.add("individual-action-button", "js-copy");
                copyBtn.id="js-single-copy-" +i;
                copyBtn.textContent = "Copy";

                const hiddenInput = document.createElement("input");
                hiddenInput.setAttribute("type", "hidden");
                hiddenInput.id = "js-single-data-" +i;
                hiddenInput.value = JSON.stringify(data, null, 4);

                btnWrapper.appendChild(downloadBtn);
                btnWrapper.appendChild(copyBtn);
                btnWrapper.appendChild(hiddenInput);
                btnContainer.appendChild(btnWrapper);
                jsonContainer.appendChild(btnContainer);
            }
    
            const fileNameElement = document.createElement('h3');
            fileNameElement.textContent = fileNames[i];
            jsonContainer.appendChild(fileNameElement);
            
            const jsonDataElement = document.createElement('pre');
            jsonDataElement.textContent = JSON.stringify(data, null, 4);
            jsonContainer.appendChild(jsonDataElement);
            
            appendLog(fileNames[i], 'done');
            console.log("[DONE] ", fileNames[i]);
        }
    }
    appendLog("Completed creations of HTML elements", "eventend");
}

function initExtractData(keys) {
    let extractedData = [];
    let setKeyNames = keys.get('keyNames');
    console.log("SET KEY NAMES: ", setKeyNames);
    console.log("MERGE DATA: ", keys.get('merge'));
    console.log("SELECTED KEYS:", keys.get('keys'));

    if (!setKeyNames) {
        appendLog("Extracting Data");
        for (const jsonData of jsonDataObj) { 
            let result = getDataFromPartitialKeyNoKey(jsonData, keys.get('keys'));
            console.log("each RESULT: ", result);
            extractedData.push(result);
        }

        if (keys.get('merge')) {
            if (extractedData.length > 1) {
                extractedData = [].concat(...extractedData);
            }
            appendLog("Data Merged", "Done");
        }
    } else {
        appendLog("Extracting Data");
        for (const jsonData of jsonDataObj) {
            let result = getDataFromPartitialKeyWithKey(jsonData, keys.get('keys'));
            extractedData.push(result);
        }

        appendLog("Key Names set", "Done");
        if (keys.get('merge')) {
            if (extractedData.length > 1) {
                let mergedData = {};

                extractedData.forEach(obj => {
                    Object.entries(obj).forEach(([key, values]) => {
                        if (!mergedData[key]) {
                            mergedData[key] = [];
                        }
                        mergedData[key] = mergedData[key].concat(values);
                    });
                });

                extractedData = mergedData;
                appendLog("Data Merged", "Done");
            }
        }
    }
    appendLog("Data extracted", "saved");
    console.log("final Array: ", extractedData);
    appendLog("data extracted from keys", "eventend");

    return extractedData;
}

function getDataFromPartitialKeyNoKey(jsonObj, partialKeys) {
    const result = [];

    function traverseObject(obj) {
        if (obj && typeof obj === 'object') {
            if (Array.isArray(obj)) {
                obj.forEach(item => {
                    traverseObject(item);
                });
            } else {
                Object.keys(obj).forEach(key => {
                    if (partialKeys.includes(key)) {
                        result.push(obj[key]);
                    }
                    traverseObject(obj[key]);
                });
            }
        }
    }

    traverseObject(jsonObj);

    return result;

}

function getDataFromPartitialKeyWithKey(jsonObj, partialKeys) {
    const result = {};

    function traverseObject(obj, currentKey = '') {
        if (obj && typeof obj === 'object') {
            if (Array.isArray(obj)) {
                obj.forEach(item => {
                    traverseObject(item, currentKey);
                });
            } else {
                Object.keys(obj).forEach(key => {
                    const newKey = currentKey ? `${currentKey}.${key}` : key;
                    if (partialKeys.includes(key)) {
                        if (result.hasOwnProperty(key)) {
                            result[key].push(obj[key]);
                        } else {
                            result[key] = [obj[key]];
                        }
                    }
                    traverseObject(obj[key], newKey);
                });
            }
        }
    }

    traverseObject(jsonObj);

    return result;
}
