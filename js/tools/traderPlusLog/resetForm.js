window.addEventListener("DOMContentLoaded", (event) => {
    resetForm();
});

function resetForm() {
    const resetBtn = document.getElementById("js-reset-form");
    resetBtn.addEventListener("click", ()=>{
        resetGivenlements("json-view");
        resetGivenlements("js-json-data-container");
        resetGivenlements("js-logs-container");
        hideAndShow("js-json-data-container", false);
        hideAndShow("js-second-form", false);
        hideAndShow("js-first-form", true);
        hideAndShow("action-btn", false)
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