"use strict"
const dbPath = '../Database/transactionDB.json'
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
        console.log('Connection to database sucessfull');
        return data
    }
    catch {
        window.alert('Error Connecting to Database');
    }
}

function displayData(data, sortType, sortAs) {
    const table = jQuery('#transactionTable');
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

    }
}

function getCustomerName(customerId, data) {
    for (let index = 0; index < data.customers.length; index++) {
        if (data.customers[index].id == customerId) {
            return data.customers[index].name;
        }
    }
}