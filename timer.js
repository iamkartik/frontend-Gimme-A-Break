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
    chrome.storage.sync.get(['break','duration','breakTime'],(time)=>{
        if(time.break){
            // calculate the break dration in milliseconds
            // min *60 = sec *1000 = millisec
            const breakDuration = time.breakTime * 60 * 1000;
            // run the break timer before setting another alarm 
            setTimeout(()=>{
                // bug fix : during break if reset is clicked this alarm is set irrespective after the timeout
                // reset is clearing the storage so checking again to confirm before setting the alarm
                        chrome.storage.sync.get(['isBreak'],(alarm)=>{
                            if(alarm.isBreak){
                                chrome.alarms.create('myalarm', {periodInMinutes:time.duration});
                                
                                chrome.alarms.get('myalarm',(alarm)=>{
                                const finalTime=alarm.scheduledTime;
                                chrome.storage.sync.set({isBreak:false,finalTime:finalTime},()=>{});
                                });
                            }
                        });                              
            },breakDuration);
            // run the break timer 
            // set up break message
            //message.style.display = 'block';
            const breakFinalTime = Date.now() + breakDuration;
            chrome.storage.sync.set({isBreak:true,breakFinalTime:breakFinalTime},()=>{});
            }
    });    
});


// show the desired message
function showMessage(){
    let messages=["Time to go on a break",
              "It's coffee time",
              "Get up and stretch out !!",
              "Look to your left and right , now blink twice",
              "Go grab a bite !"];
    chrome.storage.sync.get(['messages'],(item)=>{
        if(item.messages){
            messages=item.messages.split(';');
        }
    });

    chrome.notifications.create('remind',{
        type: 'basic',
        iconUrl: 'icon_128.png',
        title: 'Gimme a Break !!!',
        message: messages[Math.floor((Math.random() * (messages.length - 0 +1)) + 0)]
     },function(notificationId) {});
     // clear the alarms 
    chrome.alarms.clearAll(function(alarm){});
    // remove finalTime field from the storage
    chrome.storage.sync.remove(['finalTime'],(items)=>{});
    
}


