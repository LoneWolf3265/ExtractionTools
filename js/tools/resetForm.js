function initResetForm() {
    showLoading();
    resetToFirstForm();
    resetGivenlements("js-logs-container");
    appendLog("Logs cleared", "eventstart");
    resetGivenlements("js-json-data-container");
    appendLog("JSON elements cleared", "eventstart");
    resetGivenlements("js-keys-container");
    appendLog("Keys cleared", "eventstart");
    appendLog("Ready to operate");
    hideLoading();
    console.log("[RESET TO FIRST FORM]");
}

function resetToFirstForm() {
    changeSizeOfMainContainer(false);

    hideAndShow("js-action-btn-container", false);
    hideAndShow("js-third-form", false);
    hideAndShow("js-second-form", false);
    hideAndShow("js-first-form", true);
}

function resetToKeySelection(id) {
    hideAndShow("js-third-form", false);
    changeSizeOfMainContainer(false);
    showLoading();
    hideAndShow("js-action-btn-container", false);
    performTask(removeIfNotHidden(id)).then(function(result) {
        appendLog("remove generated Elements", "eventstart");
        hideAndShow("js-second-form", true);
        showGivenElements(id);
        appendLog("Key selection loaded", "eventend");
        appendLog("Please select your desired keys");
        hideLoading();
        
        changeSizeOfMainContainer(true);
    });
}

function resetGivenlements(id) {
    const element = document.getElementById(id);

    while (element.firstChild) {
        element.firstChild.remove();
    }
}

function hideGivenElements(id) {
    const element = document.getElementById(id);
    const children = element.querySelectorAll('*');

    for (let i = 0; i < children.length; i++) {
        const child = children[i];
        child.classList.add("hide");
    }
}

function showGivenElements(id) {
    const element = document.getElementById(id);
    const children = element.querySelectorAll('*');

    for (let i = 0; i < children.length; i++) {
        const child = children[i];
        child.classList.remove("hide");
    }
}

function removeIfNotHidden(id) {
    const element = document.getElementById(id);
    const children = element.querySelectorAll('*');

    for (let i = 0; i < children.length; i++) {
        const child = children[i];
        if (!child.classList.contains("hide")) {
            child.remove();
        }
    }
}