//importing neccessary functions from supporting files
import {queryDocument, newDocument} from '../misc/db'
import {generateToken} from '../misc/token'
import {getCurrDate} from '../misc/date'
import {room} from '../misc/config'

//declaring variables, npm packages
var express = require('express')
var createRoom = express.Router()
var cors = require('cors')

//setting up CORS settings
var whitelist = ['http://localhost:1234', 'http://example2.com']
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}

//methods with CORS-enabled for whitelisted-domains
createRoom.use(function timeLog (req, res, next) {
  console.log(`\(NEW\) createRoomRequest @ Time: ${getCurrDate(0)}`)
  next()
})

createRoom.post('/', cors(corsOptions), function (req, res) {
  let transcript = req.body.transcript || "";
  let proStatus = (req.body.proStatus === "true") ? true : false;
  (async ()=>{
    let speakerToken = String(generateToken(7));
    let roomToken, queryRes;
    do {
        roomToken = String(generateToken(7));
        queryRes = await queryDocument(
           room,
           [{"roomKey": roomToken}]
        );
    } while (queryRes !== null)
    let newDoc = [
        {
            "sid": null,
            "token": speakerToken,
            "initialised": false
         },
         roomToken, transcript, proStatus
    ];
    let newRes = await newDocument(
        room, newDoc
    );
    if (newRes === 1){
        console.log(`\(PASS\) createRoomCleared`);
        res.send([
            "createRoomCleared",
            {
                "type": "pass",
                "payload":
                {
                    "roomToken": roomToken,
                    "speakerToken": speakerToken,
                    "transcript": transcript,
                    "proStatus": proStatus
                }
            }
        ]);
    } else {
        console.log(`\(FAILED\) createDocument: newRes failed to update\n\tres: ${newRes}\n\tDocument: ${newDoc}`);
        res.send([
            "createRoomFailed",
            {
                "type": "databaseUpdateFailed",
                "errorMessage": "Please try again. Database is not updated with your new room"
            }
        ]);
    }
  res.end();
  })().catch(err => console.error(`\(ERROR\) createRoom:\n\t${err}`));
})

//easter-egg?
createRoom.get('/easteregg', cors(corsOptions), function (req, res) {
  res.send('Good Morning! Well done! Life is hard, and you just made it harder!');
})

export {createRoom};
