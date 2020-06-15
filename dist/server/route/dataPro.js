"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dataPro = void 0;

var _db = require("../misc/db");

var _date = require("../misc/date");

var _config = require("../misc/config");

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

//declaring variables, npm packages
var express = require('express');

var dataPro = express.Router();
exports.dataPro = dataPro;

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
dataPro.use(function timeLog(req, res, next) {
  console.log("(NEW) dataProRequest @ Time: ".concat((0, _date.getCurrDate)(0)));
  next();
});
dataPro.post('/', cors(corsOptions), function (req, res) {
  var username, password, userToken;

  if (req.body.username !== undefined && req.body.password !== undefined && req.body.userToken !== undefined) {
    username = String(req.body.username);
    password = String(req.body.password);
    userToken = String(req.body.userToken);
  } else {
    console.log("(FAILED) dataPro: username or password or userToken invalid argument \n\tusername: ".concat(req.body.username, ", password: ").concat(req.body.password, "\n\tuserToken: ").concat(req.body.userToken));
    res.send(["dataProFailed", {
      "type": "argumentInvalid",
      "errorMessage": "username or password or userToken argument invalid or empty"
    }]);
    return;
  }

  _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var validateRes;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return (0, _db.queryDocument)(_config.auth, [{
              "userName": username
            }, {
              "userPassword": password
            }, {
              "userToken": userToken
            }], ["currActiveStatus", "userToken", "currActiveRooms"]);

          case 2:
            validateRes = _context.sent;

            if (validateRes !== null && validateRes.currActiveStatus === true && validateRes.userToken === userToken) {
              console.log("(PASS) dataPro: PRO user requested data");
              res.send(["dataProCleared", {
                "type": "pass",
                "payload": {
                  "userToken": userToken,
                  "rooms": validateRes.currActiveRooms || []
                }
              }]);
            } else {
              console.log("(FAILED) dataPro: userValidation failed\n\tusername: ".concat(username, ", password: ").concat(password, ", userToken: ").concat(userToken));
              res.send(["dataProFailed", {
                "type": "userValidationFailed",
                "errorMessage": "user not logged in."
              }]);
            }

            res.end();

          case 5:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }))().catch(function (err) {
    return console.error("(ERROR) dataPro logout:\n\t".concat(err));
  });
});