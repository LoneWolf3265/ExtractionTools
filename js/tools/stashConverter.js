window.addEventListener("DOMContentLoaded", (event) => {
    buttonListener();
    downloadButton();
    copyButton();
});

function buttonListener() {
    const button = document.getElementById("js-transform-json");
    button.addEventListener("click", ()=>{
        reset();
        transformJSON();
    });
}

function reset() {
    const outputContainer = document.getElementById("outputTextArea");
    outputContainer.classList.remove("failed");

    outputContainer.value = "";

    const container = document.getElementById("util-button-wrapper");

    if (!container.classList.contains("hide")) {
        container.classList.add("hide");
    }
}

function showButtons() {
    const container = document.getElementById("util-button-wrapper");
    container.classList.remove("hide");
}

function copyButton() {
    const button = document.getElementById("js-result-copy");
    const output = document.getElementById("outputTextArea");

    button.addEventListener("click", () => {
        navigator.clipboard.writeText(output.value);
    });
}

function downloadButton() {
    const button = document.getElementById("js-result-download");

    button.addEventListener("click", () => {
        const json = document.getElementById("outputTextArea").value;
        downloadJson( json);
    });
}

function downloadJson(jsonData) {
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    let filename = 'AZ_Stash_Converter.json';
    
    link.href = url;
    link.download = filename;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function transformJSON() {
    let input = document.getElementById("inputTextArea").value;
    let outputContainer = document.getElementById("outputTextArea");

    if (input == "" || !isValidJSON(input)) {
        outputContainer.classList.add("failed");
        outputContainer.value = "Input is empty or not a JSON!";
        return;
    }

    let inputIdentifier = document.getElementById("js-identifier").value;
    let inputMaxCache = document.getElementById("js-maxCache").value;

    let cachePercantage = 0;
    if (inputMaxCache != "") {
        let possibleCachePercantage = parseFloat(inputMaxCache).toFixed(1);
        if (possibleCachePercantage <= 1.0) {
            cachePercantage = inputMaxCache;
        }
    }

    var jsonObj = JSON.parse(input);

    let addIdentifier = false;

    if (inputIdentifier != "") {
        addIdentifier = true;
    }

    var results = [];

    jsonObj.Objects.forEach(function (arr) {
        var name = "";
        var posStr = "";
        var orientation = "";
        
        Object.entries(arr).forEach(function ([key, item]) {
            if (key === "name") {
                name = item;
            }

            if (key === "pos") {
                posStr = item;
            }

            if (key === "ypr") {
                orientation = item;
            }
        });

        var result = {
            "Position": posStr, 
            "Orientation": orientation, 
        };

        if (results.hasOwnProperty(name)) {
            results[name].push(result);
        } else {
            results[name] = [result];
        }

    });

    var defaultCache = {
        "Classname": "",
        "Min_Caches_In_Map": 0,
        "Max_Caches_In_Map": 0,
        "Coords": [],
        "Time_Wait_Spawn": 0.5,
        "Time_Respawn": 14400,
        "ItemsInside": []
    };
    var finalResult = [];
    Object.entries(results).forEach(function ([name, cords]) {
        
        var stash = Object.assign({}, defaultCache);
        if (addIdentifier) {
            stash["Classname"] = inputIdentifier + name;
        } else {
            stash["Classname"] = name;
        }
        stash["Coords"] = cords;
        stash["Max_Caches_In_Map"] = cords.length;
        stash["Min_Caches_In_Map"] = generateCacheSpawn(cachePercantage, cords.length);
        finalResult.push(stash);
    });

    outputContainer.value = JSON.stringify(finalResult, null, 4);
    showButtons();
}

function generateCacheSpawn(perc, num){
    let number = 0;

    let possibleNumber = num * perc;
    if (possibleNumber >= 0 && num >= possibleNumber) {
        number = Math.floor(possibleNumber);
    }

    return number;
}

function isValidJSON(input) {
    try {
        JSON.parse(input);
        return true;
    } catch (error) {
        return false;
    }
}