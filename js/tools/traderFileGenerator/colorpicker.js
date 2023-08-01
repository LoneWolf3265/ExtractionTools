window.addEventListener("DOMContentLoaded", (event) => {
    colorPickerListener();
});

function colorPickerListener() {
    const colorPicker = document.getElementById('js-color');
    const hexCode = document.getElementById('hexCode');
    const applyButton = document.getElementById('applyButton');

    colorPicker.addEventListener('change', updateHexCode);
    applyButton.addEventListener('click', updateColorPicker);

    function updateHexCode() {
        const selectedColor = colorPicker.value;
        hexCode.value = selectedColor;
    }

    function updateColorPicker() {
        const hexValue = hexCode.value;
        colorPicker.value = hexValue;
    }
}