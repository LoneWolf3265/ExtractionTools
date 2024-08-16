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
        appendLog("Please Upload a Log File first", "failed");
        return null;
    }

    hideAndShow("js-first-form", false);
    showLoading();
    performTask(initReadTraderPlusLogFile(files)).then(function (result) {
        if (result === false) {
            hideLoading();
            hideAndShow("js-second-form", true);
            hideAndShow("js-json-data-container", true);
            appendLog("The Uploaded Log contains 0 Transactions", "failed");
            appendLog("Please upload a content filled Log");
        } else {
            console.log("[STATUS] Completed reading JSON Files");
            console.log(
                "[EVENTEND] Completed creating HTML elements from JSON data"
            );
            appendLog("Completed reading Log file", "update");
            appendLog(
                "Completed creating HTML elements from Log Data",
                "eventend"
            );

            createCopyBtnListener('js-copy-btn', 'js-generated-json-data');
            createCopyBtnListener('js-copy-btn-sorted', 'js-generated-json-data-sorted');

            hideLoading();
            hideAndShow("js-second-form", true);
            hideAndShow("js-json-data-container", true);
            hideAndShow("action-btn", true);
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

function performTask(promise) {
    return new Promise(function (resolve) {
        setTimeout(function () {
            resolve(promise);
        }, 2000);
    });
}
