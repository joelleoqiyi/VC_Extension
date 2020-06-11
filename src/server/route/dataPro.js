//importing neccessary functions from supporting files
import {queryDocument} from '../misc/db'
import {getCurrDate} from '../misc/date'
import {room, auth} from '../misc/config'

//declaring variables, npm packages
var express = require('express')
var dataPro = express.Router()
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

dataPro.use(function timeLog (req, res, next) {
  console.log(`\(NEW\) dataProRequest @ Time: ${getCurrDate(0)}`)
  next()
})


dataPro.post('/', cors(corsOptions), function (req, res) {
  let username, password, userToken;
  if (req.body.username !== undefined && req.body.password !== undefined && req.body.userToken !== undefined) {
    username = String(req.body.username);
    password = String(req.body.password);
    userToken = String(req.body.userToken);
  } else {
    console.log(`\(FAILED\) dataPro: username or password or userToken invalid argument \n\tusername: ${req.body.username}, password: ${req.body.password}\n\tuserToken: ${req.body.userToken}`);
    res.send([
        "dataProFailed",
        {
            "type": "argumentInvalid",
            "errorMessage": "username or password or userToken argument invalid or empty"
        }
    ]);
    return;
  }
  (async()=>{
    let validateRes = await queryDocument(
        auth,
        [{"userName": username}, {"userPassword": password}, {"userToken": userToken}],
        ["currActiveStatus", "userToken", "currActiveRooms"]
    );
    if (validateRes !== null && validateRes.currActiveStatus === true && validateRes.userToken === userToken){
        console.log(`\(PASS\) dataPro: PRO user requested data`);
        res.send([
           "dataProCleared",
           {
               "type": "pass",
               "payload": {
                 "userToken": userToken,
                 "rooms": validateRes.currActiveRooms || []
               }
           }
        ]);
    } else {
        console.log(`\(FAILED\) dataPro: userValidation failed\n\tusername: ${username}, password: ${password}, userToken: ${userToken}`);
        res.send([
            "dataProFailed",
            {
                "type": "userValidationFailed",
                "errorMessage": "user not logged in."
            }
        ]);
    }
    res.end();
  })().catch(err => console.error(`\(ERROR\) dataPro logout:\n\t${err}`));
})

export {dataPro}
