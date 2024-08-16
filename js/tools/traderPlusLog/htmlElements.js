window.addEventListener("DOMContentLoaded", (event) => {
});

function createFilename(name) {
    const jsonContainer = document.getElementById("js-json-data-container");
    const statElement = document.createElement("div");
    statElement.classList.add("generic-stats");
    statElement.setAttribute("id", "js-generic-stat");

    const headerElement = document.createElement("h2");
    headerElement.textContent = name;

    jsonContainer.appendChild(statElement);
    statElement.appendChild(headerElement);
}

function createGenericStats(transactionsCount, userCount) {
    const statElement = document.getElementById("js-generic-stat");
    const infoElement = document.createElement("div");
    infoElement.classList.add("info");
    infoElement.setAttribute('id', 'js-info-element');

    infoElement.innerHTML = 'Total Transactions: ' + transactionsCount + '<br> Total Users: ' + userCount;

    statElement.appendChild(infoElement);
}

function addTotalMoneyMadeToStats(money){
    const infoElement = document.getElementById('js-info-element');
    infoElement.innerHTML = infoElement.innerHTML + '<br> Total Money Made: + ' + money;
}

function createPreJsonElement(json, json2){
    const jsonContainer = document.getElementById("json-view");
    
    const json1Element = document.createElement("pre");
    json1Element.setAttribute('id', 'js-json-transactions');
    const json2Element = document.createElement("pre");
    json2Element.setAttribute('id', 'js-json-group-user');

    contentJson1 = JSON.stringify(json, null, 4);
    contentJson2 = JSON.stringify(json2, null, 4);

    json1Element.textContent = contentJson1;
    json2Element.textContent = contentJson2;

    const copyTransaction = document.getElementById("js-generated-json-data");
    const copyUser = document.getElementById("js-generated-json-data-sorted");
    
    copyTransaction.value = contentJson1;
    copyUser.value = contentJson2;

    jsonContainer.appendChild(json1Element);
    jsonContainer.appendChild(json2Element);
}

function createGeneralTimelineAndSortedElements(){
    const jsonContainer = document.getElementById("js-json-data-container");
    const mainTable = document.createElement("div");
    mainTable.classList.add("split-view");
    mainTable.setAttribute('id', 'main-container');

    jsonContainer.appendChild(mainTable);

    const timelineElement = document.createElement("div");
    timelineElement.classList.add("timeline");
    timelineElement.setAttribute('id', 'js-timeline-container');
    mainTable.appendChild(timelineElement);

    const userElement = document.createElement("div");
    userElement.classList.add("groupUser");
    userElement.setAttribute('id', 'js-user-container');
    mainTable.appendChild(userElement);

    const timelineHeader = document.createElement("h2");
    timelineHeader.textContent = "Timeline:"
    timelineElement.appendChild(timelineHeader);

    const userHeader = document.createElement('h2');
    userHeader.textContent = "Sorted by User:";
    userElement.appendChild(userHeader);

    const entryWrapperTimeline = document.createElement("div");
    entryWrapperTimeline.classList.add("entry-wrapper");
    entryWrapperTimeline.setAttribute('id', 'js-entry-wrapper-timeline');
    timelineElement.appendChild(entryWrapperTimeline);

    const entryWrapperUser = document.createElement('div');
    entryWrapperUser.classList.add("entry-wrapper");
    entryWrapperUser.setAttribute('id', 'js-entry-wrapper-user');
    userElement.appendChild(entryWrapperUser);
}

function createEntryInTimeline(transaction, type, id) {
    const timelineElement = document.getElementById("js-entry-wrapper-timeline");

    const entryElement = document.createElement('div');
    entryElement.classList.add("entry");
    timelineElement.appendChild(entryElement);

    //HEader
    const entryHeader = document.createElement('div');
    entryHeader.classList.add('entry-header');
    entryHeader.setAttribute('id', 'entry-header-timeline-' + id);
    entryElement.appendChild(entryHeader);

    //Info
    const entryInfo = document.createElement('div');
    entryInfo.classList.add('entry-info');
    entryHeader.appendChild(entryInfo);

    // BUY/SELL
    const actionDone = document.createElement('div');
    if (type === 'GIVE') {
        actionDone.classList.add('buy');
        actionDone.textContent = 'buy';
    } else if (type === 'SELL') {
        actionDone.classList.add('sell');
        actionDone.textContent = 'sell';
    };
    entryInfo.appendChild(actionDone);

    //TIME
    const timeElement = document.createElement('div');
    timeElement.classList.add('time');
    timeElement.textContent = transaction.timestamp;
    entryInfo.appendChild(timeElement);

    //Nick + ID
    const userElement = document.createElement('pre');
    userElement.classList.add('entry-user');
    userElement.textContent = transaction.nick + " - " + transaction.id64;
    entryHeader.appendChild(userElement);

    //Icon
    const iconElement = document.createElement('span');
    iconElement.classList.add('icon-angle');
    iconElement.classList.add('rotate90-d');
    iconElement.setAttribute('id', 'icon-angle-timeline-' + id);
    iconElement.innerHTML = '&#x276F;';
    entryHeader.appendChild(iconElement);

    const entryContent = document.createElement('div');
    entryContent.classList.add('entry-content');
    entryContent.classList.add('collapsed');
    entryContent.classList.add('collapse-container-clean');
    entryContent.setAttribute('id', 'entry-content-timeline-' + id);
    entryElement.appendChild(entryContent);

    //item
    const entryItems = document.createElement('div');
    entryItems.classList.add('entry-items');
    entryContent.appendChild(entryItems);

    //Item left
    const entryItemsLeft = document.createElement('div');
    entryItemsLeft.classList.add('left');
    entryItemsLeft.textContent = 'Items: ';
    entryItems.appendChild(entryItemsLeft);

    //item right
    const entryItemsRight = document.createElement('div');
    entryItemsRight.classList.add('right');
    entryItems.appendChild(entryItemsRight);

    //items itself
    transaction.items.forEach(item => {
        let name = item.item;
        let count = item.count;

        const product = document.createElement('pre');
        product.textContent = name + ' - ' + count;
        entryItemsRight.appendChild(product);
    });

    //location
    const entryLocation = document.createElement('div');
    entryLocation.classList.add('entry-location');
    entryContent.appendChild(entryLocation);

    //location left
    const entryLocationLeft = document.createElement('div');
    entryLocationLeft.classList.add('left');
    entryLocationLeft.textContent = 'Location: ';
    entryLocation.appendChild(entryLocationLeft);

    //Location right
    const entryLocationRight = document.createElement('div');
    entryLocationRight.classList.add('right');
    const entryLocationRightPre = document.createElement('pre');
    //TODO: Fix cord to location;
    entryLocationRightPre.textContent = transaction.position;
    entryLocation.appendChild(entryLocationRight);
    entryLocationRight.appendChild(entryLocationRightPre);

    if (type === 'SELL') {
        const entryMoney = document.createElement('div');
        entryMoney.classList.add('entry-money');
        const entryMoneyAmount = document.createElement('div');
        entryMoneyAmount.classList.add('money');
        entryMoneyAmount.textContent = '+ ' + transaction.money;
        entryContent.appendChild(entryMoney);
        entryMoney.appendChild(entryMoneyAmount);
    }

    //Add colapse listeners
    collapseElementListener('entry-header-timeline-' + id, 'entry-content-timeline-' + id,'icon-angle-timeline-' + id);
}

function createEntryInSortedByUsers(user, id) {
    console.log('SUS: ' +user.name);
    const userMainElement = document.getElementById('js-entry-wrapper-user');

    //usercontainer
    const userContainer = document.createElement('div');
    userContainer.classList.add('user-container');
    userContainer.setAttribute('id', 'container-' + user.steamId);

    userMainElement.appendChild(userContainer);

    //statheader
    const statHeader = document.createElement('div');
    statHeader.classList.add('stats-header');
    statHeader.setAttribute('id', 'statheader-' + id);
    userContainer.appendChild(statHeader);

    //statheader user
    const statHeaderUser = document.createElement('div');
    statHeaderUser.textContent = 'User: ';
    statHeader.appendChild(statHeaderUser);

    //statheader name + id
    const statHeaderName = document.createElement('pre');
    statHeaderName.textContent = user.name + ' - ' +user.steamId;
    statHeader.appendChild(statHeaderName);

    //statheader icon
    const statIconElement = document.createElement('span');
    statIconElement.classList.add('icon-angle');
    
    statIconElement.setAttribute('id', 'icon-angle-statheader-' + id);
    statIconElement.innerHTML = '&#x276F;';
    statHeader.appendChild(statIconElement);

    //statsContent
    const statContent = document.createElement('div');
    statContent.classList.add('stats-content');
    statContent.setAttribute('id', 'statcontent-' + id);
    userContainer.appendChild(statContent);

    //userStats
    const userStats = document.createElement('div');
    userStats.classList.add('user-stats');
    statContent.appendChild(userStats);

    //name 
    const nameStatEntry = generateStatEntry('Name: ', user.name);
    const buttonName = document.createElement('button');
    buttonName.classList.add('small-button');
    buttonName.setAttribute('id', 'copy-name-' + id);
    buttonName.textContent = 'Copy';
    const hiddenValName = document.createElement('input');
    hiddenValName.setAttribute('type', 'hidden');
    hiddenValName.setAttribute('id', 'copy-name-value-' + id);
    hiddenValName.value = user.name;

    nameStatEntry.appendChild(buttonName);
    nameStatEntry.appendChild(hiddenValName);
    userStats.appendChild(nameStatEntry);
    createCopyBtnListener('copy-name-' + id, 'copy-name-value-' + id);

    //steamid
    const steamStatEntry = generateStatEntry('SteamID64: ', user.steamId);
    const buttonSteam = document.createElement('button');
    buttonSteam.classList.add('small-button');
    buttonSteam.setAttribute('id', 'copy-steam-' + id);
    buttonSteam.textContent = 'Copy';
    const hiddenValSteam = document.createElement('input');
    hiddenValSteam.setAttribute('type', 'hidden');
    hiddenValSteam.setAttribute('id', 'copy-steam-value-' + id);
    hiddenValSteam.value = user.steamId;

    steamStatEntry.appendChild(buttonSteam);
    steamStatEntry.appendChild(hiddenValSteam);
    userStats.appendChild(steamStatEntry);
    createCopyBtnListener('copy-steam-' + id, 'copy-steam-value-' + id);


    //total transactions
    const totTransStatEntry = generateStatEntry('Total Transactions: ', user.totalTransactions);
    userStats.appendChild(totTransStatEntry);

    //tot Items bought
    const totBoughtStatEntry = generateStatEntry('Total Items Bought: ', user.totalItemsBought);
    userStats.appendChild(totBoughtStatEntry);

    //tot sold
    const totSoldStatEntry = generateStatEntry('Total Items Sold: ', user.totalItemsSold, 3);
    userStats.appendChild(totSoldStatEntry);

    //tot money
    const totMoneyStatEntry = generateStatEntry('Money made: ', user.moneyMadeFromSelling, 4);
    userStats.appendChild(totMoneyStatEntry);

    //history wrapper
    const historyWrapper = document.createElement('div');
    historyWrapper.classList.add('show-history-wrapper');
    historyWrapper.setAttribute('id', 'js-history-wrapper-' + id);
    statContent.appendChild(historyWrapper);

    //history-wrapper title 
    const historyWrapperTitle = document.createElement('div');
    historyWrapperTitle.textContent = 'Show Trader history';
    historyWrapper.appendChild(historyWrapperTitle);

    const historyIconElement = document.createElement('span');
    historyIconElement.classList.add('icon-angle');
    historyIconElement.classList.add('rotate90-d');
    historyIconElement.setAttribute('id', 'icon-angle-history-' + id);
    historyIconElement.innerHTML = '&#x276F;';
    historyWrapper.appendChild(historyIconElement);

    //trades
    const tradingHistory = document.createElement('div');
    tradingHistory.classList.add('trading-history');
    tradingHistory.classList.add('collapsed');
    tradingHistory.setAttribute('id', 'js-trading-history-' + id);
    statContent.appendChild(tradingHistory);

    collapseElementListener('statheader-' + id, 'statcontent-' + id,'icon-angle-statheader-' + id);
    collapseElementListener('js-history-wrapper-' + id, 'js-trading-history-' + id, 'icon-angle-history-' + id);

    let count = 1;
    user.transactions.forEach(transaction => {
        let transactionType = transaction.type;
        createSortedEntry('js-trading-history-' + id, transaction, transactionType, count);
        count++;
    });
}

function createSortedEntry(containerId, transaction, type, id) {
    console.log(containerId);
    const timelineElement = document.getElementById(containerId);

    const entryElement = document.createElement('div');
    entryElement.classList.add("entry");
    timelineElement.appendChild(entryElement);

    //HEader
    const entryHeader = document.createElement('div');
    entryHeader.classList.add('entry-header');
    entryHeader.setAttribute('id', 'entry-header-sorted-' + containerId + id);
    entryElement.appendChild(entryHeader);

    //Info
    const entryInfo = document.createElement('div');
    entryInfo.classList.add('entry-info');
    entryHeader.appendChild(entryInfo);

    // BUY/SELL
    const actionDone = document.createElement('div');
    if (type === 'GIVE') {
        actionDone.classList.add('buy');
        actionDone.textContent = 'buy';
    } else if (type === 'SELL') {
        actionDone.classList.add('sell');
        actionDone.textContent = 'sell';
    };
    entryInfo.appendChild(actionDone);

    //TIME
    const timeElement = document.createElement('div');
    timeElement.classList.add('time');
    timeElement.textContent = transaction.timestamp;
    entryInfo.appendChild(timeElement);

    //Nick + ID
    const userElement = document.createElement('pre');
    userElement.classList.add('entry-user');
    userElement.textContent = transaction.nick + " - " + transaction.id64;
    entryHeader.appendChild(userElement);

    //Icon
    const iconElement = document.createElement('span');
    iconElement.classList.add('icon-angle');
    iconElement.classList.add('rotate90-d');
    iconElement.setAttribute('id', 'icon-angle-sorted-' + containerId + id);
    iconElement.innerHTML = '&#x276F;';
    entryHeader.appendChild(iconElement);

    const entryContent = document.createElement('div');
    entryContent.classList.add('entry-content');
    entryContent.classList.add('collapsed');
    entryContent.classList.add('collapse-container-clean');
    entryContent.setAttribute('id', 'entry-content-sorted-' + containerId + id);
    entryElement.appendChild(entryContent);

    //item
    const entryItems = document.createElement('div');
    entryItems.classList.add('entry-items');
    entryContent.appendChild(entryItems);

    //Item left
    const entryItemsLeft = document.createElement('div');
    entryItemsLeft.classList.add('left');
    entryItemsLeft.textContent = 'Items: ';
    entryItems.appendChild(entryItemsLeft);

    //item right
    const entryItemsRight = document.createElement('div');
    entryItemsRight.classList.add('right');
    entryItems.appendChild(entryItemsRight);

    //items itself
    transaction.items.forEach(item => {
        let name = item.item;
        let count = item.count;

        const product = document.createElement('pre');
        product.textContent = name + ' - ' + count;
        entryItemsRight.appendChild(product);
    });

    //location
    const entryLocation = document.createElement('div');
    entryLocation.classList.add('entry-location');
    entryContent.appendChild(entryLocation);

    //location left
    const entryLocationLeft = document.createElement('div');
    entryLocationLeft.classList.add('left');
    entryLocationLeft.textContent = 'Location: ';
    entryLocation.appendChild(entryLocationLeft);

    //Location right
    const entryLocationRight = document.createElement('div');
    entryLocationRight.classList.add('right');
    const entryLocationRightPre = document.createElement('pre');
    //TODO: Fix cord to location;
    entryLocationRightPre.textContent = transaction.position;
    entryLocation.appendChild(entryLocationRight);
    entryLocationRight.appendChild(entryLocationRightPre);

    if (type === 'SELL') {
        const entryMoney = document.createElement('div');
        entryMoney.classList.add('entry-money');
        const entryMoneyAmount = document.createElement('div');
        entryMoneyAmount.classList.add('money');
        entryMoneyAmount.textContent = '+ ' + transaction.money;
        entryContent.appendChild(entryMoney);
        entryMoney.appendChild(entryMoneyAmount);
    }

    //Add colapse listeners
    collapseElementListener('entry-header-sorted-' + containerId + id, 'entry-content-sorted-' + containerId + id,'icon-angle-sorted-'+ containerId + id);
}

function generateStatEntry(left, pre, val){
    let statEntry = document.createElement('div');
    statEntry.classList.add('stat-entry');

    let leftElement = document.createElement('div');
    leftElement.classList.add('left');
    leftElement.textContent = left;
    statEntry.appendChild(leftElement);

    let preElement = document.createElement('pre');
    preElement.textContent = pre;
    if (val == 4 && pre !== 0 && pre < 25000) {
        preElement.classList.add('green');
        preElement.textContent = '+ ' + pre;
    } else if (val == 4 && pre !== 0 && pre > 25000){
        preElement.classList.add('care');
        preElement.textContent = '+ ' + pre;
    } else if (val == 3 && pre >= 600){
        preElement.classList.add('red');
    }
    statEntry.appendChild(preElement);

    return statEntry;
}