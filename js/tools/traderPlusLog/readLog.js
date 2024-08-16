window.addEventListener("DOMContentLoaded", (event) => {
});

function initReadTraderPlusLogFile(file) {
    return new Promise((resolve) => {
        getFileContent(file).then(function (fileContent){
            if (fileContent === false) {
                resolve(false);
                return;
            }
            
            const fileName = fileContent.fileName;
            const logContent = fileContent.logContent;

            createFilename(fileName);

            getParsedLogContent(logContent).then(function (parsedLog) {
                if (parsedLog === false) {
                    resolve(false);
                    return;
                }

                const transactions = parsedLog.transactions;
                const groupByUserTransactions = parsedLog.sortedByUserTransactions;

                const totalTransactions = transactions.length;
                const userCount = Object.keys(groupByUserTransactions).length;

                createGenericStats(totalTransactions, userCount);
                createPreJsonElement(transactions, groupByUserTransactions);
                createGeneralTimelineAndSortedElements();

                initCreationOfHTMLEntries(transactions, groupByUserTransactions).then(function (creationStatus) {
                    resolve(creationStatus);
                    return;
                });
            });
        });
    });
}

function initCreationOfHTMLEntries(transactions, groupByUserTransactions) {
    appendLog("Start creating Entries", 'eventstart');
    console.log("[EVENT] Start creating Entries");

    return new Promise((resolve) => {

        let totalMoneyMade = 0;

        let transactionsNR = 1;
        transactions.forEach(transaction => {
            let transactionType = transaction.type;
            createEntryInTimeline(transaction, transactionType, transactionsNR);
            transactionsNR++;
        });
        console.log(groupByUserTransactions);

        Object.keys(groupByUserTransactions).forEach((userKey, index) => {
            const user = groupByUserTransactions[userKey];
            createEntryInSortedByUsers(user, index + 1);
            totalMoneyMade += user.moneyMadeFromSelling;
        });
        addTotalMoneyMadeToStats(totalMoneyMade);

        appendLog("Finished creating Entries", 'eventend');
        console.log("[EVENT] Finished creating Entries");
        resolve(true);
    });

}

function getFileContent(file) {
    appendLog("Start reading TraderPlus Log File", 'eventstart');
    console.log("[EVENT] Start reading TraderPlus Log File");

    return new Promise((resolve) => {
        const fileName = file.name;
        const reader = new FileReader();
        reader.onload = function(e) {
            const logContent = e.target.result; 

            if (logContent === "" ) {
                resolve(false);
                return;
            };

            resolve({fileName,logContent});

        };

        reader.readAsText(file);
    });
}

function getParsedLogContent(log) {
    appendLog("Start parsing LogContent", 'eventstart');
    console.log("[EVENT] Start parsing LogContent");

    return new Promise((resolve) => {
        const lines = log.trim().split('\n');
        const transactions = [];
        let sortedByUserTransactions = [];
        let currentTransaction = null;

        lines.forEach(line => {
            if (line.startsWith('[GIVE]') || line.startsWith('[SELL]')) {
                if (currentTransaction) {
                    transactions.push(currentTransaction);
                }
                currentTransaction = {
                    type: line.startsWith('[GIVE]') ? 'GIVE' : 'SELL',
                    items: []
                };

                if (line.includes('take')) {
                    const itemMatch = line.match(/\[item: (.+?), count: (\d+)\]/) || line.match(/\[item: (.+?)\]/);
                    if (itemMatch) {
                        currentTransaction.items.push({ item: itemMatch[1], count: itemMatch[2] || 1 });
                    }
                }
    
                const timeMatch = line.match(/\[(\d+:\d+:\d+)\]/); // Extract the timestamp
                if (timeMatch) {
                    currentTransaction.timestamp = timeMatch[1];
                }
    
                const playerInfoMatch = line.match(/\[Nick:(.+?), id64:(.+?), pos<(.+?)>\]/);
                if (playerInfoMatch) {
                    currentTransaction.nick = playerInfoMatch[1];
                    currentTransaction.id64 = playerInfoMatch[2];
                    currentTransaction.position = playerInfoMatch[3];
                }
            } else if (line.startsWith('[Item:')) {
                const itemMatch = line.match(/\[Item: (.+?), count: (\d+)\]/) || line.match(/\[Item: (.+?)\]/);
                if (itemMatch && currentTransaction) {
                    currentTransaction.items.push({ item: itemMatch[1], count: itemMatch[2] || 1 });
                }
            } else if (line.startsWith('for [Money:')) {
                const moneyMatch = line.match(/for \[Money:(\d+)\]/);
                if (moneyMatch && currentTransaction) {
                    currentTransaction.money = parseInt(moneyMatch[1], 10);
                }
            } else if (line.startsWith('{Money:')) {
                const moneyDeletedMatch = line.match(/{Money:(.+?), count(\d+)\}/);
                if (moneyDeletedMatch && currentTransaction) {
                    if (!currentTransaction.moneyDeleted) {
                        currentTransaction.moneyDeleted = [];
                    }
                    currentTransaction.moneyDeleted.push({ money: moneyDeletedMatch[1], count: moneyDeletedMatch[2] });
                }
            }
        });
    
        if (currentTransaction) {
            transactions.push(currentTransaction);
        }

        if (transactions.length !== 0) {
            sortedByUserTransactions = groupByUser(transactions);
        }
        

        if (transactions.length === 0) {
            appendLog("0 Transactions Found", 'warning');
            appendLog("Finished parsing LogContent", 'eventEnd');
            console.log("[EVENTEND] Finished parsing LogContent - 0 Transactions found");
            resolve(false);
            return;
        }

        appendLog("Finished parsing LogContent", 'eventEnd');
        console.log("[EVENTEND] Finished parsing LogContent");
        resolve({transactions, sortedByUserTransactions});
        return;
    });
}

function groupByUser(transactions) {
    const grouped = {};

    transactions.forEach(transaction => {
        const user = transaction.nick;
        const steamid64 = transaction.id64;

        // Initialize user stats if not already present
        if (!grouped[user]) {
            grouped[user] = {
                name: user,
                steamId: steamid64,
                totalTransactions: 0,
                totalItemsBought: 0,
                totalItemsSold: 0,
                moneyMadeFromSelling: 0,
                transactions: [] // To keep track of all transactions
            };
        }

        // Increment total transactions
        grouped[user].totalTransactions += 1;

        // Determine if this is a 'GIVE' or 'SELL' transaction
        if (transaction.type === 'GIVE') {
            transaction.items.forEach(item => {
                grouped[user].totalItemsBought += 1;
            });
        } else if (transaction.type === 'SELL') {
            transaction.items.forEach(item => {
                grouped[user].totalItemsSold += 1;
            });
            grouped[user].moneyMadeFromSelling += transaction.money || 0;
        }

        // Add transaction to the user's list
        grouped[user].transactions.push(transaction);
    });

    return grouped;
}