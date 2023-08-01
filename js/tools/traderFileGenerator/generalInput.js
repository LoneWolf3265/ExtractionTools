function createFirstJSONElements(dataArray, id) {
    const container = document.getElementById(id);
    const jsonString = JSON.stringify(dataArray, null, 4);

    const preElement = document.createElement("pre");
    preElement.textContent = jsonString;
    container.appendChild(preElement);
}

function addDataToHiddenInput(dataArray, id) {
    const input = document.getElementById(id);
    const jsonString = JSON.stringify(dataArray, null, 4);

    input.value = jsonString;
}

function getSelectedOption(selectElement) {
    const options = selectElement.getElementsByTagName("option");

    for (const option of options) {
        if (option.selected) {
            return option.value;
        }
    }
    return null;
}

function validateHexColorValue(dataArray, key) {
    let color = dataArray[key];

    const hexRegex = /^#?([0-9A-F]{3}$)|([0-9A-F]{6}$)/i;
    const isHexCode = hexRegex.test(color);

    if (isHexCode) {
        color = color.replace(/#/g, "");
    } else {
        color = "";
    }

    dataArray[key] = color;
    return dataArray;
}

function validatePercentage(minPercentage, maxPercentage, dataArray, key) {
    let value = dataArray[key]
    if (value >= minPercentage && value <= maxPercentage) {
        if (!Number.isInteger(value)) {
            value = fixDecimal(value);
        }
    } else {
        if (value < minPercentage) {
            value = minPercentage;
            value = fixDecimal(value);
        } else if (value > maxPercentage) {
            value = maxPercentage + .0;
            value = fixDecimal(value);
        }
    }

    function fixDecimal(number) {
        const decimalString = number.toString().replace(',', '.');
        const fixedNumber = parseFloat(decimalString).toFixed(1);
        return fixedNumber;
    }

    dataArray[key] = value;
    return dataArray;
}