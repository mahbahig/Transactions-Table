"use strict"
const dbPath = '../Database/transactionDB.json'
jQuery(document).ready(function () { 

    const search = jQuery('#search');
    search.on('input', function () {
        console.log("Search Input");
    })
})

async function readData() {
    try {
        let rawData = await fetch(dbPath);
        let data = await rawData.json();
        console.log(data.customers[0].id);
    }
    catch {
        window.alert('Error Connecting to Database');
    }
}

readData();