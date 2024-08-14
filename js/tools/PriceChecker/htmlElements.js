window.addEventListener("DOMContentLoaded", (event) => {});

function createStats(categoryCount, productCount) {
    const jsonContainer = document.getElementById("js-json-data-container");
    const statElement = document.createElement("div");
    statElement.classList.add("generic-stats");

    const categoryElement = document.createElement("p");
    categoryElement.textContent = "Categories Checked: " + categoryCount;

    const productElement = document.createElement("p");
    productElement.textContent = "Products Checked: " + productCount;

    jsonContainer.appendChild(statElement);
    statElement.appendChild(categoryElement);
    statElement.appendChild(productElement);

    return true;
}

function createIssueBoxCritical() {
    const jsonContainer = document.getElementById("js-json-data-container");
    const issueBox = document.createElement("div");
    issueBox.classList.add("issue-box");
    issueBox.classList.add("critical");
    issueBox.classList.add("hide");
    issueBox.setAttribute("id", "ib-critical");

    const issueBoxHeader = document.createElement("h2");
    issueBoxHeader.textContent = "Critical";

    jsonContainer.appendChild(issueBox);
    issueBox.appendChild(issueBoxHeader);
}

function createIssueBoxProblem() {
    const jsonContainer = document.getElementById("js-json-data-container");
    const issueBox = document.createElement("div");
    issueBox.classList.add("issue-box");
    issueBox.classList.add("problem");
    issueBox.classList.add("hide");
    issueBox.setAttribute("id", "ib-problem");

    const issueBoxHeader = document.createElement("h2");
    issueBoxHeader.textContent = "Problem";

    jsonContainer.appendChild(issueBox);
    issueBox.appendChild(issueBoxHeader);
}

function createIssueBoxWarning() {
    const jsonContainer = document.getElementById("js-json-data-container");
    const issueBox = document.createElement("div");
    issueBox.classList.add("issue-box");
    issueBox.classList.add("warning");
    issueBox.classList.add("hide");
    issueBox.setAttribute("id", "ib-warning");

    const issueBoxHeader = document.createElement("h2");
    issueBoxHeader.textContent = "Warning";

    jsonContainer.appendChild(issueBox);
    issueBox.appendChild(issueBoxHeader);
}

function createIssueBoxUnsortet() {
    const jsonContainer = document.getElementById("js-json-data-container");
    const issueBox = document.createElement("div");
    issueBox.classList.add("issue-box");
    issueBox.classList.add("unsortet");
    issueBox.classList.add("hide");
    issueBox.setAttribute("id", "ib-unsortet");

    const issueBoxHeader = document.createElement("h2");
    issueBoxHeader.textContent = "Unsortet";

    jsonContainer.appendChild(issueBox);
    issueBox.appendChild(issueBoxHeader);
}

function createIssueBoxOk() {
    const jsonContainer = document.getElementById("js-json-data-container");
    const issueBox = document.createElement("div");
    issueBox.classList.add("issue-box");
    issueBox.classList.add("ok");
    issueBox.setAttribute("id", "ib-ok");

    const issueBoxHeader = document.createElement("h2");
    issueBoxHeader.textContent = "Everything seems OK";

    jsonContainer.appendChild(issueBox);
    issueBox.appendChild(issueBoxHeader);
}

function appendIssueboxCritical(category, issues) {
    const issueBox = document.getElementById("ib-critical");
    const categoryBox = document.createElement("div");
    categoryBox.classList.add("category");

    const ibOk = document.getElementById("ib-ok");
    if (!ibOk.classList.contains("hide")) {
        hideAndShow("ib-ok", false);
    }
    hideAndShow("ib-critical", true);

    const categoryHeader = document.createElement("h3");
    categoryHeader.textContent = "Category: ";

    const preCat = document.createElement("pre");
    preCat.textContent = category;

    issueBox.appendChild(categoryBox);
    categoryBox.appendChild(categoryHeader);
    categoryHeader.appendChild(preCat);

    for (let i = 0; i < issues.length; i++) {
        const issue = issues[i];

        const itemBox = document.createElement("div");
        itemBox.classList.add("item-box");
        const leftBox = document.createElement("div");
        leftBox.classList.add("left");
        const rightBox = document.createElement("div");
        rightBox.classList.add("right");

        categoryBox.appendChild(itemBox);

        leftBox.innerHTML = `Name: <br>
        Price: <br>
        Issue: <br>
        Valid Schema: <br>
        Schema: <br>`;

        itemBox.appendChild(leftBox);

        const preName = document.createElement("pre");
        preName.textContent = issue.Name;
        const prePrice = document.createElement("pre");
        prePrice.textContent = issue.Pricing;
        const preIssue = document.createElement("pre");
        preIssue.textContent = issue.Info;
        const preSchemaValid = document.createElement("pre");
        preSchemaValid.textContent = issue.ValidSchema;
        const preSchema = document.createElement("pre");
        preSchema.textContent = issue.Schema;

        itemBox.appendChild(rightBox);
        rightBox.appendChild(preName);
        rightBox.appendChild(prePrice);
        rightBox.appendChild(preIssue);
        rightBox.appendChild(preSchemaValid);
        rightBox.appendChild(preSchema);

        if (issues.length - 1 !== i) {
            categoryBox.appendChild(
                document.createTextNode("_______________________")
            );
        } else {
            categoryBox.classList.add("extra-space");
        }
    }
}

function appendIssueboxProblem(category, issues) {
    const issueBox = document.getElementById("ib-problem");
    const categoryBox = document.createElement("div");
    categoryBox.classList.add("category");

    const categoryHeader = document.createElement("h3");
    categoryHeader.textContent = "Category: ";

    const preCat = document.createElement("pre");
    preCat.textContent = category;

    const ibOk = document.getElementById("ib-ok");
    if (!ibOk.classList.contains("hide")) {
        hideAndShow("ib-ok", false);
    }
    hideAndShow("ib-problem", true);

    issueBox.appendChild(categoryBox);
    categoryBox.appendChild(categoryHeader);
    categoryHeader.appendChild(preCat);

    for (let i = 0; i < issues.length; i++) {
        const issue = issues[i];

        const itemBox = document.createElement("div");
        itemBox.classList.add("item-box");
        const leftBox = document.createElement("div");
        leftBox.classList.add("left");
        const rightBox = document.createElement("div");
        rightBox.classList.add("right");

        categoryBox.appendChild(itemBox);

        leftBox.innerHTML = `Name: <br>
        Price: <br>
        Issue: <br>
        Valid Schema: <br>
        Schema: <br>`;

        itemBox.appendChild(leftBox);

        const preName = document.createElement("pre");
        preName.textContent = issue.Name;
        const prePrice = document.createElement("pre");
        prePrice.textContent = issue.Pricing;
        const preIssue = document.createElement("pre");
        preIssue.textContent = issue.Info;
        const preSchemaValid = document.createElement("pre");
        preSchemaValid.textContent = issue.ValidSchema;
        const preSchema = document.createElement("pre");
        preSchema.textContent = issue.Schema;

        itemBox.appendChild(rightBox);
        rightBox.appendChild(preName);
        rightBox.appendChild(prePrice);
        rightBox.appendChild(preIssue);
        rightBox.appendChild(preSchemaValid);
        rightBox.appendChild(preSchema);

        if (issues.length - 1 !== i) {
            categoryBox.appendChild(
                document.createTextNode("_______________________")
            );
        } else {
            categoryBox.classList.add("extra-space");
        }
    }
}

function appendIssueboxWarning(category, issues) {
    const issueBox = document.getElementById("ib-warning");
    const categoryBox = document.createElement("div");
    categoryBox.classList.add("category");

    const categoryHeader = document.createElement("h3");
    categoryHeader.textContent = "Category: ";

    const preCat = document.createElement("pre");
    preCat.textContent = category;

    const ibOk = document.getElementById("ib-ok");
    if (!ibOk.classList.contains("hide")) {
        hideAndShow("ib-ok", false);
    }
    hideAndShow("ib-warning", true);

    issueBox.appendChild(categoryBox);
    categoryBox.appendChild(categoryHeader);
    categoryHeader.appendChild(preCat);

    for (let i = 0; i < issues.length; i++) {
        const issue = issues[i];

        const itemBox = document.createElement("div");
        itemBox.classList.add("item-box");
        const leftBox = document.createElement("div");
        leftBox.classList.add("left");
        const rightBox = document.createElement("div");
        rightBox.classList.add("right");

        categoryBox.appendChild(itemBox);

        leftBox.innerHTML = `Name: <br>
        Price: <br>
        Issue: <br>
        Valid Schema: <br>
        Schema: <br>`;

        itemBox.appendChild(leftBox);

        const preName = document.createElement("pre");
        preName.textContent = issue.Name;
        const prePrice = document.createElement("pre");
        prePrice.textContent = issue.Pricing;
        const preIssue = document.createElement("pre");
        preIssue.textContent = issue.Info;
        const preSchemaValid = document.createElement("pre");
        preSchemaValid.textContent = issue.ValidSchema;
        const preSchema = document.createElement("pre");
        preSchema.textContent = issue.Schema;

        itemBox.appendChild(rightBox);
        rightBox.appendChild(preName);
        rightBox.appendChild(prePrice);
        rightBox.appendChild(preIssue);
        rightBox.appendChild(preSchemaValid);
        rightBox.appendChild(preSchema);

        if (issues.length - 1 !== i) {
            categoryBox.appendChild(
                document.createTextNode("_______________________")
            );
        } else {
            categoryBox.classList.add("extra-space");
        }
    }
}

function appendIssueboxUnsortet(category, issues) {
    const issueBox = document.getElementById("ib-unsortet");
    const categoryBox = document.createElement("div");
    categoryBox.classList.add("category");

    const categoryHeader = document.createElement("h3");
    categoryHeader.textContent = "Category: ";

    const preCat = document.createElement("pre");
    preCat.textContent = category;

    const ibOk = document.getElementById("ib-ok");
    if (!ibOk.classList.contains("hide")) {
        hideAndShow("ib-ok", false);
    }
    hideAndShow("ib-unsortet", true);

    issueBox.appendChild(categoryBox);
    categoryBox.appendChild(categoryHeader);
    categoryHeader.appendChild(preCat);

    for (let i = 0; i < issues.length; i++) {
        const issue = issues[i];

        const itemBox = document.createElement("div");
        itemBox.classList.add("item-box");
        const leftBox = document.createElement("div");
        leftBox.classList.add("left");
        const rightBox = document.createElement("div");
        rightBox.classList.add("right");

        categoryBox.appendChild(itemBox);

        leftBox.innerHTML = `Name: <br>
        Price: <br>
        Issue: <br>
        Valid Schema: <br>
        Schema: <br>`;

        itemBox.appendChild(leftBox);

        const preName = document.createElement("pre");
        preName.textContent = issue.Name;
        const prePrice = document.createElement("pre");
        prePrice.textContent = issue.Pricing;
        const preIssue = document.createElement("pre");
        preIssue.textContent = issue.Info;
        const preSchemaValid = document.createElement("pre");
        preSchemaValid.textContent = issue.ValidSchema;
        const preSchema = document.createElement("pre");
        preSchema.textContent = issue.Schema;

        itemBox.appendChild(rightBox);
        rightBox.appendChild(preName);
        rightBox.appendChild(prePrice);
        rightBox.appendChild(preIssue);
        rightBox.appendChild(preSchemaValid);
        rightBox.appendChild(preSchema);

        if (issues.length - 1 !== i) {
            categoryBox.appendChild(
                document.createTextNode("_______________________")
            );
        } else {
            categoryBox.classList.add("extra-space");
        }
    }
}
