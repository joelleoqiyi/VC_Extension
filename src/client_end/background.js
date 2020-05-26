// a javascript file that works in the BACKGROUND wow!


chrome.runtime.onMessage.addListener(function (req, sender, sendRes) {
    //request is the parameter to access the payload from content.js 

})

chrome.browserAction.onClicked.addListener(function (tab) {
    chrome.tabs.create({url: 'popup.html'}) // to open up in a new tab the filename called popup.html or some other file. 
    // though on second thoughts, we probably would not want this to happen? try keeping it in the tiny popup box aka in popup.html
}) 
