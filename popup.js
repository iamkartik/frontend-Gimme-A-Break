const inputs = [...document.querySelectorAll('input[type="radio"]')];
const start = document.querySelector('#start');
const custom = document.querySelector('#custom');
const form = document.querySelector('#timeForm');
const error = document.querySelector('.error');
const timer = document.querySelector('.timer');
const clear = document.querySelector('#clear');

function uncheck(){
    inputs.forEach(input=>input.checked=false);
}

// unckheck the radio buttons in case custom time is focussed
custom.addEventListener('focus',()=>{
    uncheck();
});
// perform sanity checks to find the ala
start.addEventListener('click',(e)=>{
    e.preventDefault();
    let time;
    // check if custom form is filled, else find the checked radio button
    if(form.custom.value){
        time = form.custom;
    }else{
        time=inputs.find(input=>input.checked);
    }
    // if there is checked radio/custom time
    if(time){
        // parse time to get the value in int
        const timeInMin = parseInt(time.value);
        // if parse successful
        if(timeInMin){
            // check if the time in custom is valid , less than a day 
            if(timeInMin>0&&timeInMin<=1440){
                chrome.runtime.sendMessage({value: timeInMin});
                form.style.display='none';
                timer.innerHTML = `<span>${timeInMin}</span>`;
            }else{
               error.innerHTML='Alarm time cannot be less than 0 or more than a day (1400).';
            }            
        }else{
            // custom time cannot be alphabet
           error.innerHTML='The time should be a number.';
        }
    }else{
        // error out to provide a time
       error.innerHTML='Please select a time intrval or add a custom time period.';
    }
});

clear.addEventListener('click',()=>chrome.alarms.clearAll(function(alarm){}));