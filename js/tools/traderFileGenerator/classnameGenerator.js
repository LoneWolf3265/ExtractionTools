function checkIfValueGiven(container) {
    let value = container.value;
    value = value.trim();

    if (value !== "") {
        return true
    } else {
        return false;
    }
}

function getItems(container, keepQuotes) {
    let items = container.value;

    if (keepQuotes === null|| keepQuotes === undefined) {
        keepQuotes = false;
    }

    if (keepQuotes === false) {
        items = items.replace(/"/g, '');
    }

    const trimmedItems = items.trim();
    let unsanitizedItems = trimmedItems.split(',');

    let itemsArray = [];
    for (const item of unsanitizedItems) {
        if (item !== "") {
            itemsArray.push(item.trim());
        }
    }

    return itemsArray;
}

function getAllSingleItemNames(container, keepQuotes) {
    const itemExist = checkIfValueGiven(container);

    if (!itemExist) {
        console.log("No Items found!");
        return null;
    }

    const itemArray = getSingleItem(container, keepQuotes);

    return itemArray;
}

function getSingleItem(container, keepQuotes) {
    let item = container.value;

    if (keepQuotes === null|| keepQuotes === undefined) {
        keepQuotes = false;
    }

    if (keepQuotes === false) {
        item = item.replace(/"/g, '');
    }

    const trimmedItem = item.trim();
    let itemArray = [trimmedItem];

    return itemArray;
}

function getAllItemsNames(container, keepQuotes) {
    const itemsExist = checkIfValueGiven(container);

    if (!itemsExist) {
        console.log("No Items found!");
        return null;
    }

    const itemsArray = getItems(container, keepQuotes);

    return itemsArray;
}

function generateItemSchemataFromDataExpansion(data, fallback) {

    const baseKeys = [
        "MaxPriceThreshold",
        "MinPriceThreshold",
        "SellPricePercent",
        "MaxStockThreshold",
        "MinStockThreshold",
        "QuantityPercent",
        "SpawnAttachments",
        "Variants"
    ];

    const specialKeys = [
        "SpawnAttachments",
        "Variants"
    ];

    const intKeys = [
        "MaxPriceThreshold",
        "MinPriceThreshold",
        "SellPricePercent",
        "MaxStockThreshold",
        "MinStockThreshold",
        "QuantityPercent"
    ];

    const classNameArray = data["ClassName"];
    const maxLength = classNameArray.length;

    let resultArray = []
    for (let i = 0; i < maxLength; i++) {
        let fullItem = {};
        fullItem["ClassName"] = data["ClassName"][i];

        for (const key of baseKeys) {
            if (data.hasOwnProperty(key)) {
                if (specialKeys.includes(key)) {
                    if (data[key].length === 0) {
                        fullItem[key] = fallback[key];
                    } else {
                        fullItem[key] = [];
                        for (const value of data[key]) {
                            fullItem[key].push(value);
                        }
                    }
                } else {
                    const value = data[key][i];

                    if (value === null || value === undefined || value === "" ) {
                        fullItem[key] = fallback[key];
                    } else {
                        if (intKeys.includes(key)) {
                            val = Number(value);
                            console.log(val);
                            if (val === null || val === undefined || isNaN(val)) {
                                val = fallback[key];
                            }
                            fullItem[key] = val;
                        }else {
                            fullItem[key] = value;
                        }
                    }
                }
            } else {
                fullItem[key] = fallback[key];
            }
        }
        resultArray.push(fullItem);
    }

    return resultArray;
}

function generateHtmlFromDataExpansion(dataArray, container, input) {
    resetGivenlements(container);
    const hiddenInput = document.getElementById(input);
    const hiddenInputValue = JSON.parse(hiddenInput.value);

    for (const data of dataArray) {
        hiddenInputValue["Items"].push(data);
    }
    console.log(hiddenInputValue);
    hiddenInput.value = "";
    addDataToHiddenInput(hiddenInputValue, input);
    createFirstJSONElements(hiddenInputValue, container);

    console.log(hiddenInputValue);
}

function resetGivenlements(id) {
    const element = document.getElementById(id);

    while (element.firstChild) {
        element.firstChild.remove();
    }
}

function addEventlistenersToClassnames() {
    const container = document.getElementById("js-classname-wrapper");
    const elements = container.getElementsByClassName("classname-data-wrapper");

    for (const element of elements) {
        element.addEventListener("click", ()=>{
            const hiddenInputValue = element.getElementsByTagName('input')[0].value;
            console.log(hiddenInputValue);
            removeGivenClassName(hiddenInputValue);
        });
    }
}

function removeGivenClassName(value) {
    const hiddenInput = document.getElementById("js-generated-json-data");
    const hiddenInputValue = JSON.parse(hiddenInput.value);
    const items = hiddenInputValue["Items"];

    const classnameArray = [];
    let counter = 0;
    for (const item of items) {
        if (counter === 0) {
            if (item["ClassName"] !== value) {
                classnameArray.push(item);
            }else {
                counter++;
            }
        }else {
            classnameArray.push(item);
        }
    }

    hiddenInputValue["Items"] = classnameArray;
    addDataToHiddenInput(hiddenInputValue, "js-generated-json-data");
    resetGivenlements("js-generated-json-container");
    createFirstJSONElements(hiddenInputValue, "js-generated-json-container");
    initUpdateCreatedClassNameList();
}

function createClassnamesEntries(classnames) {
    const container = document.getElementById("js-classname-wrapper");

    for (const classname of classnames) {
        const dataWrapper = document.createElement('div');
        dataWrapper.classList.add("classname-data-wrapper");

        const name = document.createElement('p');
        name.classList.add("classname");
        name.textContent = classname;

        const hiddenInput = document.createElement('input');
        hiddenInput.type = "hidden";
        hiddenInput.value = classname;

        const iconWrapper = document.createElement('div');
        iconWrapper.classList.add("icon-remove-wrapper");

        const icon = document.createElement('p');
        icon.classList.add("icon-remove");
        icon.innerHTML = '&#x2715;';

        iconWrapper.appendChild(icon);
        dataWrapper.appendChild(name);
        dataWrapper.appendChild(hiddenInput);
        dataWrapper.appendChild(iconWrapper);
        container.appendChild(dataWrapper);
    }
}

function updateCreateClassnameList() {
    const hiddenInput = document.getElementById("js-generated-json-data");
    const hiddenInputValue = JSON.parse(hiddenInput.value);
    const items = hiddenInputValue["Items"];

    const classnameArray = [];
    for (const item of items) {
        if (item.hasOwnProperty("ClassName")) {
            classnameArray.push(item["ClassName"]);
        }
    }
    console.log("SUUUUUU:",classnameArray);
    if (classnameArray === null || classnameArray === [] || classnameArray === undefined || classnameArray.length === 0) {
        changeVisibility(false, "js-generated-classnames-container");
    }else{
        changeVisibility(true, "js-generated-classnames-container");
    }

    return classnameArray;
}