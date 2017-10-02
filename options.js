const form = document.querySelector('#optionsForm');
const messageList = document.querySelector('.messageList');

window.addEventListener('load',()=>{
  
    chrome.storage.sync.get(['messages'],(item)=>{
        if(item.messages){
            console.log(messages);
            messageList.innerHTML = getMessageDom(item.messages);
            
        }
    })
});


function getMessageDom(messages){
    const messageList = messages.split(';');
    messageList.map((message)=>{
        return `<span>${message}</span><span>X</span>`;
    }).join('');
    return messageList;
}



form.addEventListener('submit',function(e){
    e.preventDefault();
    // get the messages and add them to the messages in storage
    chrome.storage.sync.set({messages:this.messages.value},()=>{});
});