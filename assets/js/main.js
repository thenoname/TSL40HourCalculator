"use strict";

document.addEventListener('DOMContentLoaded', function(){
    // Hide the form
    document.getElementById('infoForm').setAttribute('hidden','');
    let checkbox = document.getElementById('understandCheckbox');
    checkbox.addEventListener('change', e => {
        if(e.target.checked){
            document.getElementById('infoForm').removeAttribute('hidden');
        }else{        
            document.getElementById('infoForm').setAttribute('hidden','');
        }
    });
    
    let addRowButton = document.getElementById('addRowButton');
    addRowButton.addEventListener('click', onAddRowClicked);
    
    // Set start date and end date min/max
    document.getElementById('startDate').setAttribute('min','2021-11-01');    
    document.getElementById('endDate').setAttribute('min','2021-11-01');
   
});

// Explicit Globals
var nov2021Rate = 0;
var nov2022Rate = 0;
var nov2023Rate = 0;
var nov2021Str = '2021-11-01';
var nov2022Str = '2022-11-01';
var nov2023Str = '2023-11-01';
var nov2021Date = new Date(nov2021Str);
var nov2022Date = new Date(nov2022Str);
var nov2023Date = new Date(nov2023Str);
var nov2021Time = nov2021Date.getTime()/1000;
var nov2022Time = nov2022Date.getTime()/1000;
var nov2023Time = nov2023Date.getTime()/1000;
var nov2021RateFound = false;
var minimum = 0;
var startDate = '';
var endDate = '';
var startTime = 0;
var endTime = 0;
var hourlyRate = 0;
var category = 0;
var categoryObj = '';
var hoursWorked = 0;
function onAddRowClicked() {
    if(checkInput()){
        // Case 1 - Entire entered time is before 11/1/2022
        if (startTime >= nov2021Time && startTime < nov2022Time && endTime >= nov2021Time && endTime < nov2022Time){            
            storeInTable(startDate, endDate, hourlyRate, minimum, category, hoursWorked);
        }else if(startTime >= nov2022Time){ //Case 2 - Entire entered time is after 11/1/2022
            calculateTransitionRates(hourlyRate);
            storeInTable(startDate, endDate, hourlyRate, nov2022Rate, category, hoursWorked);
        }else if(startTime >= nov2021Time && startTime < nov2022Time && endTime >= nov2022Time){ //Case 3 - Part of entered time is after 11/1/2022
            calculateTransitionRates(hourlyRate);
            // Write a row for the pre transition to 42
            storeInTable(startDate, nov2022Str, hourlyRate, minimum, category, hoursWorked);
            // Write a row for the post transition to 42
            storeInTable(nov2022Str, endDate, hourlyRate, nov2022Rate, category, hoursWorked);
        }
    }
}

function calculateTransitionRates(hourlyRate){
    if(hourlyRate>minimum){
        nov2021Rate = hourlyRate; //GLOBAL
    }else{
        nov2021Rate = minimum; //GLOBAL
    }
    nov2022Rate = nov2021Rate*1.1047; //GLOBAL
    nov2023Rate = nov2022Rate*1.075; //GLOBAL

    nov2022Rate = parseFloat(nov2022Rate.toFixed(2)); //GLOBAL
    nov2023Rate = parseFloat(nov2023Rate.toFixed(2)); //GLOBAL

    document.getElementById('rate2021').value = nov2021Rate;
    document.getElementById('rate2022').value = nov2022Rate;
    document.getElementById('rate2023').value = nov2023Rate;
}

function checkInput() {
    hourlyRate = parseFloat(document.getElementById('hourlyRate').value);//GLOBAL
    categoryObj = document.getElementById('category');//GLOBAL
    category = categoryObj.value;//GLOBAL
    hoursWorked = parseFloat(document.getElementById('hoursWorked').value);//GLOBAL
    startDate = document.getElementById('startDate').value;//GLOBAL
    endDate = document.getElementById('endDate').value;//GLOBAL
    
    if(hourlyRate==""||category=="0"||hoursWorked==""||isNaN(hoursWorked)||startDate==""||endDate==""){
        return false;
    }    
    // Refresh global variables if needed
    minimum = getMinimum(category); //GLOBAL
    startTime = new Date(startDate).getTime()/1000; //GLOBAL
    endTime = new Date(endDate).getTime()/1000; //GLOBAL
    if(startTime < nov2021Time || endTime < nov2021Time){
        alert("Dates must be after Nov 1, 2021");
        return false;
    }
    return true;
}

function storeInTable(startDate, endDate, hourlyRatePaid, hourlyRateOwed, category, hoursWorked) {
    // Do calculations    
    calculateTransitionRates();
    var numWeeks = getWeeks(startDate, endDate);
    var backpay = calcBackPay(numWeeks, hourlyRatePaid, hourlyRateOwed, hoursWorked);

    // Get fields and add row
    var table = document.getElementById("payTable");
    var numRows = table.rows.length;
    var row = table.insertRow(numRows);
    var row_startDate = row.insertCell(0);
    var row_endDate = row.insertCell(1);
    var row_hourlyRatePaid = row.insertCell(2);
    var row_hourlyRateOwed = row.insertCell(3);
    var row_category = row.insertCell(4);
    var row_hoursWorked = row.insertCell(5);
    var row_minimum = row.insertCell(6);
    var row_backPay = row.insertCell(7);
    
    row_startDate.innerHTML = startDate;
    row_endDate.innerHTML = endDate;
    row_category.innerHTML = categoryObj.options[parseInt(category)].text;
    row_hoursWorked.innerHTML = hoursWorked;
    row_minimum.innerHTML = minimum;
    row_backPay.innerHTML = backpay
    row_hourlyRatePaid.innerHTML = hourlyRatePaid; 
    row_hourlyRateOwed.innerHTML = hourlyRateOwed; 
}

function getWeeks(date1, date2){
    date1 = new Date(date1);
    date2 = new Date(date2);    
    var diffTime = (date2.getTime() - date1.getTime()) / 1000;
    // Make sure that the second date is after the first date
    if(diffTime < 0){
        diffTime = diffTime * -1;
    }
    diffTime = diffTime  / (60 * 60 * 24 * 7);
    
    // Check if we can get what Nov 2021 was
    getNov2021Rate(date1, date2);
    
    return diffTime;
}

function getNov2021Rate(date1, date2){
    var date1Time = date1.getTime()/1000;
    var date2Time = date2.getTime()/1000;
    if(nov2021Time >= date1Time && nov2021Time <= date2Time){
        if(hourlyRate<minimum){
            nov2021Rate = minimum; //GLOBAL
        }else{            
            nov2021Rate = hourlyRate; //GLOBAL
        }
        nov2021RateFound = true; //GLOBAL
    }    
}

function getMinimum(category) {
    var minimum = 0;
    switch (category){
        case "1":
            minimum = 53.15;
            break;
        case "2":
            minimum = 45.48;
            break;
        case "3":
            minimum = 49.30;
            break;
        case "4":
            minimum = 38.63;
            break;
        case "5":
            minimum = 29.00;
            break;
        case "6":
            minimum = 32.38;
            break;
        case "7":
            minimum = 35.78;
            break;
        case "8":
            minimum = 34.40;
            break;
        case "9":
            minimum = 36.06;
            break;
        case "10":
            minimum = 37.73;
            break;
    }
    return minimum;
}

function calcBackPay(weeks, hourlyRatePaid, hourlyRateOwed, hoursWorked) {
    // If making more than owed, no back pay
    if(hourlyRatePaid>hourlyRateOwed){
        return 0;
    }
    var straightTime = hoursWorked;
    var overTime = 0;
    if(hoursWorked>40){
        straightTime = 40;
        overTime = hoursWorked - 40;
    }
    var hourlyDiff = hourlyRateOwed - hourlyRatePaid;
    var weeklyDiff = hourlyDiff*straightTime + hourlyDiff*overTime*1.5;
    var backpay = weeklyDiff*weeks;
    backpay = parseFloat(backpay.toFixed(2));

    return backpay;
    
}