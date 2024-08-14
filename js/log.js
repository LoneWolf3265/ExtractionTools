window.addEventListener("DOMContentLoaded", (event) => {
    
});

const messageType = {
    "failed": "failed",
    "done": "done",
    "eventstart": "event",
    "eventend": "event",
    "saved": "save",
    "update": "save",
    "warning": "save",
    "OK": "done",
};

function appendLog(message, type) {
    if (!message) {
        return null;
    }
    const logContainer = document.getElementById("js-logs-container");
    const logEntry = document.createElement('p');
    if (type) {
        type = type.toLowerCase();
        if (messageType[type] !== 'undefined') {
            
            const span = document.createElement('span');
            span.classList.add(messageType[type]);
            span.textContent = type;
    
            const bracketsText = document.createTextNode('[');
            const closingBracketText = document.createTextNode('] ');
    
            logEntry.appendChild(bracketsText);
            logEntry.appendChild(span);
            logEntry.appendChild(closingBracketText);
    
            const textMessage = document.createTextNode(message);
            logEntry.appendChild(textMessage);
            logContainer.appendChild(logEntry);
        } else {
            logEntry.textContent = message;
            logContainer.appendChild(logEntry);
        }
    }else {
        logEntry.textContent = message;
        logContainer.appendChild(logEntry);
    }
    logContainer.scrollTop = logContainer.scrollHeight;
}