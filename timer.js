// listen for the time being sent from main form
chrome.runtime.onMessage.addListener((request,sender,sendResponse)=>{
    // clear all previous alarms
    chrome.alarms.clearAll(function(alarm){});
    // create a new alarm with the requested time 
    chrome.alarms.create('myalarm', {periodInMinutes:request.value});
    // get the final time of the created alarm in milliseconds
    chrome.alarms.get('myalarm',(alarm)=>{
        const finalTime=alarm.scheduledTime;
        // pass it back to the sender to display timer
        sendResponse({finalTime:finalTime});
    });    
    // returning true to let the sender know this function will run async
    // ue once the alarm is set it'll run after that
    return true; 
});

// on any alarm catch the event
chrome.alarms.onAlarm.addListener(function(alarm){
    showMessage();
});

// show the desired message
function showMessage(){
    chrome.notifications.create('remind',{
        type: 'basic',
        iconUrl: 'icon_128.png',
        title: 'Gimme a Break !!!',
        message: 'Time to take a break !!'
     },function(notificationId) {});
     // clear the alarms
    chrome.alarms.clearAll(function(alarm){});
    chrome.storage.sync.remove(['finalTime'],(items)=>{});
}

// ading the onclick to change the popup html
chrome.browserAction.onClicked.addListener(()=>{
    const alarmSet = chrome.alarms.get('myalarm',()=>{});
    console.log("hello");
   /* if(alarmSet){
        chrome.browserAction.setPopup({popup:'timer.html'});
    }else{
        chrome.browserAction.setPopup({popup:'index.html'})
    }*/
});
