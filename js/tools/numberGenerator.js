window.addEventListener("DOMContentLoaded", (event) => {
    numberGeneratorListener();
});

function numberGeneratorListener() {
    const button = document.getElementById("js-number-generator-start");

    button.addEventListener("click", () => {
        initGenerateRandomNumber(false);
    });
}

function initGenerateRandomNumber(shouldReturn) {

    if (shouldReturn === null || shouldReturn === undefined) {
        shouldReturn = false;
    }

    const minValue = document.getElementById("js-number-min-val").value;
    const maxValue = document.getElementById("js-number-max-val").value;
    const resultBox = document.getElementById("js-number-generator-result");
    const hiddenResult = document.getElementById("js-hidden-number-generator-result");

    clearResult(resultBox, hiddenResult);
    let randomNumber = getRandomNumber(minValue, maxValue);
    setResults(resultBox, hiddenResult, randomNumber);

    if (shouldReturn) {
        return randomNumber;
    }
}

function getRandomNumber(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); // The maximum is inclusive and the minimum is inclusive
  }

function clearResult(resultBox, hiddenResult) {
    resultBox.textContent = '';
    hiddenResult.value = '';
}

function setResults(resultBox, hiddenResult, number) {
    resultBox.textContent = number;
    hiddenResult.value = number;
}

function generateRandomNumbersAmountForClassNameExpansion(container, CNContainer) {
    const classNameContainer = document.getElementById(CNContainer);
    const classNamesArray = getAllItemsNames(classNameContainer);

    if (classNamesArray === null) {
        console.log("No Classnames found. Can't create numbers.");
        return null
    }

    const classNamesLenght = classNamesArray.length;

    let valueArray = getAllItemsNames(container);

    let valueLenght = 0;
    if (valueArray !== null) {
        valueLenght = valueArray.length;
    }else {
        valueArray = [];
    }

    if (valueLenght >= classNamesLenght) {
        console.log("Each Classname already have a given value in this field");
        return null;
    }

    for (let i = valueLenght; i < classNamesLenght; i++) {
        let randomNumber = initGenerateRandomNumber(true);
        valueArray.push(randomNumber);
    }

    container.value = valueArray;
    console.log(valueArray);
}