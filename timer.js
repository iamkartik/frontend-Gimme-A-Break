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

// on any alarm catch the event and display a custom or predefined message
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
    // remove finalTime field from the storage
    chrome.storage.sync.remove(['finalTime'],(items)=>{});
    /* chrome.alarms.get('myalarm',(alarm)=>{
        const finalTime=alarm.scheduledTime;
        chrome.storage.sync.set({finalTime:finalTime},()=>{});
     });*/
}


