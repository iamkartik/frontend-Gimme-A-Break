const form = document.querySelector('#optionsForm');

window.addEventListener('load',()=>{
    console.log('hello');
    chrome.storage.sync.get(['messages'],(item)=>{
        if(item.messages){
            form.messages.value=item.messages;
        }
    })
});


form.addEventListener('submit',function(e){
    e.preventDefault();
    // get the messages and add them to the messages in storage
    chrome.storage.sync.set({messages:this.messages.value},()=>{});
});