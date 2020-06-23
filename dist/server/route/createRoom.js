"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createRoom = void 0;

var _db = require("../misc/db");

var _token = require("../misc/token");

var _date = require("../misc/date");

var _config = require("../misc/config");

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

//declaring variables, npm packages
var express = require('express');

var createRoom = express.Router();
exports.createRoom = createRoom;

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
}; //methods with CORS-enabled for whitelisted-domains

createRoom.use(function timeLog(req, res, next) {
  console.log("(NEW) createRoomRequest @ Time: ".concat((0, _date.getCurrDate)(0)));
  next();
});
createRoom.post('/', cors(corsOptions), function (req, res) {
  var roomName;
  var transcript = req.body.transcript || "";
  var proStatus = req.body.proStatus === "true" ? true : false;
  var haveUserToken = req.body.userToken ? true : false;
  var userToken = haveUserToken && String(req.body.userToken).length === 7 ? String(req.body.userToken) : null;

  if (String(req.body.roomName).length > 0 && typeof req.body.roomName === "string") {
    roomName = String(req.body.roomName);
  } else {
    console.log("(FAILED) createDocument: roomName invalid argument \n\troomName: ".concat(Object.keys(req.body)));
    res.send(["createRoomFailed", {
      "type": "argumentInvalid",
      "errorMessage": "roomName argument invalid or empty"
    }]);
    res.end();
    return;
  }

  _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var speakerToken, roomToken, queryRes, newDoc, validateRes, updateProRes, newRes;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            speakerToken = String((0, _token.generateToken)(7));

          case 1:
            roomToken = String((0, _token.generateToken)(7));
            _context.next = 4;
            return (0, _db.queryDocument)(_config.room, [{
              "roomKey": roomToken
            }]);

          case 4:
            queryRes = _context.sent;

          case 5:
            if (queryRes !== null) {
              _context.next = 1;
              break;
            }

          case 6:
            newDoc = {
              "speaker": {
                "sid": null,
                "token": speakerToken,
                "initialised": false
              },
              "roomKey": roomToken,
              roomName: roomName,
              transcript: transcript,
              proStatus: false,
              "expirationDate": (0, _date.getCurrDate)(1)
            };

            if (!(haveUserToken && userToken)) {
              _context.next = 29;
              break;
            }

            _context.next = 10;
            return (0, _db.queryDocument)(_config.auth, [{
              "userToken": userToken
            }, {
              "currActiveStatus": true
            }]);

          case 10:
            validateRes = _context.sent;

            if (!(validateRes !== null)) {
              _context.next = 26;
              break;
            }

            newDoc.expirationDate = (0, _date.getCurrDate)(5);
            newDoc.proStatus = true;
            _context.next = 16;
            return (0, _db.updateDocument)(_config.auth, {
              userToken: userToken
            }, null, {
              "currActiveRooms": {
                "name": roomName,
                roomToken: roomToken
              }
            });

          case 16:
            updateProRes = _context.sent;

            if (!(updateProRes === 1)) {
              _context.next = 21;
              break;
            }

            console.log("(PASS) createRoom: updateProAuth");
            _context.next = 24;
            break;

          case 21:
            console.log("(FAILED) createRoom: updateProRes failed to update\n\tres: ".concat(JSON.stringify(updateProRes), "\n\tname: ").concat(roomName, ", roomToken: ").concat(roomToken));
            res.send(["createRoomFailed", {
              "type": "databaseUpdateFailed",
              "errorMessage": "Database failed to update new room"
            }]);
            return _context.abrupt("return");

          case 24:
            _context.next = 29;
            break;

          case 26:
            console.log("(FAILED) createRoom: userTokenValidation failed\n\tres: ".concat(JSON.stringify(validateRes)));
            res.send(["createRoomFailed", {
              "type": "userTokenValidationFailed",
              "errorMessage": "User has failed to authenticate as a PRO user"
            }]);
            return _context.abrupt("return");

          case 29:
            _context.next = 31;
            return (0, _db.newDocument)(_config.room, newDoc);

          case 31:
            newRes = _context.sent;

            if (!(newRes === 1)) {
              _context.next = 37;
              break;
            }

            console.log("(PASS) createRoomCleared");
            res.send(["createRoomCleared", {
              "type": "pass",
              "payload": {
                "roomToken": roomToken,
                "roomName": roomName,
                "speakerToken": speakerToken
              }
            }]);
            _context.next = 40;
            break;

          case 37:
            console.log("(FAILED) createRoom: newRes failed to update\n\tres: ".concat(newRes, "\n\tDocument: ").concat(newDoc));
            res.send(["createRoomFailed", {
              "type": "databaseUpdateFailed",
              "errorMessage": "Please try again. Database is not updated with your new room"
            }]);
            return _context.abrupt("return");

          case 40:
            res.end();

          case 41:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }))().catch(function (err) {
    return console.error("(ERROR) createRoom:\n\t".concat(err));
  });
}); //easter-egg?

createRoom.get('/easteregg', cors(), function (req, res) {
  console.log("(NEW) easterEggRequest @ Time: ".concat((0, _date.getCurrDate)(0)));
  res.send("Good Morning!\n\tEasterEgg created at ".concat((0, _date.getCurrDate)(0), "\n\tWell done! Life is hard, and you just made it harder!"));
});