window.addEventListener("DOMContentLoaded", (event) => {
    buttonListener();
});

function buttonListener() {
    const button = document.getElementById("js-validate-json");

    button.addEventListener("click", () => {
        validateJSON();
    });
}

function validateJSON() {
    const inputTextArea = document.getElementById('inputTextArea');
    const input = inputTextArea.value;
    resetStatusOfJson();

    try {
        JSON.parse(input);
        document.getElementById('errorTextArea').textContent = 'JSON is valid.';
        //TODO: add reset function
        const errorMessageFiled = document.getElementById("error-message");
        errorMessageFiled.textContent = '';
        clearErrorHighlight();
        showStatusOfJson(true);
    } catch (error) {
        let errorMessage = '';
        if (error instanceof SyntaxError && error.message.includes('Unexpected token')) {
            errorMessage = 'Invalid JSON syntax. ' + error.message;
        } else {
            errorMessage = error.message;
        }
        // Copy the input JSON to the error textarea
        document.getElementById('errorTextArea').textContent = formatErrorJSON(error);

        const errorMessageFiled = document.getElementById("error-message");

        errorMessageFiled.textContent = errorMessage;

        // Get the error location information
        const errorLocation = getErrorLocation(error);

        if (errorLocation) {

            const errorIndex = errorLocation.index;
            const errorLength = errorLocation.length;;
            const errorTextArea = document.getElementById('errorTextArea');

            // Wrap the error location with a span tag and apply highlighting
            const errorStartTag = '<span class="highlight">';
            const errorEndTag = '</span>';

            const maxLength = 250;
            const trimmedContentBefore = input.substring(Math.max(0, errorIndex - maxLength), errorIndex);
            const trimmedContentAfter = input.substring(errorIndex + errorLength, errorIndex + errorLength + maxLength);

            const markedError = trimmedContentBefore +
                errorStartTag +
                'ERROR' +
                errorEndTag +
                trimmedContentAfter;
            errorTextArea.innerHTML = markedError;

            inputTextArea.focus();
            const errorLine = input.substr(0, errorIndex).split('\n').length - 1;
            const scrollTopValue = (14 * errorLine) - 100;
            inputTextArea.scrollTop = scrollTopValue;

            showStatusOfJson(false);
        }
    }
}

function clearErrorHighlight() {
    const errorTextArea = document.getElementById('errorTextArea');
    errorTextArea.textContent = ''; // Clear error message
}

function formatErrorJSON(error) {
    const errorArray = Object.keys(error).map(key => error[key]);

    return JSON.stringify(errorArray, null, 4);
}

function getErrorLocation(error) {
    if (error instanceof SyntaxError) {
        const errorMatch = error.message.match(/position\s(\d+)/);
        if (errorMatch && errorMatch.length > 1) {
            const errorIndex = parseInt(errorMatch[1], 10);
            return { index: errorIndex, length: 1 };
        }
    }
    return null;
}

function showStatusOfJson(status) {
    const statusField = document.getElementById("js-json-status");
    const container = document.getElementById("status-box");
    const textarea = document.getElementById("inputTextArea");
    const outputContainer = document.getElementById("js-output-container");

    if (status === true) {
        container.classList.remove("hide");
        textarea.classList.add("textarea-valid");
        statusField.textContent = "Valid"
        statusField.classList.add("valid");
    } else if (status === false) {
        container.classList.remove("hide");
        outputContainer.classList.remove("hide");
        textarea.classList.add("textarea-invalid");
        statusField.textContent = "Invalid"
        statusField.classList.add("invalid");
    } else {
        console.log("Status couldn't be updated");
    }
}

function resetStatusOfJson() {
    const statusField = document.getElementById("js-json-status");
    const container = document.getElementById("status-box");
    const textarea = document.getElementById("inputTextArea");
    const outputContainer = document.getElementById("js-output-container");

    outputContainer.classList.add("hide");
    container.classList.add("hide");
    statusField.textContent = "";
    statusField.classList.remove(...statusField.classList);
    textarea.classList.remove("textarea-valid");
    textarea.classList.remove("textarea-invalid");
}