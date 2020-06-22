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
var whitelist = ['https://vcxtension-website.herokuapp.com', 'http://localhost:1234']
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}

authPro.use(function timeLog (req, res, next) {
  console.log(`\(NEW\) authProRequest @ Time: ${getCurrDate(0)}`)
  next()
})

authPro.post('/signin', cors(corsOptions), function (req, res) {
  let username, password;
  if (req.body.username !== undefined && req.body.password !== undefined) {
    username = String(req.body.username);
    password = String(req.body.password);
  } else {
    console.log(`\(FAILED\) authPro signin: username or password invalid argument \n\tusername: ${req.body.username}, password: ${req.body.password}`);
    res.send([
        "authProSigninFailed",
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
                "authProSigninCleared",
                {
                    "type": "pass",
                    "payload": {
                        "userToken": userToken
                    }
                }
            ]);
        } else {
            console.log(`\(FAILED\) authPro signin: updateRes failed to update\n\tres: ${JSON.stringify(updateRes)}\n\tusername: ${username}, password: ${password}`);
             res.send([
                "authProSigninFailed",
                {
                    "type": "databaseUpdateFailed",
                    "errorMessage": "Database failed to update user logged in"
                }
             ]);
             return;
        }
    } else {
        console.log(`\(FAILED\) authPro signin: user already authenticated\n\tusername: ${username}, password: ${password}`);
        res.send([
            "authProSigninFailed",
            {
                "type": "userValidationFailed",
                "errorMessage": "user already logged in"
            }
        ]);
    }
    res.end();
  })().catch(err => console.error(`\(ERROR\) authPro signin:\n\t${err}`));
})


authPro.post('/logout', cors(corsOptions), function (req, res) {
  let username, password, userToken;
  if (req.body.username !== undefined && req.body.password !== undefined && req.body.userToken !== undefined) {
    username = String(req.body.username);
    password = String(req.body.password);
    userToken = String(req.body.userToken);
  } else {
    console.log(`\(FAILED\) authPro logout: username or password or userToken invalid argument \n\tusername: ${req.body.username}, password: ${req.body.password}\n\tuserToken: ${req.body.userToken}`);
    res.send([
        "authProLogoutFailed",
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
        ["currActiveStatus", "userToken"]
    );
    if (validateRes !== null && validateRes.currActiveStatus === true && validateRes.userToken === userToken){
        let updateRes = await updateDocument(
            auth,
            {"$and": [
                {"userName": username},
                {"userPassword": password},
                {"userToken": userToken}
            ]},
            {
                "currActiveStatus": false,
                "userToken": ""
            }
        );
        if (updateRes === 1){
            console.log(`\(PASS\) authPro: PRO user logged out`);
            res.send([
                "authProLogoutCleared",
                {
                    "type": "pass",
                    "payload": {
                        "userToken": ""
                    }
                }
            ]);
        } else {
            console.log(`\(FAILED\) authPro logout: updateRes failed to update\n\tres: ${JSON.stringify(updateRes)}\n\tusername: ${username}, password: ${password}`);
             res.send([
                "authProLogoutFailed",
                {
                    "type": "databaseUpdateFailed",
                    "errorMessage": "Database failed to update user logged out"
                }
             ]);
             return;
        }
    } else {
        console.log(`\(FAILED\) authPro logout: user is not logged in\n\tusername: ${username}, password: ${password}, userToken: ${req.body.userToken}`);
        res.send([
            "authProLogoutFailed",
            {
                "type": "userValidationFailed",
                "errorMessage": "user not logged in before"
            }
        ]);
    }
    res.end();
  })().catch(err => console.error(`\(ERROR\) authPro logout:\n\t${err}`));
})

export {authPro}
