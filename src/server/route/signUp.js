//importing neccessary functions from supporting files
import {queryDocument, newDocument} from '../misc/db'
import {generateToken} from '../misc/token'
import {getCurrDate} from '../misc/date'
import {auth} from '../misc/config'

//declaring variables, npm packages
var express = require('express')
var signUp = express.Router()
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

signUp.use(function timeLog (req, res, next) {
  console.log(`\(NEW\) signUpRequest @ Time: ${getCurrDate(0)}`)
  next()
})

signUp.post('/', cors(corsOptions), function (req, res) {
  let username, password, paidStatus;
  if (req.body.username !== undefined && req.body.password !== undefined && (req.body.paidStatus === "true" || req.body.paidStatus === true)) {
    username = String(req.body.username);
    password = String(req.body.password);
    paidStatus = true;
  } else {
    console.log(`\(FAILED\) signUp: username or password invalid argument or not paid yet\n\tusername: ${req.body.username}, password: ${req.body.password}\n\tpaid: ${req.body.paidStatus}`);
    res.send([
        "signUpFailed",
        {
            "type": "argumentInvalid",
            "errorMessage": "username or password argument invalid or empty or not paid yet"
        }
    ]);
    return;
  }
  (async()=>{
    let queryRes = await queryDocument(
        auth,
        [{"userName": username}]
    );
    if (queryRes === null && paidStatus === true){
        let userToken = generateToken(7);
        let newRes = await newDocument(
            auth,
            {
                "userName": username,
                "userPassword": password,
                "userToken": userToken,
                "currActiveStatus": true,
                "currActiveRooms": []
            } 
        );
        if (newRes === 1){
            console.log(`\(NEW\) signUp: NEW PRO user signed up`);
            res.send([
                "signUpCleared",
                {
                    "type": "pass",
                    "payload": {
                        "username": username,
                        "password": password,
                        "userToken": userToken
                    }
                }
            ]);
        } else {
            console.log(`\(FAILED\) signUp: newRes failed to create new user\n\tnewRes: ${JSON.stringify(newRes)}\n\tusername: ${username}, password: ${password}`);
             res.send([
                "signUpFailed",
                {
                    "type": "databaseUpdateFailed",
                    "errorMessage": "Database failed to create new user, please try again!"
                }
             ]);
             return;
        }
    } else {
        console.log(`\(FAILED\) signUp: username already exist\n\tusername: ${username}, password: ${password}`);
        res.send([
            "signUpFailed",
            {
                "type": "usernameTaken",
                "errorMessage": "username already taken! please try again!"
            }
        ]);
    }
    res.end();
  })().catch(err => console.error(`\(ERROR\) signUp:\n\t${err}`));
})

signUp.get('/check/:username', cors(corsOptions), function (req, res) {
  if (String(req.params.username).indexOf("{") === -1 && String(req.params.username).indexOf("}") === -1){
    let username = String(req.params.username);
    (async()=>{
        let queryRes = await queryDocument(
            auth,
            [{"userName": username}]
        );
        if (queryRes === null){
           res.send([
                "checkUserCleared",
                {
                    "type": "pass",
                    "payload": {
                        "username": username
                    }
                }
            ]);
        } else {
            res.send([
                "checkUserFailed",
                {
                    "type": "usernameTaken",
                    "errorMessage": "username already taken! please try again!"
                }
            ]);
            return;
        }
        res.end();
    })().catch(err => console.error(`\(ERROR\) checkUser:\n\t${err}`));
  } else {
    return;
  }
})

export {signUp}
