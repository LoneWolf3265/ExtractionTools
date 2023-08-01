/**
 * Hides or shows a given element
 * @param {bool} status true = show, false = hide
 * @param {string} id id of a HTMLElement
 */
function changeVisibility(status, id) {
    const container = document.getElementById(id);

    if (status) {
        container.classList.remove("hide");
    }else {
        container.classList.add("hide");
    }
}