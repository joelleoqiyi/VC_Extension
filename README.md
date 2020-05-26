# VC_Extension
A Google Chrome Extension tool which enables Q&amp;A anytime during a videoconference/webinar.

## Directory: 
### src/client
- src/client/popup.html is the html for the popup at the side when users click the icon
- src/client/popup.js is the js for popup.html, it should be where the speech-to-text, text-to-speech is at? 
- src/client/content.js is the js which will be injected into the current site. (dont think we need this for now)
- src/client/background.js is the js which is working in the background of each site, it should be where the [socket.io](https://socket.io) connection with the server is located? 

### src/server
- src/server/index.js is where the main logic of the server is at 

---

## Dependencies:
Run `npm install` to download the current dependencies (when you see new dependencies added) 
- Socket.io
- Express
- Babel
    * You might need to uninstall and reinstall `babel-cli` and `babel-core` if you experience any errors with babel (especially, if you previously installed it in global)
        * To uninstall babel-cli, `npm uninstall babel-cli -g`
        * To uninstall babel-core, `npm uninstall babel-core -g`
        * To reinstall/install babel-cli, `npm uninstall babel-cli -g`
        * To reinstall/install babel-core, `npm uninstall babel-core -g`
- Parcel 
    * You might need to run `npm install -g parcel` (if you never installed it before) 
