"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.signUp = void 0;

var _db = require("../misc/db");

var _token = require("../misc/token");

var _date = require("../misc/date");

var _config = require("../misc/config");

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

//declaring variables, npm packages
var express = require('express');

var signUp = express.Router();
exports.signUp = signUp;

var cors = require('cors'); //setting up CORS settings


var whitelist = ['http://localhost:1234', 'http://example2.com'];
var corsOptions = {
  origin: function origin(_origin, callback) {
    if (whitelist.indexOf(_origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
};
signUp.use(function timeLog(req, res, next) {
  console.log("(NEW) signUpRequest @ Time: ".concat((0, _date.getCurrDate)(0)));
  next();
});
signUp.post('/', cors(), function (req, res) {
  var username, password, paidStatus;

  if (req.body.username !== undefined && req.body.password !== undefined && (req.body.paidStatus === "true" || req.body.paidStatus === true)) {
    username = String(req.body.username);
    password = String(req.body.password);
    paidStatus = true;
  } else {
    console.log("(FAILED) signUp: username or password invalid argument or not paid yet\n\tusername: ".concat(req.body.username, ", password: ").concat(req.body.password, "\n\tpaid: ").concat(req.body.paidStatus));
    res.send(["signUpFailed", {
      "type": "argumentInvalid",
      "errorMessage": "username or password argument invalid or empty or not paid yet"
    }]);
    return;
  }

  _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var queryRes, userToken, newRes;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return (0, _db.queryDocument)(_config.auth, [{
              "userName": username
            }]);

          case 2:
            queryRes = _context.sent;

            if (!(queryRes === null && paidStatus === true)) {
              _context.next = 18;
              break;
            }

            userToken = (0, _token.generateToken)(7);
            _context.next = 7;
            return (0, _db.newDocument)(_config.auth, {
              "userName": username,
              "userPassword": password,
              "userToken": userToken,
              "currActiveStatus": true,
              "currActiveRooms": []
            });

          case 7:
            newRes = _context.sent;

            if (!(newRes === 1)) {
              _context.next = 13;
              break;
            }

            console.log("(NEW) signUp: NEW PRO user signed up");
            res.send(["signUpCleared", {
              "type": "pass",
              "payload": {
                "username": username,
                "password": password,
                "userToken": userToken
              }
            }]);
            _context.next = 16;
            break;

          case 13:
            console.log("(FAILED) signUp: newRes failed to create new user\n\tnewRes: ".concat(JSON.stringify(newRes), "\n\tusername: ").concat(username, ", password: ").concat(password));
            res.send(["signUpFailed", {
              "type": "databaseUpdateFailed",
              "errorMessage": "Database failed to create new user, please try again!"
            }]);
            return _context.abrupt("return");

          case 16:
            _context.next = 20;
            break;

          case 18:
            console.log("(FAILED) signUp: username already exist\n\tusername: ".concat(username, ", password: ").concat(password));
            res.send(["signUpFailed", {
              "type": "usernameTaken",
              "errorMessage": "username already taken! please try again!"
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
    return console.error("(ERROR) signUp:\n\t".concat(err));
  });
});
signUp.get('/check/:username', cors(), function (req, res) {
  if (String(req.params.username).indexOf("{") === -1 && String(req.params.username).indexOf("}") === -1) {
    var username = String(req.params.username);

    _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
      var queryRes;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return (0, _db.queryDocument)(_config.auth, [{
                "userName": username
              }]);

            case 2:
              queryRes = _context2.sent;

              if (!(queryRes === null)) {
                _context2.next = 7;
                break;
              }

              res.send(["checkUserCleared", {
                "type": "pass",
                "payload": {
                  "username": username
                }
              }]);
              _context2.next = 9;
              break;

            case 7:
              res.send(["checkUserFailed", {
                "type": "usernameTaken",
                "errorMessage": "username already taken! please try again!"
              }]);
              return _context2.abrupt("return");

            case 9:
              res.end();

            case 10:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }))().catch(function (err) {
      return console.error("(ERROR) checkUser:\n\t".concat(err));
    });
  } else {
    return;
  }
});