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
- Socket.io
- Express 
