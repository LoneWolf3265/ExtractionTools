window.addEventListener("DOMContentLoaded", (event) => {
});

function initReadTraderPlusFile(file) {
    return new Promise((resolve) => {
        getTraderPlusFileContent(file).then(function (result) {
            if (result === false) {
                resolve(false);
                return;
            }

            const json = result.parsedJSON;
            mainPriceCompare(json).then(function (priceResult){
                if (priceResult === false) {
                    resolve(false);
                    return;
                }

                pricingResult = priceResult.result;
                categoryCount = priceResult.categoryCount;
                productCount = priceResult.productCount;
                
                issues = filterResults(pricingResult);

                createHTMLPricingElements(issues, categoryCount, productCount).then(function (creationStatus){
                    if (creationStatus === false) {
                        resolve(false);
                        return;
                    }
                    resolve(true);
                });
            });
        });
    });
}

function getTraderPlusFileContent(file) {
    appendLog("Start reading TraderPlus JSON", 'eventstart');
    console.log("[EVENT] Start reading TraderPlus JSON");

    return new Promise((resolve) => {
        const reader = new FileReader();

        reader.onload = function (event) {
            const jsonContent = event.target.result;

            if (!isJSONValid(jsonContent)) {
                resolve(false);
                return;
            }

            const parsedJSON = JSON.parse(jsonContent);
            const fileName = file.name;

            const jsonContainer = document.getElementById("js-json-data-container");

            const fileNameElement = document.createElement('h2');
            fileNameElement.textContent = fileName;
            jsonContainer.appendChild(fileNameElement);

            hideAndShow("js-json-data-container", true)
            hideAndShow("action-btn", true)

            resolve({ fileName, parsedJSON });

            appendLog("File: " + fileName + " found");
            console.log("[Found] ", fileName);
        };

        reader.readAsText(file);
    });
}

function mainPriceCompare(json){
    return new Promise((resolve) => {
        if (!json.hasOwnProperty('TraderCategories')) {
            appendLog("TraderCategories not found", "failed");
            console.log("[Failed] TraderCategories not found");
            resolve(false);
            return;
        }

        let categoryCount = 0;
        let productCount = 0;
        let result = [];

        const TraderCategories = json.TraderCategories;
        TraderCategories.forEach(category => {
            if (!category.hasOwnProperty('CategoryName') || !category.hasOwnProperty('Products')) {
                appendLog("CategoryName or Products not found", "failed");
                console.log("[Failed] CategoryName or Products not found");
                resolve(false);
                return;
            }
            
            categoryCount++;
            let tempResult = {
                "Category": category.CategoryName,
                "Products": []
            }
            
            let procuts = category.Products

            procuts.forEach(item => {
                productCount++;
                let details = extractDetails(item);
                
                compareResult = comparePrice(details.buyPrice, details.sellPrice);
                let tempProduct = {};
                switch (compareResult) {
                    case 2:
                        tempProduct = {
                            "Type": "Warning",
                            "Info": "BuyPrice is same as SellPrice",
                            "Name": details.itemName,
                            "Pricing": details.buyPrice + " | " + details.sellPrice,
                            "ValidSchema": details.validSchema,
                            "Schema": details.str,
                        };
                        break;
                    case 3:
                        tempProduct = {
                            "Type": "Critical",
                            "Info": "BuyPrice is LOWER then SellPrice",
                            "Name": details.itemName,
                            "Pricing": details.buyPrice + " | " + details.sellPrice,
                            "ValidSchema": details.validSchema,
                            "Schema": details.str,
                        };
                    case 4:
                        tempProduct = {
                            "Type": "Problem",
                            "Info": "BuyPrice or SellPrice is not a Number!",
                            "Name": details.itemName,
                            "Pricing": details.buyPrice + " | " + details.sellPrice,
                            "ValidSchema": details.validSchema,
                            "Schema": details.str,
                        };
                    case 5:
                        tempProduct = {
                            "Type": "Warning",
                            "Info": "Item is not Buyable or Sellable",
                            "Name": details.itemName,
                            "Pricing": details.buyPrice + " | " + details.sellPrice,
                            "ValidSchema": details.validSchema,
                            "Schema": details.str,
                        };
                    case 6:
                        tempProduct = {
                            "Type": "Critical",
                            "Info": "Could NOT compare BuyPrice and SellPrice",
                            "Name": details.itemName,
                            "Pricing": details.buyPrice + " | " + details.sellPrice,
                            "ValidSchema": details.validSchema,
                            "Schema": details.str,
                        };
                    case 1:
                        if (!details.validSchema) {
                            tempProduct = {
                                "Type": "Problem",
                                "Info": "There seems to be an Issue with the current Schema",
                                "Name": details.itemName,
                                "Pricing": details.buyPrice + " | " + details.sellPrice,
                                "ValidSchema": details.validSchema,
                                "Schema": details.str,
                            };
                        }
                    default:
                        break;
                }

                if (!isEmptyObject(tempProduct)) {
                    tempResult.Products.push(tempProduct);
                }
            });
            if (tempResult.Products.length === 0) {
                appendLog(tempResult.Category, "OK");
            } else {
                appendLog(tempResult.Category, "warning");
            }
            result.push(tempResult);
        });
        
        resolve({ result, categoryCount, productCount });
    });
}

function filterResults(results) {

    sortetIssues = [];

    for (let i = 0; i < results.length; i++) {
        const data = results[i];
        if (data.Products.length === 0) {
            continue;
        }

        let category = data.Category;
        let errorType = {
            "Critical": [],
            "Problem": [],
            "Warning": [],
            "Unsorted": [],
        }

        data.Products.forEach(item => {
            if (item.Type === "Warning") {
                errorType.Warning.push(item);
            } else if(item.Type === "Critical") {
                errorType.Critical.push(item);
            }else if (item.Type === "Problem") {
                errorType.Problem.push(item);
            } else {
                errorType.Unsorted.push(item);
            }
        });

        sortetIssues.push({category,errorType})

    }
    const jsonContainer = document.getElementById("error-json");
    const hiddenInput = document.getElementById("js-generated-json-data");
    const jsonDataElement = document.createElement('pre');
    jsonDataElement.setAttribute('id', 'error-json-data');
    jsonDataElement.textContent = JSON.stringify(sortetIssues, null, 4);
    hiddenInput.value = JSON.stringify(sortetIssues, null, 4);
    jsonContainer.appendChild(jsonDataElement);

    return sortetIssues;
}

function createHTMLPricingElements(issues, categoryCount, productCount) {
    return new Promise((resolve) => {
        createStats(categoryCount, productCount);
        createIssueBoxCritical();
        createIssueBoxProblem();
        createIssueBoxWarning();
        createIssueBoxUnsortet();
        createIssueBoxOk();
        setTimeout(1000);

        hideAndShow("js-json-data-container", true);

        issues.forEach(issue => {
            let category = issue.category;

            if (issue.errorType.Critical.length !== 0) {
                appendIssueboxCritical(category, issue.errorType.Critical);
            }
            if (issue.errorType.Problem.length !== 0) {
                appendIssueboxProblem(category, issue.errorType.Problem);
            }
            if (issue.errorType.Warning.length !== 0) {
                appendIssueboxWarning(category, issue.errorType.Warning);
            }
            if (issue.errorType.Unsorted.length !== 0) {
                appendIssueboxUnsortet(category, issue.errorType.Unsorted);
            }
        });

        resolve(true);
    });
}

function comparePrice(buyPrice, sellPrice) {
    if (isNaN(buyPrice) || isNaN(sellPrice)) {
        return 4;
    }
    else if (buyPrice === -1 && sellPrice === -1) {
        return 5;
    }
    else if (buyPrice === -1 || sellPrice === -1) {
        return 1;
    }
    else if (buyPrice > sellPrice) {
        return 1;
    }
    else if (buyPrice === sellPrice) {
        return 2;
    }
    else if (buyPrice < sellPrice) {
        return 3;
    } else {
        return 6;
    }

}

function isEmptyObject(obj) {
    return JSON.stringify(obj) === '{}';
}

function extractDetails(str) {
    const parts = str.split(',');

    let validSchema = true;
    if (parts.length !== 6) {
        validSchema = false;
    }

    const itemName = parts[0];
    const buyPrice = parseFloat(parts[parts.length - 2]);
    const sellPrice = parseFloat(parts[parts.length - 1]);

    return {
        itemName,
        buyPrice,
        sellPrice,
        validSchema,
        str
    };
}

function performTask(promise) {
    return new Promise(function (resolve) {
        setTimeout(function () {
            resolve(promise);
        }, 2000);
    });
}