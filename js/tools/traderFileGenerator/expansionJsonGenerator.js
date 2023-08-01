window.addEventListener("DOMContentLoaded", (event) => {
    submitListenerPart1();
    addCollapseListener();
    autoGenerateNumbersListener();
    actionButtonListener();
    resetFormListener();
});

const expansionFallbackData = {
    m_Version: 1,
    DisplayName: "General goods",
    Icon: "Deliver",
    Color: "800080",
    InitStockPercent: 75.0
};

const expansionFallbackClassnameData = {
    MaxPriceThreshold: 100,
    MinPriceThreshold: 1,
    SellPricePercent: 1,
    MaxStockThreshold: 100,
    MinStockThreshold: 1,
    QuantityPercent: -1,
    SpawnAttachments: [],
    Variants: [],
}

const expansionColorKey = "Color";
const expansionStockPercentageKey = "InitStockPercent";

function submitListenerPart1() {
    const sumbitBtn = document.getElementById("js-start-gen");

    sumbitBtn.addEventListener("click", () => {
        changeVisibility(false, "js-generate-json-first-part");
        changeVisibility(true, "js-action-btn-container");
        changeVisibility(true, "js-reset-form-btn");
        initGenerateTraderJson();
        changeVisibility(true, "js-generate-json-second-part");
        multiItemGeneratorListener();
        singleItemGeneratorListener();
    });
}

function resetFormListener() {
    const button = document.getElementById("js-reset-form");

    button.addEventListener("click", ()=>{
        const name = document.getElementById("js-generated-json-name");
        const data = document.getElementById("js-generated-json-data");
        
        resetGivenlements("js-generated-json-name-data");
        resetGivenlements("js-generated-json-container");
        resetGivenlements("js-classname-wrapper");

        name.value = "";
        data.value= "";

        changeVisibility(false, "js-generated-classnames-container");
        changeVisibility(true, "js-generate-json-first-part");
        changeVisibility(false, "js-action-btn-container");
        changeVisibility(false, "js-reset-form-btn");
        changeVisibility(false, "js-generate-json-second-part");
    });
}

function actionButtonListener() {
    let name = document.getElementById("js-generated-json-name").value;
    let data = document.getElementById("js-generated-json-data");

    const copyButton = document.getElementById("js-copy-btn");
    const downloadButton = document.getElementById("js-download-btn");

    copyButton.addEventListener("click", ()=>{
        copyTextToClipboard(data);
    });
    downloadButton.addEventListener("click", ()=>{
        downloadJson(name, data);
    });
}

function downloadJson(name, jsonContent) {
    const jsonData = jsonContent.value;

    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    const filename = name || 'General_goods.json';
    link.href = url;
    link.download = filename;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function copyTextToClipboard(input) {
    navigator.clipboard.writeText(input.value);
    appendLog("Copy to clipboard");
}

function autoGenerateNumbersListener() {
    const maxPriceContainer = document.getElementById("js-multi-MaxPriceThreshold");
    const minPriceContainer = document.getElementById("js-multi-MinPriceThreshold");
    const maxStockContainer = document.getElementById("js-multi-MaxStockThreshold");
    const MinStockContainer = document.getElementById("js-multi-MinStockThreshold");
    const maxStockContainerSingle = document.getElementById("js-single-MaxPriceThreshold");
    const MinStockContainerSingle = document.getElementById("js-single-MinPriceThreshold");

    const containers = [
        maxPriceContainer,
        minPriceContainer,
        maxStockContainer,
        MinStockContainer,
    ];

    const singleContainers = [
        maxStockContainerSingle,
        MinStockContainerSingle
    ];

    for (const container of containers) {

        const parentElement = container.parentElement;
        const button = parentElement.querySelector('button');
        button.addEventListener("click", ()=>{
            generateRandomNumbersAmountForClassNameExpansion(container, "js-multi-classname");
        });
    }

    for (const container of singleContainers) {

        const parentElement = container.parentElement;
        const button = parentElement.querySelector('button');
        button.addEventListener("click", ()=>{
            generateRandomNumbersAmountForClassNameExpansion(container, "js-single-classname");
        });
    }
}

function singleItemGeneratorListener() {
    const generateSingle = document.getElementById("js-generate-single-item");

    generateSingle.addEventListener("click", ()=>{
        initSingleItemGeneration();
    });
}

function initSingleItemGeneration() {
    const classNameContainer = document.getElementById("js-single-classname");
    const maxPriceContainer = document.getElementById("js-single-MaxPriceThreshold");
    const minPriceContainer = document.getElementById("js-single-MinPriceThreshold");
    const sellPricePercentContainer = document.getElementById("js-single-SellPricePercent");
    const maxStockContainer = document.getElementById("js-single-MaxStockThreshold");
    const MinStockContainer = document.getElementById("js-single-MinStockThreshold");
    const quantityPercentContainer = document.getElementById("js-single-QuantityPercent");
    const variantsContainer = document.getElementById("js-single-Variants");
    const spawnAttachmentsContainer = document.getElementById("js-single-SpawnAttachments");
    const keepQuotesCheckbox = document.getElementById("js-single-classname-keep-quotes");

    let keepQuotes = false;
    if (keepQuotesCheckbox.checked) {
        keepQuotes = true;
    }

    const classNameValue = getAllSingleItemNames(classNameContainer, keepQuotes);
    console.log(classNameValue);
    if (classNameValue === null) {
        console.log("Stopped generating");
        return null
    }

    const containers = [
        { key: "MaxPriceThreshold", value: maxPriceContainer },
        { key: "MinPriceThreshold", value: minPriceContainer },
        { key: "SellPricePercent", value: sellPricePercentContainer },
        { key: "MaxStockThreshold", value: maxStockContainer },
        { key: "MinStockThreshold", value: MinStockContainer },
        { key: "QuantityPercent", value: quantityPercentContainer }
    ];

    const specialContainers = [
        { key: "Variants", value: variantsContainer },
        { key: "SpawnAttachments", value: spawnAttachmentsContainer }
    ]

    let itemArraysOfContainers = [];
    itemArraysOfContainers["ClassName"] = classNameValue;
    for (const container of containers) {
        let itemArray = getAllSingleItemNames(container.value);
        if (itemArray === null) {
            itemArray = [];
        }
        itemArraysOfContainers[container.key] = itemArray;
    }

    for (const specialContainer of specialContainers) {
        let itemArray = getAllItemsNames(specialContainer.value);
        if (itemArray === null) {
            itemArray = [];
        }
        itemArraysOfContainers[specialContainer.key] = itemArray;
    }

    const generatedClassNames = generateItemSchemataFromDataExpansion(itemArraysOfContainers, expansionFallbackClassnameData);
    generateHtmlFromDataExpansion(generatedClassNames, "js-generated-json-container", "js-generated-json-data");
    initUpdateCreatedClassNameList();
}

function multiItemGeneratorListener() {
    const generateMulti = document.getElementById("js-generate-multi-item");

    generateMulti.addEventListener("click", ()=>{
        console.log("click");
        initMultiItemGeneration();
    });
}

function initMultiItemGeneration() {
    const classNameContainer = document.getElementById("js-multi-classname");
    const maxPriceContainer = document.getElementById("js-multi-MaxPriceThreshold");
    const minPriceContainer = document.getElementById("js-multi-MinPriceThreshold");
    const maxStockContainer = document.getElementById("js-multi-MaxStockThreshold");
    const MinStockContainer = document.getElementById("js-multi-MinStockThreshold");
    const keepQuotesCheckbox = document.getElementById("js-mulit-classname-keep-quotes");

    let keepQuotes = false;
    if (keepQuotesCheckbox.checked) {
        keepQuotes = true;
    }

    //extract classnames
    const classNamesArray = getAllItemsNames(classNameContainer, keepQuotes);
    console.log(classNamesArray);
    if (classNamesArray === null) {
        console.log("Stopped generating");
        return null
    }

    //how many classnames?
    const classNamesKeyAmount = classNamesArray.length -1;
    console.log("ClassnameKeyCounter: ", classNamesKeyAmount);

    const containers = [
        { key: "MaxPriceThreshold", value: maxPriceContainer },
        { key: "MinPriceThreshold", value: minPriceContainer },
        { key: "MaxStockThreshold", value: maxStockContainer },
        { key: "MinStockThreshold", value: MinStockContainer }
    ];

    let itemArraysOfContainers = [];
    itemArraysOfContainers["ClassName"] = classNamesArray;
    for (const container of containers) {
        let itemArray = getAllItemsNames(container.value);
        if (itemArray === null) {
            itemArray = [];
        }
        itemArraysOfContainers[container.key] = itemArray;
    }

    console.log(itemArraysOfContainers);

    const generatedClassNames = generateItemSchemataFromDataExpansion(itemArraysOfContainers, expansionFallbackClassnameData);

    generateHtmlFromDataExpansion(generatedClassNames, "js-generated-json-container", "js-generated-json-data");
    initUpdateCreatedClassNameList();
}

function initUpdateCreatedClassNameList() {
    let classNameArray = updateCreateClassnameList();
    resetGivenlements("js-classname-wrapper");
    if (classNameArray === null || classNameArray === [] || classNameArray === undefined) {
        console.log("No classnames to created");
    }
    createClassnamesEntries(classNameArray);
    addEventlistenersToClassnames();
}

function addCollapseListener() {
    collapseElementListener('js-faq-coallapse', 'js-faq-coallapse-container', 'icon-angle');
    collapseElementListener('js-multi-item-collapse', 'js-multi-item-collapse-container', 'icon-angle-multi');
    collapseElementListener('js-single-item-collapse', 'js-single-item-collapse-container', 'icon-angle-single');
}

function initGenerateTraderJson() {
    const userData = getUserInput();
    const sanitizedUserData = sanitizeUserAnswers(userData, expansionFallbackData);
    console.log("SANITIZED DATA: ", sanitizedUserData);

    const fileNameInput = document.getElementById("js-generated-json-name-data");
    const hiddenFileNameInput = document.getElementById("js-generated-json-name");
    hiddenFileNameInput.value = sanitizedUserData["DisplayName"].replace(/\s/g, "_");
    fileNameInput.textContent = sanitizedUserData["DisplayName"];
    createFirstJSONElements(sanitizedUserData, "js-generated-json-container");
    addDataToHiddenInput(sanitizedUserData, "js-generated-json-data");
}

function sanitizeUserAnswers(dataArray, fallbackData) {
    dataArray = validateHexColorValue(dataArray, expansionColorKey);
    dataArray = validatePercentage(0, 75.0, dataArray, expansionStockPercentageKey);
    console.log(dataArray);
    let result = {};

    for (const key in dataArray) {
        let value = dataArray[key];

        if (value === "" || value === null || value === "NaN" ) {
            value = fallbackData[key];
        }
        if (key === "InitStockPercent") {
            result[key] = Number(value);
        } else {
            result[key] = value;
        }
    }

    result.Items = [];
    console.log(result);
    return result;
}

function getUserInput() {
    const name = document.getElementById("js-displayname").value;
    const version = document.getElementById("js-version").value;
    const colorHex = document.getElementById("hexCode").value;
    const stockPercent = document.getElementById("js-stock-percent").value;

    const iconElement = document.getElementById("js-icon-selector");
    const icon = getSelectedOption(iconElement);

    const data = {
        m_Version: version,
        DisplayName: name,
        Icon: icon,
        Color: colorHex,
        "IsExchange": 0,
        InitStockPercent: stockPercent
    };
    console.log("USERDATA: ", data);
    return data;
}
