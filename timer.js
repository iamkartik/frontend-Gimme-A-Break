const value = document.querySelector('#value');
console.log('ran');
chrome.runtime.onMessage.addListener((request,sender,sendResponse)=>{
    chrome.alarms.clearAll(function(alarm){});
    chrome.alarms.create("myalarm", {periodInMinutes:request.value});
});

chrome.alarms.onAlarm.addListener(function(alarm){
    showMessage();
});

function showMessage(){
    chrome.notifications.create("remind",{
        type: 'basic',
        title: 'Gimme a Break !!!',
        message: 'Time to take a break !!'
     },function(notificationId) {});
}
