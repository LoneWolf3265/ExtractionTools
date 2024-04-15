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
        let name = document.getElementById("js-comment").value;
        downloadJson(name, json);
    });
}

function downloadJson(name, jsonData) {
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    let filename = 'AZ_Anomaly_Converter.json';
    if (name != "") {
        filename = 'AZ_Anomaly_'+ name +'.json';
    }
    
    link.href = url;
    link.download = filename;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function transformJSON() {
    let input = document.getElementById("inputTextArea").value;
    let outputContainer = document.getElementById("outputTextArea");

    let inputComment = document.getElementById("js-comment").value;
    let inputTier = document.getElementById("js-tier").value;

    let inputTranslations = document.getElementById("textarea-translation").value;

    if (input == "" || !JSON.parse(input)) {
        outputContainer.classList.add("failed");
        outputContainer.value = "Input is empty or not a JSON!";
        return;
    }

    var jsonObj = JSON.parse(input);

    if (!JSON.parse(inputTranslations)) {
        outputContainer.classList.add("failed");
        outputContainer.value = "Translation is not a valid JSON!";
        return;
    }

    var translations = JSON.parse(inputTranslations);

    if (inputTier == "") {
        inputTier = 1;
    } else {
        inputTier = parseInt(inputTier);
    }


    if (inputComment == "") {
        inputComment = "Anomaly";
    }

    var results = [];

    jsonObj.Objects.forEach(function (arr) {
        var name = "";
        var posStr = "";
        
        Object.entries(arr).forEach(function ([key, item]) {
            if (key === "name") {
                if (translations.hasOwnProperty(item))
                {
                    name = translations[item];
                }else {
                    name = item;
                }
            }
            if (key === "pos") {
                var pos = item.join(' ');
                posStr = pos.replace(/,/g, " ");
            }
        });

        var result = {
            "comment": inputComment, 
            "name": name, 
            "position": posStr, 
            "tier": inputTier, 
            "arts": []
        };

        results.push(result);
    });

    outputContainer.value = JSON.stringify(results, null, 4);
    showButtons();
}