const inputs = [...document.querySelectorAll('input[type="radio"]')];
const start = document.querySelector('#start');
const custom = document.querySelector('#custom');
const form = document.querySelector('#timeForm');
const error = document.querySelector('.error');
const timer = document.querySelector('.timer');
const clear = document.querySelector('#clear');
let countdown;
let displayTimer = false;

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
                // send the message to background to set an alarm
                // getting the final time in response
                chrome.runtime.sendMessage({value: timeInMin},function(response){
                    calculateTime(response.finalTime);
                    //chrome.browserAction.setPopup({popup:'timer.html'});
                });
                
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
// button to clear the alarms
clear.addEventListener('click',()=>{
    chrome.alarms.clearAll(function(alarm){});
    clearInterval(countdown);
});

// calculate the remaining time to display
function calculateTime(finalTime){
    // removing the form
    form.style.display = 'none';
    displayTimer = true;
    // the interval is cleared everytime a new alarm is set
    clearInterval(countdown);
    // setting the interval to run after every 1 sec
    countdown = setInterval(()=>{
        // secondsLeft by subtracting final time from current time , taking the round 
        const secondsLeft = Math.round((finalTime - Date.now())/1000);
        // if seconds left is less than 0 then stop and clear interval
        if(secondsLeft<0){
            clearInterval(countdown);
            displayTimer = false;
            return;
        }
        //else display the time
        displayTime(secondsLeft);
    },1000);
}

function displayTime(seconds){
    const minutes = Math.floor(seconds/60);
    const sec = seconds % 60; 
    const time = `${minutes}:${sec}`;
    timer.innerHTML = time;
}

window.addEventListener('load',()=>{
    console.log('hello');
});