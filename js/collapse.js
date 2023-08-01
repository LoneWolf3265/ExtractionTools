function collapseElementListener(buttonId, containerId, iconId) {
    const button = document.getElementById(buttonId);
    const container = document.getElementById(containerId);

    button.addEventListener("click", ()=>{
        collapseElement(container);
        rotateIcon90(iconId);
    });
}

function collapseElement(container) {
    if (container.classList.contains("collapsed")) {
        container.classList.remove("collapsed");
    } else {
        container.classList.add("collapsed");
    }
}

function rotateIcon90(iconId) {
    const icon = document.getElementById(iconId);

    icon.classList.toggle("rotate90-d");
}