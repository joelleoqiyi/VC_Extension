## VC_Extension
A Google Chrome Extension tool which enables Q&amp;A anytime during a videoconference/webinar.

--- 

## Directory: 
### src/client 
- src/client/CLIENT\_TEST/\*: testing files for extension
- src/client/extension/\*: second final draft of extension 
- src/client/JS SST/\*: for the speech-to-text, text-to-speech features of the extension
- src/client/readCaptions/\*: source files to be injected into Google Meet by the extension

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

## Dev Steps/Scripts:
- Run `npm install` to install all the dependencies/Devdependencies
- Run `npm run start` for running the main index.js
- Run `npm run build` to build **ALL** files within the `src` folder
- Run `npm run build_server` to build all server-end files 
- Run `npm run build_client` to build all client-end files
- Run `npm run serve` to build **ALL** files and launch the server at `dist/server/index.js`
- Run `npm run setup_clean` to set up crontab for maintaining database
    * if you have an existing crontab running and don't want to have the chance of overriding it. open up `package.json` and insert `crontab -l > mycron &&` in front of the script for `npm run clean`
- Run `npm run clean` to clean db *once* for rooms which have expired within the past 5 days
- Run `npm run serve_prod` for launching server (for production) :heart_eyes:
