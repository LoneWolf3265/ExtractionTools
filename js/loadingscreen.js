function showLoading() {
    const overlay = document.getElementById("loading-overlay");
    overlay.classList.add("active");
}

function hideLoading() {
    const overlay = document.getElementById("loading-overlay");
    overlay.classList.remove("active");
}
/**
 * Changes the mainContainer size from 20em to fit-content
 * @param {bool} state true = fit-content , false = 20em
 */
function changeSizeOfMainContainer(state) {
    const mainContainer = document.getElementsByClassName("data-container-wrapper");

    if (state) {
        for (let i = 0; i < mainContainer.length; i++) {
            mainContainer[i].style.height = "fit-content"; 
        }
    } else {
        for (let i = 0; i < mainContainer.length; i++) {
            mainContainer[i].style.height = "20em"; 
        }
    }
    
}