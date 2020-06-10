//importing neccessary functions from supporting files
import {queryDocument, newDocument, updateDocument} from '../misc/db'
import {generateToken} from '../misc/token'
import {getCurrDate} from '../misc/date'
import {room, auth} from '../misc/config'

//declaring variables, npm packages
var express = require('express')
var authPro = express.Router()
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
authPro.use(function timeLog (req, res, next) {
  console.log(`\(NEW\) authProRequest @ Time: ${getCurrDate(0)}`)
  next()
})

authPro.post('/', cors(corsOptions), function (req, res) {
  let username, password;
  if (req.body.username !== undefined && req.body.password !== undefined) {
    username = String(req.body.username);
    password = String(req.body.password);
  } else {
    console.log(`\(FAILED\) authPro: username or password invalid argument \n\troomName: ${req.body.roomName}`);
    res.send([
        "authProFailed",
        {
            "type": "argumentInvalid",
            "errorMessage": "username or password argument invalid or empty"
        }
    ]);
    return;
  }
  (async()=>{
    let validateRes = await queryDocument(
        auth,
        [{"userName": username}, {"userPassword": password}],
        ["currActiveStatus"]
    );
    //console.log(validateRes)
    if (validateRes !== null && validateRes.currActiveStatus === false){
        let userToken = generateToken(7);
        let updateRes = await updateDocument(
            auth,
            {"$and": [ 
                {"userName": username},
                {"userPassword": password}
            ]},
            {
                "currActiveStatus": true,
                "userToken": userToken
            }
        );
        if (updateRes === 1){
            console.log(`\(PASS\) authPro: PRO user logged in`);
            res.send([
                "authProCleared",
                {
                    "type": "pass",
                    "payload": {
                        "userToken": userToken
                    }
                }
            ]);
        } else { 
            console.log(`\(FAILED\) authPro: updateRes failed to update\n\tres: ${JSON.stringify(updateRes)}\n\tusername: ${username}, password: ${password}`); 
             res.send([
                "authProFailed",
                {
                    "type": "databaseUpdateFailed",
                    "errorMessage": "Database failed to update user logged in"
                }
             ]);
             return;
        }
    } else {
        console.log(`\(FAILED\) authPro: user already authenticated\n\tusername: ${username}, password: ${password}`);
        res.send([ 
            "authProFailed",
            {
                "type": "userValidationFailed",
                "errorMessage": "user already logged in"
            }
        ]);
    }
    res.end();
  })().catch(err => console.error(`\(ERROR\) authPro:\n\t${err}`));
})

export {authPro};
