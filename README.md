# VC_Extension
A Google Chrome Extension tool which enables Q&amp;A anytime during a videoconference/webinar.

## TO-DOs:
- [ ] text-to-speech/google's own transcript (hack it or do it the tactiq way)
- [ ] figure out the how to use the npm AI thing 
- [ ] figure out how to use AI to make complete sentences from incomplete sentences
- [ ] popup.html (basically the thing that is shown when the user clicks the icon 
    * - [ ] microphone button 
    * - [ ] some place to display questions (from users to speaker in PRO mode)
    * - [ ] some place to display answers + accuracy score? (to participants, especially when our AI cannot formulate full sentences with the answer from the Q&A bot) 
- [ ] popup.js/background.js (dont really know which one is suitable for these):
    * - [ ] use local storage to store the key (for the Q&A) in the person's localstorage so that each time he opens up dont need to keep entering the key but delete it after a few days 
    * - [ ] use socket.io to establish connection with server (giving the key the first time opened) (means on server side we need to keeptrack userID and key pairing hmm..)
    * - [ ] use speech-to-text to get user's words after he click the microphone button
    * - [ ] if speaker is on PRO then socket.io connection might send in a user's un-answered question (through the same popup.html popup thing) it should be possible to automatically make the extension popout and then display a number on the icon (should not be so hard) to tell the user how many people have un-answered questions  
- [ ] content.js 
    * - [ ] use content.js to inject js into the google meet (**need to discuss** how often to check for new transcripts, etc coz we dont want duplicate transcripts, also need to discuss how often to send the message to the server (or just do it whenever there is a new transcript addition?), also need to check if there are other people talking so like check only if `you` is the username aka only send the transcript which belongs to the speaker) ~~lets ignore that multiple speaker can exist for now lol~~
- [ ] server.js/index.js:
    * - [ ] use socket.io to establish connection 
    * - [ ] use sql/nosql to keep data on: 
        * - [ ] userID - key pairing data (also need to leave a slot/column for the speaker UserID)
        * - [ ] script of speaker (if any) + additional script from the scamming of google meet's transcript, etc (do we keep in a seperate column or same column)
        * - [ ] data model??? not really sure 
    * - [ ] use npm AI thing to train the model whenever a new request from the speaker connection comes in with new data on the transcript 
    * some random notes: 
        * whenever a new connection comes in check if userID is participant or speaker.
            * if speaker check for input type or something: (either extra transcript or just a normal request?)
            * if participant check for normal request 
                * then check for speaker if speaker is using PRO, if yes then send the un-answerable question to the speaker through socket.io (double connection power UWU) 
  
--- 

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

---

## Dev Steps: 
- Run `npm run build` to build **ALL** files within the `src` folder
- Run `npm run build_server` to build all server-end files 
- Run `npm run build_client` to build all client-end files
- Run `npm run serve` to **ALL** files and launch the server at `dist/server/index.js`
