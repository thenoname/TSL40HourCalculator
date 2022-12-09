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
    
    let submitButton = document.getElementById('submitButton');
    submitButton.addEventListener('click', calcPay)
   
});

function calcPay() {
    currHourlyPay = document.getElementById('currHourlyPay').value;
    category = document.getElementById('category').value;
    hoursTypicallyWorked = document.getElementById('hoursTypicallyWorked').value;
    weeks2021 = document.getElementById('weeksLastYear').value;
    weeks2022 = document.getElementById('weeksThisYear').value;
    
    if(currHourlyPay==""||category=="0"||hoursTypicallyWorked==""||weeksLastYear==""||weeksThisYear==""){
        return;
    }
    currHourlyPay = parseFloat(currHourlyPay);
    hoursTypicallyWorked = parseFloat(hoursTypicallyWorked);
    weeks2021 = parseFloat(weeks2021);
    weeks2022 = parseFloat(weeks2022);
    
    rate2021 = 0;
    switch (category){
        case "1":
            rate2021 = 53.15;
            break;
        case "2":
            rate2021 = 45.48;
            break;
        case "3":
            rate2021 = 49.30;
            break;
        case "4":
            rate2021 = 38.63;
            break;
        case "5":
            rate2021 = 29.00;
            break;
        case "6":
            rate2021 = 32.38;
            break;
        case "7":
            rate2021 = 35.78;
            break;
        case "8":
            rate2021 = 34.40;
            break;
        case "9":
            rate2021 = 36.06;
            break;
        case "10":
            rate2021 = 37.73;
            break;
    }
    
    if(rate2021>=currHourlyPay){
        currHourlyPay=rate2021;
    }else{
        rate2021=currHourlyPay;
    }
            
    rate2022 = rate2021*1.1047;
    rate2023 = rate2022*1.075;
    
    rate2022 = parseFloat(rate2022.toFixed(2));
    rate2023 = parseFloat(rate2023.toFixed(2));
    
    straightTime = 0;
    overTime = 0;
    if(hoursTypicallyWorked>=40){
        straightTime = 40;
        overTime = hoursTypicallyWorked - 40;
    }else{
        straightTime = hoursTypicallyWorked;
        overTime = 0;
    }
    
    backPay2021 = ((rate2021-currHourlyPay)*straightTime + (rate2021-currHourlyPay)*overTime*1.5)*weeks2021;
    backPay2022 = ((rate2022-currHourlyPay)*straightTime + (rate2022-currHourlyPay)*overTime*1.5)*weeks2022;
    
    backPay2021 = backPay2021.toFixed(2);
    backPay2022 = backPay2022.toFixed(2);
    
    document.getElementById('rate2021').value = rate2021;
    document.getElementById('rate2022').value = rate2022;
    document.getElementById('rate2023').value = rate2023;
    document.getElementById('backpay2021').value = backPay2021;
    document.getElementById('backpay2022').value = backPay2022;
    
}