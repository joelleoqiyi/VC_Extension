//importing neccessary functions from supporting files
import {queryDocument, newDocument, updateDocument} from '../misc/db'
import {generateToken} from '../misc/token'
import {getCurrDate} from '../misc/date'
import {room, auth} from '../misc/config'

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
  let roomName;
  let transcript = req.body.transcript || "";
  let proStatus = (req.body.proStatus === "true") ? true : false;
  let haveUserToken = (req.body.userToken) ? true : false;
  let userToken = (haveUserToken && String(req.body.userToken).length === 7)
                    ? String(req.body.userToken)
                    : null
  if (String(req.body.roomName).length > 0 && typeof req.body.roomName === "string"){
    roomName = String(req.body.roomName);
  } else { 
    console.log(`\(FAILED\) createDocument: roomName invalid argument \n\troomName: ${req.body.roomName}`);
    res.send([
        "createRoomFailed",
        {
            "type": "argumentInvalid",
            "errorMessage": "roomName argument invalid or empty"
        }
    ]);
    res.end()
    return;
  }
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
    let newDoc = {
        "speaker": {
            "sid": null,
            "token": speakerToken,
            "initialised": false
        },
        roomToken, roomName, transcript, proStatus, 
        "expirationDate": getCurrDate(1)
    };
    if (haveUserToken && userToken){
        let validateRes = await queryDocument(
            auth,
            [{"userToken": userToken}, {"currActiveStatus": true}]
        );
        if (validateRes !== null){
            newDoc.expirationDate = getCurrDate(5);
            let updateProRes = await updateDocument(
                auth,
                {userToken}, 
                null,
                {
                    "currActiveRooms": {
                        "name": roomName,
                        roomToken
                    }
                }
            );
            if (updateProRes === 1){
                console.log(`\(PASS\) createRoom: updateProAuth`);
            } else {
                console.log(`\(FAILED\) createRoom: updateProRes failed to update\n\tres: ${JSON.stringify(updateProRes)}\n\tname: ${roomName}, roomToken: ${roomToken}`); 
                res.send([
                    "createRoomFailed",
                    {
                        "type": "databaseUpdateFailed",
                        "errorMessage": "Database failed to update new room"
                    }
                ]);
                return;
            }
        } else {
            console.log(`\(FAILED\) createRoom: userTokenValidation failed\n\tres: ${JSON.stringify(updateProRes)}`);
            res.send([
                "createRoomFailed",
                {
                    "type": "userTokenValidationFailed",
                    "errorMessage": "User has failed to authenticate as a PRO user"
                }
            ]);
            return;
        }
    }
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
                    "roomName": roomName,
                    "speakerToken": speakerToken
                }
            }
        ]);
    } else {
        console.log(`\(FAILED\) createRoom: newRes failed to update\n\tres: ${newRes}\n\tDocument: ${newDoc}`);
        res.send([
            "createRoomFailed",
            {
                "type": "databaseUpdateFailed",
                "errorMessage": "Please try again. Database is not updated with your new room"
            }
        ]);
        return;
    }
  res.end();
  })().catch(err => console.error(`\(ERROR\) createRoom:\n\t${err}`));
})

//easter-egg?
createRoom.get('/easteregg', cors(corsOptions), function (req, res) {
  res.send('Good Morning! Well done! Life is hard, and you just made it harder!');
})

export {createRoom};
