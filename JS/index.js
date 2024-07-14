"use strict";
const dbPath = '../Database/transactionDB.json';
let sortType = 'default';
let sortAs = 'default';

jQuery(document).ready(async function () {
    let data = await readData();
    displayData(data, sortType, sortAs);

    const search = jQuery('#search');
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
        displayData(data, sortType, sortAs);
    })
    search.on('input', function () {
        console.log("Search Input");
    })
})

async function readData() {
    try {
        let rawData = await fetch(dbPath);
        let data = await rawData.json();
        return data;
    }
    catch {
        window.alert('Error Connecting to Database');
    }
}

function displayData(incomingData, sortType, sortAs) {
    let data = incomingData;
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
        table.append(`
            <tr class="w-100 bg-lightest-blue text-white border-bottom border-dark-green">
                <td class="text-center py-3">${index + 1}</td>
                <td class="text-center py-3">${getCustomerName(data.transactions[index].customer_id, data)}</td>
                <td class="text-center py-3">${data.transactions[index].customer_id}</td>
                <td class="text-center py-3">${data.transactions[index].date}</td>
                <td class="text-center py-3">${data.transactions[index].amount}</td>
                <td class="text-center py-3">${data.transactions[index].id}</td>
            </tr>`);
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