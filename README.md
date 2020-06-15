## VC_Extension
A Google Chrome Extension tool which enables Q&amp;A anytime during a videoconference/webinar.

--- 

## Directory: 
### src/client
- src/client/popup.html is the html for the popup at the side when users click the icon
- src/client/popup.js is the js for popup.html, it should be where the speech-to-text, text-to-speech is at? 
- src/client/content.js is the js which will be injected into the current site. (dont think we need this for now)
- src/client/background.js is the js which is working in the background of each site, it should be where the [socket.io](https://socket.io) connection with the server is located? 

### src/server
- src/server/index.js: main executable (socket.io event listeners)
- src/server/misc/db.js: database functions
- src/server/misc/date.js: date function
- src/server/misc/config.js: access env variables
- src/server/misc/token.js: create roomToken, speakerToken
- src/server/misc/clean.js: maintaining and cleaning database
- src/server/route/createRoom.js: routing for creating new rooms
- src/server/route/authPro.js: routing for authenticating PRO users
- src/server/route/dataPro.js: routing for getting data of PRO users acc
- src/server/route/signUp.js: routing for signing up as a new PRO user
- src/server/CLIENT\_TEST/\*: testing files for client-end (example usage of server events) 

---

## Server-side events:
### /rooms
- `initHandShake`: initial data transfer from server to client(ALL)
- `escalationRequestCleared`: escalation/query has been sent (ALL)
- `escalationRequestSent`: receive escalation/query (SPEAKER ONLY)
- `escalationRequestFailed`: escalation was unsuccessful, check value of `type` in response for reason (ALL) 
- `transcriptUpdateCleared`: update of transcript was successful (SPEAKER ONLY)
- `transcriptUpdateFailed`: updating was unsuccessful, check value of `type` in response for reason (ALL)
- `checkStatusCleared`: user is proStatus = true
- `checkStatusFailed`: user is proStatus = false
- `speakerEnteredCleared`: speaker entered room (ALL)
- `speakerEnteredFailed`: database failed to update speaker's entry (SPEAKER ONLY)
### /auth
- `authProSigninCleared`: authentication for pro users has succeeded, pro user signed in (WEBSITE)
- `authProSigninFailed`: authentication for pro users failed, check value of `type` in response for reason (WEBSITE)
- `authProLogoutCleared`: log out for pro users has succeeded (WEBSITE)
- `authProLogoutFailed`: log out for pro users failed, check value of `type` in response for reason (WEBSITE)
### /create
- `createRoomCleared`: user created room successfully (WEBSITE); if userToken + username + password is incorrect, non-PRO room created (WEBSITE)
- `createRoomFailed`: user room failed to create, check value of `type` in response for reason (WEBSITE)
### /data
- `dataProCleared`: fetching pro data is successful, outputting an array of user's currently active rooms
- `dataProFailed`: fetch of pro data failed, check value of `type` in response for reason (WEBSITE) 
### /register
- `signUpCleared`: user sucessfully create new PRO account (WEBSITE)
- `signUpFailed`: user failed to create new PRO account, check value of `type` in response for reason (WEBSITE)

---

## Dependencies:
Run `npm install` to download the current dependencies (when you see new dependencies added) 
- Socket.io (socket.io-client, socket.io)
- Express
- Babel (babel-polyfill, @babel/polyfill, @babel/cli, @babel/core, @babel/preset-env, babel-core, babel-cli (not confirmed))
    * You might need to uninstall and reinstall `babel-cli` and `babel-core` if you experience any errors with babel (especially, if you previously installed it in global)
        * To uninstall babel-cli, `npm uninstall babel-cli -g`
        * To uninstall babel-core, `npm uninstall babel-core -g`
        * To reinstall/install babel-cli, `npm uninstall babel-cli -g`
        * To reinstall/install babel-core, `npm uninstall babel-core -g`
- body-parser
- cors
- dotenv
- mongodb
- Parcel 
    * You might need to run `npm install -g parcel` (if you never installed it before)

---

## Dev Steps: 
- Run `npm run start` for running the main index.js
- Run `npm run build` to build **ALL** files within the `src` folder
- Run `npm run build_server` to build all server-end files 
- Run `npm run build_client` to build all client-end files
- Run `npm run serve` to build **ALL** files and launch the server at `dist/server/index.js`
- Run `npm run setup_clean` to set up crontab for maintaining database
    * if you have an existing crontab running and don't want to have the chance of overriding it. open up `package.json` and insert `crontab -l > mycron &&` in front of the script for `npm run clean`
- Run `npm run clean` to clean db *once* for rooms which have expired within the past 5 days
- Run `npm run serve_prod` for launching server (for production) :heart_eyes:
