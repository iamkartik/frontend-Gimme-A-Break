// the radio inputs 
const inputs = [...document.querySelectorAll('input[type="radio"]')];
// the start timer button
const start = document.querySelector('#start');
// the custom time input
const custom = document.querySelector('#custom');
// the entire time setting form
const form = document.querySelector('#timeForm');
// error div in case sanity check fails
const error = document.querySelector('.error');
// timer div to display countdown and the reset button
const timer = document.querySelector('.timer');
// the span to show actual countdown
const timerDisplay = document.querySelector('#time');
// to reset all the alarms
const clear = document.querySelector('#clear');
// to open the settings
const options = document.querySelector('.settings button');
// toggle repeat checkbox
const repeat = document.querySelector('.switch input');
// break input only shown if user wants to repeat a break and uses repeat toggle
const breakTime = document.querySelector('.break');
// countdown button to set the setInterval for displaying countdown
let countdown;

// uncheck all the radio buttons
function uncheck(){
    inputs.forEach(input=>input.checked=false);
}

// unckheck the radio buttons in case custom time is focussed
custom.addEventListener('focus',()=>{
    uncheck();
});

// reset the custom input in case a radio button is selected 
// earlier the custom value was always taken even in case the radio was checked after custom input
inputs.forEach(input => input.addEventListener('click',()=>{
    custom.value = null;
}));

// perform sanity checks to set the alarm
start.addEventListener('click',(e)=>{
    e.preventDefault();

    let time;
    // if an error was displayed previously remove it
    error.innerHTML='';
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
                    chrome.storage.sync.set({finalTime:response.finalTime},()=>{});
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

// button to reset/clear the alarms
clear.addEventListener('click',()=>{
    // remove the timer if it is displayed
    timer.style.display = 'none';
    // clear alarms from chrome
    chrome.alarms.clearAll(function(alarm){});
    // remove final time from storage
    chrome.storage.sync.remove(['finalTime'],(items)=>{});
    // clear the countdown interval that displays time remaining
    clearInterval(countdown);
    // display the form to enable setting the alarm again
    form.style.display = 'block';
});

// calculate the remaining time to display
function calculateTime(finalTime){
    // removing the form , only timer showing remaining time needs to be displayed
    form.style.display = 'none';
    // display the timer
    timer.style.display = 'block';
    // the interval is cleared everytime a new alarm is set
    clearInterval(countdown);
    // display the final time, as the interval will start after 1sec
    // to avoid a blank screen and then timer showing 00:59 after a sec (in case timer set for a min)
    displayTime(Math.round((finalTime - Date.now())/1000));
    // setting the interval to run after every 1 sec
    countdown = setInterval(()=>{
        // secondsLeft by subtracting final time from current time , taking the round 
        const secondsLeft = Math.round((finalTime - Date.now())/1000);
        // if seconds left is less than 0 then stop and clear interval
        if(secondsLeft<0){
            // clear the interval
            clearInterval(countdown);
            // display form again and hide the timer 
            form.style.display = 'block';
            timer.style.display = 'none';
            // return to stop execution
            return;
        }
        //else display the time
        displayTime(secondsLeft);
    },1000);
}

// this function displays the remaining time in mm:ss 
function displayTime(seconds){
    // calculate the minutes
    const minutes = Math.floor(seconds/60);
    // calculate remaining sef
    const sec = seconds % 60; 
    // final time string. Comparison is made to display an extra zero if time is less than 10 sec
    // 1:09 instead of 1:9
    const time = `${minutes}:${sec<10?'0':''}${sec}`;
    // set the time in display
    timerDisplay.innerHTML = time;
}

// on every load check whether to show the countdown or form 
window.addEventListener('load',()=>{
    // check if final time is set in the storage
    // if stored that means there is already an alram set
    // shoe the countdown
    chrome.storage.sync.get(['finalTime'],(time)=>{
        if(time.finalTime){
            // remove the form from display
            form.style.display = 'none';
            // show the timer 
            timer.style.display = 'block';
            // start calculating countdown from final time
            calculateTime(time.finalTime);
        }else{
            // show the form and hide the timer
            form.style.display = 'block';
            timer.style.display = 'none';
        }
    });
});

// to open the settings page
options.addEventListener('click',()=>{
    // if chrome supports openOptionsPage then use it otherwise use redirect
    if(chrome.runtime.openOptionsPage){
        chrome.runtime.openOptionsPage();
    }else{
        window.open(chrome.runtime.getUrl('options.html'));
    }
});

chrome.alarms.onAlarm.addListener((alarm)=>{
    console.log(alarm);
    /*chrome.runtime.sendMessage({value: 1},function(response){
                    calculateTime(response.finalTime);
                    chrome.storage.sync.set({finalTime:response.finalTime},()=>{});
    });*/
});

repeat.addEventListener('click',function(){
    const toggleBreak = this.checked?'inline-flex':'none';
    breakTime.style.display = toggleBreak;
});