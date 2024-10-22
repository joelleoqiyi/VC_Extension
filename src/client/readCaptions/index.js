let capturedValues = "";
let prevUpdate = "";
function readCaptions() {
    if (String(document.getElementsByClassName("a4cQT")[0].attributes[0].value) === "LM3KPc"){
        let wrapperAncestorClass = document.getElementsByClassName("a4cQT")[0];
        let wrapperParentClass;
        if (wrapperAncestorClass.children){
            wrapperParentClass = wrapperAncestorClass.children;
        } else {
            return;
        }
        for (wrapperClass of wrapperParentClass){
            if (wrapperClass.getAttribute("class") === "TBMuR"){
                if (wrapperClass.children){
                    if (wrapperClass.children[1].getAttribute("class") === "zs7s8d" && wrapperClass.children[1].innerHTML === "You"){
                        if (wrapperClass.children[2].getAttribute("class") === "Mz6pEf"){
                            if (wrapperClass.children[2].children[0].getAttribute("class") === "iTTPOb"){
                                let transcriptMessages = wrapperClass.children[2].children[0].children;
                                for (var currMessageCount=transcriptMessages.length-1; currMessageCount>=0;currMessageCount--){
                                    let transcriptMessage = String(transcriptMessages[currMessageCount].children[0].innerText);
                                    if (transcriptMessage !== prevUpdate){
                                        let repeatedMessage = transcriptMessage.search(prevUpdate);
                                        if (prevUpdate === ""){
                                            capturedValues = capturedValues.concat(String(transcriptMessage)+" ");
                                        } else if (repeatedMessage !== -1){
                                            capturedValues = capturedValues.concat(String(transcriptMessage).substr(repeatedMessage+prevUpdate.length+1)+" ");
                                        } else {
                                            capturedValues = capturedValues.concat(String(transcriptMessage)+" ");
                                        }
                                        prevUpdate = String(transcriptMessage);
                                        return (true);
                                    } else {
                                        return (false);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

let targetNode = document.getElementsByClassName("a4cQT")[0];
const config = { attributes: true, childList: true, subtree: true };
const callback = function(mutationsList, observer) {
    for(let mutation of mutationsList) {
        if (mutation.type === 'childList') {
            readCaptions(); 
        }
    }
};

// Create an observer instance linked to the callback function
const observer = new MutationObserver(callback);

// Start observing the target node for configured mutations and send it back to background.js every 10 seconds.
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if( request.message === "start") {
        observer.observe(targetNode, config);
        setInterval(function(){     
            chrome.runtime.sendMessage({"newTranscript": capturedValues});
        }, 10000);
     }
   }
);

