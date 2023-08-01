window.addEventListener("DOMContentLoaded", (event) => {
    resetButton("js-reset-to-first-form");
    submitSelectedKeys();
});

function initSecondForm(keyData) {
    console.log(keyData);
    createKeyCheckboxElements(keyData.get("keys"));
    hideAndShow("js-second-form", true);
    hideLoading();
    appendLog("Please select your desired keys");
}

function submitSelectedKeys() {
    const button = document.getElementById("js-check-selected Keys");

    button.addEventListener("click", ()=>{
        let selectedKeys = getSelectedKeys();

        if (selectedKeys.get('status') === true) {
            appendLog("Failed to get selected keys", "failed");
            appendLog("Please select atleast 1 key to carry on");
        }else if(selectedKeys.get('status') === false) {

            changeSizeOfMainContainer(false);
            hideAndShow("js-second-form", false);
            showLoading();
            appendLog("Selected keys saved", "saved");
            appendLog("Merge status saved", "saved");
            initThirdForm(selectedKeys);
        }
    });
}
/**
 * 
 * @returns selectedKeys Map ('.get()') of status, keys, merge
 */
function getSelectedKeys() {
    const checkboxContainersParent = document.getElementById("js-keys-container");
    const labelCheckboxes = checkboxContainersParent.getElementsByClassName("container-checkbox");

    let isEmpty = true;
    let checkedCheckboxes = [];
    let shouldMerge = false;
    let addKeyNames = false;

    for (const label of labelCheckboxes) {
        const checkbox = label.getElementsByTagName("input")[0];
        if (checkbox.checked) {
            const id = label.id;
            checkedCheckboxes.push(id);
        }
    }

    if (checkedCheckboxes.length > 0) {
        isEmpty = false;
    }

    const mergeCheckbox = document.getElementById("js-merge-resulting-json");
    if (mergeCheckbox.checked) {
        shouldMerge = true;
    }

    const keyNamesCheckbox = document.getElementById("js-add-key-names");
    if (keyNamesCheckbox.checked) {
        addKeyNames = true;
    }

    let selectedKeys = new Map();
    
    if (selectedKeys.has('merge')) {
        selectedKeys.delete('merge');
    }
    selectedKeys.set('status', isEmpty);
    selectedKeys.set('keys', checkedCheckboxes);
    selectedKeys.set('merge', shouldMerge);
    selectedKeys.set('keyNames', addKeyNames);

    return selectedKeys;
}

function resetButton(id) {
    const button = document.getElementById(id);
    button.addEventListener("click", ()=>{
        initResetForm();
    });
}

function createKeyCheckboxElements(keys) {
    appendLog("Start creating key checkboxes", "eventstart");

    const container = document.getElementById("js-keys-container");
    changeSizeOfMainContainer(true);

    for (const key of keys) {
        const checkboxContainerElement = document.createElement('label');
        checkboxContainerElement.classList.add("container-checkbox");
        checkboxContainerElement.setAttribute("id", key);
        checkboxContainerElement.textContent = key;

        const inputElement = document.createElement("input");
        inputElement.setAttribute("type", "checkbox");

        const spanElement = document.createElement('span');
        spanElement.classList.add("checkmark");

        checkboxContainerElement.appendChild(inputElement);
        checkboxContainerElement.appendChild(spanElement);

        container.appendChild(checkboxContainerElement);
    }

    appendLog("Completed creating key checkboxes", "eventend");

}