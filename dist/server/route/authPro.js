"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.authPro = void 0;

var _db = require("../misc/db");

var _token = require("../misc/token");

var _date = require("../misc/date");

var _config = require("../misc/config");

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

//declaring variables, npm packages
var express = require('express');

var authPro = express.Router();
exports.authPro = authPro;

var cors = require('cors'); //setting up CORS settings


var whitelist = ['https://vcxtension-website.herokuapp.com', 'http://localhost:1234', 'http://127.0.0.1:5500'];
var corsOptions = {
  origin: function origin(_origin, callback) {
    if (whitelist.indexOf(_origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
};
authPro.use(function timeLog(req, res, next) {
  console.log("(NEW) authProRequest @ Time: ".concat((0, _date.getCurrDate)(0)));
  next();
});
authPro.post('/signin', cors(corsOptions), function (req, res) {
  var username, password;

  if (req.body.username !== undefined && req.body.password !== undefined) {
    username = String(req.body.username);
    password = String(req.body.password);
  } else {
    console.log("(FAILED) authPro signin: username or password invalid argument \n\tusername: ".concat(req.body.username, ", password: ").concat(req.body.password));
    res.send(["authProSigninFailed", {
      "type": "argumentInvalid",
      "errorMessage": "username or password argument invalid or empty"
    }]);
    return;
  }

  _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var validateRes, userToken, updateRes;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return (0, _db.queryDocument)(_config.auth, [{
              "userName": username
            }, {
              "userPassword": password
            }], ["currActiveStatus"]);

          case 2:
            validateRes = _context.sent;

            if (!(validateRes !== null && validateRes.currActiveStatus === false)) {
              _context.next = 18;
              break;
            }

            userToken = (0, _token.generateToken)(7);
            _context.next = 7;
            return (0, _db.updateDocument)(_config.auth, {
              "$and": [{
                "userName": username
              }, {
                "userPassword": password
              }]
            }, {
              "currActiveStatus": true,
              "userToken": userToken
            });

          case 7:
            updateRes = _context.sent;

            if (!(updateRes === 1)) {
              _context.next = 13;
              break;
            }

            console.log("(PASS) authPro: PRO user logged in");
            res.send(["authProSigninCleared", {
              "type": "pass",
              "payload": {
                "userToken": userToken
              }
            }]);
            _context.next = 16;
            break;

          case 13:
            console.log("(FAILED) authPro signin: updateRes failed to update\n\tres: ".concat(JSON.stringify(updateRes), "\n\tusername: ").concat(username, ", password: ").concat(password));
            res.send(["authProSigninFailed", {
              "type": "databaseUpdateFailed",
              "errorMessage": "Database failed to update user logged in"
            }]);
            return _context.abrupt("return");

          case 16:
            _context.next = 20;
            break;

          case 18:
            console.log("(FAILED) authPro signin: user already authenticated\n\tusername: ".concat(username, ", password: ").concat(password));
            res.send(["authProSigninFailed", {
              "type": "userValidationFailed",
              "errorMessage": "user already logged in"
            }]);

          case 20:
            res.end();

          case 21:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }))().catch(function (err) {
    return console.error("(ERROR) authPro signin:\n\t".concat(err));
  });
});
authPro.post('/logout', cors(corsOptions), function (req, res) {
  var username, password, userToken;

  if (req.body.username !== undefined && req.body.password !== undefined && req.body.userToken !== undefined) {
    username = String(req.body.username);
    password = String(req.body.password);
    userToken = String(req.body.userToken);
  } else {
    console.log("(FAILED) authPro logout: username or password or userToken invalid argument \n\tusername: ".concat(req.body.username, ", password: ").concat(req.body.password, "\n\tuserToken: ").concat(req.body.userToken));
    res.send(["authProLogoutFailed", {
      "type": "argumentInvalid",
      "errorMessage": "username or password or userToken argument invalid or empty"
    }]);
    return;
  }

  _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
    var validateRes, updateRes;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return (0, _db.queryDocument)(_config.auth, [{
              "userName": username
            }, {
              "userPassword": password
            }, {
              "userToken": userToken
            }], ["currActiveStatus", "userToken"]);

          case 2:
            validateRes = _context2.sent;

            if (!(validateRes !== null && validateRes.currActiveStatus === true && validateRes.userToken === userToken)) {
              _context2.next = 17;
              break;
            }

            _context2.next = 6;
            return (0, _db.updateDocument)(_config.auth, {
              "$and": [{
                "userName": username
              }, {
                "userPassword": password
              }, {
                "userToken": userToken
              }]
            }, {
              "currActiveStatus": false,
              "userToken": ""
            });

          case 6:
            updateRes = _context2.sent;

            if (!(updateRes === 1)) {
              _context2.next = 12;
              break;
            }

            console.log("(PASS) authPro: PRO user logged out");
            res.send(["authProLogoutCleared", {
              "type": "pass",
              "payload": {
                "userToken": ""
              }
            }]);
            _context2.next = 15;
            break;

          case 12:
            console.log("(FAILED) authPro logout: updateRes failed to update\n\tres: ".concat(JSON.stringify(updateRes), "\n\tusername: ").concat(username, ", password: ").concat(password));
            res.send(["authProLogoutFailed", {
              "type": "databaseUpdateFailed",
              "errorMessage": "Database failed to update user logged out"
            }]);
            return _context2.abrupt("return");

          case 15:
            _context2.next = 19;
            break;

          case 17:
            console.log("(FAILED) authPro logout: user is not logged in\n\tusername: ".concat(username, ", password: ").concat(password, ", userToken: ").concat(req.body.userToken));
            res.send(["authProLogoutFailed", {
              "type": "userValidationFailed",
              "errorMessage": "user not logged in before"
            }]);

          case 19:
            res.end();

          case 20:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }))().catch(function (err) {
    return console.error("(ERROR) authPro logout:\n\t".concat(err));
  });
});