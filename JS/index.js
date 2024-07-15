"use strict";
// const dbPath = 'http://192.168.56.1:8080/transactionDB.json';
const dbPath = 'Database/transactionDB.json';
const customerChart = jQuery('#customerChart');
let sortType = 'default';
let sortAs = 'default';
let user = 'default';
let search = '';

jQuery(document).ready(async function () {
    let data = await readData();
    displayData(data, sortType, sortAs);

    const showChart = jQuery('#showChart');
    const searchInput = jQuery('#search');
    const sortTypeSelect = jQuery('#sortType');
    const sortAsSelect = jQuery('#sortAs');
    const sort = jQuery('#sort');

    sortTypeSelect.on('change', function () {
        sortType = sortTypeSelect.val();
    })
    sortAsSelect.on('change', function () {
        sortAs = sortAsSelect.val();
    })
    sort.on('click', function () {
        displayData(data, sortType, sortAs, searchInput.val());
    })
    searchInput.on('input', function () {
        displayData(data, sortType, sortAs, searchInput.val());
    })
    customerChart.on('change', function () {
        user = customerChart.val();
    })
    showChart.on('click', function () {
        showChartData(data, user);
    })
});

async function readData() {
    try {
        let rawData = await fetch(dbPath);
        let data = await rawData.json();
        return data;
    }
    catch {
        window.alert('Error Connecting to Database');
    };
};

function displayData(incomingData, sortType, sortAs, search) {
    let data = incomingData;
    let counter = 1;
    addSelect(data.customers);
    const table = jQuery('#transactionTable');
    table.empty();
    table.append(`
        <thead class="bg-light-blue text-white w-100">
            <th class="text-center"></th>
            <th class="text-center">Customer Name</th>
            <th class="text-center">Customer ID</th>
            <th class="text-center">Transaction Date</th>
            <th class="text-center">Transaction Amount in USD</th>
            <th class="text-center">Transaction ID</th>
        </thead>`);

    if (sortType === 'name') {
        data.customers.sort((a, b) => a.name.localeCompare(b.name));
        let customerMap = {};
        data.customers.forEach(customer => {
            customerMap[customer.id] = customer.name;
        });
        data.transactions.sort((a, b) => customerMap[a.customer_id].localeCompare(customerMap[b.customer_id]));
        if (sortAs === 'descending') {
            data.transactions.reverse();
        };
    }
    else if (sortType === 'amount') {
        data.transactions.sort((a, b) => a.amount - b.amount);
        if (sortAs === 'descending') {
            data.transactions.reverse();
        };
    };

    for (let index = 0; index < data.transactions.length; index++) {
        if (search == null || search == '') {
            table.append(`
            <tr class="w-100 bg-lightest-blue text-white border-bottom border-dark-green">
                <td class="text-center py-3">${index + 1}</td>
                <td class="text-center py-3">${getCustomerName(data.transactions[index].customer_id, data)}</td>
                <td class="text-center py-3">${data.transactions[index].customer_id}</td>
                <td class="text-center py-3">${data.transactions[index].date}</td>
                <td class="text-center py-3">${data.transactions[index].amount}</td>
                <td class="text-center py-3">${data.transactions[index].id}</td>
            </tr>`);
        }
        else if (!(search == null || search == '')) {
            if ((getCustomerName(data.transactions[index].customer_id, data).toLowerCase().includes(search.toLowerCase())) || (search == data.transactions[index].customer_id)) {
                table.append(`
                <tr class="w-100 bg-lightest-blue text-white border-bottom border-dark-green">
                    <td class="text-center py-3">${counter}</td>
                    <td class="text-center py-3">${getCustomerName(data.transactions[index].customer_id, data)}</td>
                    <td class="text-center py-3">${data.transactions[index].customer_id}</td>
                    <td class="text-center py-3">${data.transactions[index].date}</td>
                    <td class="text-center py-3">${data.transactions[index].amount}</td>
                    <td class="text-center py-3">${data.transactions[index].id}</td>
                </tr>`);
                counter++;
            };
        };
    };
};

function getCustomerName(customerId, data) {
    for (let index = 0; index < data.customers.length; index++) {
        if (data.customers[index].id == customerId) {
            return data.customers[index].name;
        };
    };
};

function getCustomerId(customerName, data) {
    for (let index = 0; index < data.customers.length; index++) {
        if (data.customers[index].name == customerName) {
            return data.customers[index].id;
        };
    };
};

function addSelect(customers) {
    customers.forEach(customer => {
        customerChart.append(`<option value="${customer.name}" class="bg-light-green">${customer.name}</option>`)
    });
}

function showChartData(data, user) {
    if (user !== 'default') {
        let chartContainer = jQuery('#chartContainer');
        let money = [];
        let aggregatedTransactions = {};

        data.customers.forEach(customer => {
            if (customer.name == user) {
                data.transactions.forEach(transaction => {
                    if (transaction.customer_id == customer.id) {
                        if (!aggregatedTransactions[transaction.date]) {
                            aggregatedTransactions[transaction.date] = {
                                id: transaction.id,
                                amount: transaction.amount,
                                date: transaction.date
                            };
                        } else {
                            aggregatedTransactions[transaction.date].amount += transaction.amount;
                        }
                    };
                });
            };
        });

        for (let date in aggregatedTransactions) {
            if (aggregatedTransactions.hasOwnProperty(date)) {
                money.push(aggregatedTransactions[date]);
            }
        }

        money.sort((a, b) => new Date(a.date) - new Date(b.date));

        let labels = money.map(entry => entry.date);
        let amounts = money.map(entry => entry.amount);

        chartContainer.empty();
        chartContainer.append(`<canvas class="w-75 bg-white" id="transactionChart" height="200"></canvas>`);

        const ctx = document.getElementById('transactionChart').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Amount',
                    data: amounts,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderWidth: 1
                }]
            },
            options: { scales: { y: { beginAtZero: true} } }
        });
    }
}

