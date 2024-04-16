window.addEventListener("DOMContentLoaded", (event) => {
    buttonListener();
    downloadButton();
    copyButton();
});

function buttonListener() {
    const button = document.getElementById("js-transform-json");
    button.addEventListener("click", ()=>{
        reset();
        generateConfig();
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
        const data = document.getElementById("outputTextArea").value;
        let name = document.getElementById("js-extend").value;
        downloadCpp(name, data);
    });
}

function downloadCpp(name, data) {
    const blob = new Blob([data], { type: 'text/x-c++src' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    let filename = 'AZ_sGunplay_config.cpp';
    if (name != "") {
        filename = 'AZ_sGunplay_'+ name +'_config.cpp';
    }
    
    link.href = url;
    link.download = filename;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function generateConfig() {

    let input = document.getElementById("inputTextArea").value;
    let outputContainer = document.getElementById("outputTextArea");

    if (input == ""){
        outputContainer.classList.add("failed");
        outputContainer.value = "Input is empty!";
        return;
    }

    let jsonString = '[' + input + ']';
    
    if (!isValidJSON(jsonString)) {
        outputContainer.classList.add("failed");
        outputContainer.value = "Input Schema is invalid!";
        return;
    }

    let jsonArray = JSON.parse(jsonString);
    let extend = document.getElementById("js-extend").value || "Inventory_Base";

    let stabilityXMin = document.getElementById("js-stabilityX-min").value;
    let stabilityXMax = document.getElementById("js-stabilityX-max").value;

    let stabilityYMin = document.getElementById("js-stabilityY-min").value;
    let stabilityYMax = document.getElementById("js-stabilityY-max").value;

    let misalignmentXMin = document.getElementById("js-misalignmentX-min").value;
    let misalignmentXMax = document.getElementById("js-misalignmentX-max").value;

    let misalignmentYMin = document.getElementById("js-misalignmentY-min").value;
    let misalignmentYMax = document.getElementById("js-misalignmentY-max").value;

    let controlKickMin = document.getElementById("js-controlKick-min").value;
    let controlKickMax = document.getElementById("js-controlKick-max").value;

    let stabilityX = 0;
    let stabilityY = 0;
    let misalignmentX = 0; 
    let misalignmentY = 0;
    let controlKick = 0;

    let combinedString = '';
    
    jsonArray.forEach((obj) => {
        if (obj) {
            stabilityX =  generateNumber(stabilityXMin, stabilityXMax);
            stabilityY =  generateNumber(stabilityYMin, stabilityYMax);
            misalignmentX =  generateNumber(misalignmentXMin, misalignmentXMax);
            misalignmentY =  generateNumber(misalignmentYMin, misalignmentYMax);
            controlKick =  generateNumber(controlKickMin, controlKickMax);
            combinedString += generateSingleConfig(obj, extend, stabilityX, stabilityY, misalignmentX, misalignmentY, controlKick) + '\n\n';
        } else {
            console.error("className is undefined or null for object:", obj);
            outputContainer.classList.add("failed");
            outputContainer.value = "Something went wrong. Check console or reload the page.";
            return;
        }
    });

    console.log(combinedString);

    outputContainer.value = combinedString;
    showButtons();
}

function isValidJSON(jsonString) {
    try {
        JSON.parse(jsonString);
        return true;
    } catch (error) {
        return false;
    }
}

function generateNumber(num1, num2) {
    if (num1 == "" && num2 == "") {
        return 0;
    }

    if (num1 == num2) {
        return parseFloat(num1).toFixed(2);
    }

    if (num1 == "" && num2 != "") {
        return parseFloat(num2).toFixed(2);
    }

    if (num1 != "" && num2 == "") {
        return parseFloat(num1).toFixed(2);
    }

    if (num1 > num2) {
        return parseFloat(num1).toFixed(2);
    }

    return (Math.random() * (parseFloat(num2) - parseFloat(num1)) + parseFloat(num1)).toFixed(2);
}

function generateSingleConfig(className, extend, sX, sY, mX, mY, cK){
    let properties = [
        { name: "s_recoilControlStabilityX", value: sX },
        { name: "s_recoilControlStabilityY", value: sY },
        { name: "s_recoilControlMisalignmentX", value: mX },
        { name: "s_recoilControlMisalignmentY", value: mY },
        { name: "s_recoilControlKick", value: cK }
    ];

    return generateClassString(className, extend, properties);
}

function generateClassString(className, extend, properties) {
    let classString = `class ${className}: ${extend}
{
${properties.map(property => `    ${property.name} = ${property.value};`).join('\n')}
};`;
    return classString;
}