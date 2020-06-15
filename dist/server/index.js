"use strict";

require("babel-polyfill");

var _db = require("./misc/db");

var _config = require("./misc/config");

var _createRoom = require("./route/createRoom");

var _authPro = require("./route/authPro");

var _dataPro = require("./route/dataPro");

var _signUp = require("./route/signUp");

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

//declaring variables, npm packages
var assert = require("assert");

var bodyParser = require('body-parser');

var express = require("express"); //initialising server and socket.io connection


var app = express();

var cors = require("cors");

var http = require("http").createServer(app);

var io = require("socket.io")(http); //setting up server "settings"


app.use(bodyParser.urlencoded({
  extended: true
}));
app.use('/create', _createRoom.createRoom);
app.use('/auth', _authPro.authPro);
app.use('/data', _dataPro.dataPro);
app.use('/register', _signUp.signUp);
http.listen(_config.port, function () {
  console.log("listening to port ".concat(_config.port));
}); //socket.io connection listeners

io.use(function (socket, next) {
  var roomToken = socket.handshake.query.roomToken === ("null" || null) ? null : socket.handshake.query.roomToken;

  if (roomToken !== null) {
    _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      var res;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return (0, _db.queryDocument)(_config.room, [{
                "roomKey": roomToken
              }], ["roomKey"]);

            case 2:
              res = _context.sent;

              if (!(res && res.roomKey === roomToken)) {
                _context.next = 8;
                break;
              }

              console.log("(PASS) enterRoomCleared");
              return _context.abrupt("return", next());

            case 8:
              console.log("(FAILED) enterRoom: roomValidation failed\n\troomToken: ".concat(roomToken, "\n\tsocket.id: ").concat(socket.id));
              return _context.abrupt("return", next(new Error("Room Token Invalid")));

            case 10:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }))().catch(function (err) {
      return console.error("(ERROR) enterRoom:\n\t".concat(err));
    });
  } else {
    console.log("(FAILED) enterRoom: roomValidation empty\n\troomToken: ".concat(roomToken, "\n\tsocket.id: ").concat(socket.id));
    return next(new Error("Room Token Empty"));
  }
});
io.of("/rooms").on("connection", function (socket) {
  var isSpeaker;
  socket.roomToken = socket.handshake.query.roomToken || null;
  socket.speakerToken = socket.handshake.query.speakerToken === ("null" || null) ? null : socket.handshake.query.speakerToken;
  console.log("(NEW): ".concat(socket.id, " is connected on /rooms/").concat(socket.roomToken));
  socket.join(socket.roomToken);

  _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
    var res, isPro, updateRes, toBePayload;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return (0, _db.queryDocument)(_config.room, [{
              "roomKey": socket.roomToken
            }], ["roomKey", "proStatus", "transcript", "speaker.sid", "speaker.initialised", "speaker.token"]);

          case 2:
            res = _context2.sent;
            isPro = res.proStatus === true ? true : false;

            if (!(res.speaker.sid === null && res.speaker.initialised === false && res.speaker.token !== undefined && res.speaker.token !== null)) {
              _context2.next = 14;
              break;
            }

            if (!(socket.speakerToken === res.speaker.token)) {
              _context2.next = 13;
              break;
            }

            isSpeaker = true;
            _context2.next = 9;
            return (0, _db.updateDocument)(_config.room, {
              "roomKey": socket.roomToken
            }, {
              "speaker.sid": socket.id,
              "speaker.initialised": true
            });

          case 9:
            updateRes = _context2.sent;

            if (updateRes === 1) {
              io.of('/rooms').to(socket.roomToken).emit("speakerEnteredCleared", {
                "type": "pass",
                "payload": "speaker is here"
              });
              console.log("(PASS) speakerEnteredCleared");
            } else {
              socket.emit("speakerEnteredFailed", {
                "type": "databaseUpdateFailed",
                "errorMessage": "Database failed to register your entry. Please try again"
              });
              console.log("(FAILED) speakerEntered: updateRes failed to update\n\tupdateRes: ".concat(updateRes, "\n\tsocket.id: ").concat(socket.id));
            }

            _context2.next = 14;
            break;

          case 13:
            isSpeaker = false;

          case 14:
            toBePayload = {
              "roomToken": res.roomKey,
              "transcript": res.transcript || "",
              "proStatus": res.proStatus || false,
              "speaker": isSpeaker
            };
            Object.keys(toBePayload).forEach(function (key) {
              if (toBePayload[key] === false) {
                delete toBePayload[key];
              }
            });
            socket.emit("initHandshake", {
              "type": "pass",
              "payload": toBePayload
            });
            console.log("(PASS) initHandshakeCleared");

          case 18:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }))().catch(function (err) {
    return console.error("(ERROR) Error during HandShake: ".concat(err));
  });

  socket.on("escalationRequest", function (_ref3) {
    var _ref4 = _slicedToArray(_ref3, 2),
        proStatus = _ref4[0],
        escalation = _ref4[1];

    if (!proStatus || !escalation) {
      if (!proStatus) {
        socket.emit("escalationRequestFailed", {
          "type": "argumentInvalid",
          "errorMessage": "proStatus argument invalid OR PRO (mode) not enabled"
        });
        console.log("(FAILED) escalationRequest: proStatus invalid argument\n\tproStatus: ".concat(proStatus, "\n\tsocket.id: ").concat(socket.id));
      }

      if (!escalation) {
        socket.emit("escalationRequestFailed", {
          "type": "argumentInvalid",
          "errorMessage": "escalation argument invalid"
        });
        console.log("(FAILED) escalationRequest: escalation invalid argument\n\tescalation: ".concat(escalation, "\n\tsocket.id: ").concat(socket.id));
      }

      return;
    }

    _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
      var res;
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return (0, _db.queryDocument)(_config.room, [{
                "roomKey": socket.roomToken
              }], ["proStatus", "roomKey", "speaker.sid", "speaker.initialised"]);

            case 2:
              res = _context3.sent;

              if (res && res.roomKey === socket.roomToken) {
                if (res.proStatus === true) {
                  if (res.speaker.initialised === true && res.speaker.sid) {
                    socket.broadcast.to(res.speaker.sid).emit("escalationRequestSent", {
                      "type": "pass",
                      "payload": escalation
                    });

                    if (socket.id !== res.speaker.sid) {
                      socket.emit("escalationRequestCleared", {
                        "type": "pass",
                        "payload": "Your question has been sent to speaker"
                      });
                    }

                    console.log("(PASS) escalationRequestCleared");
                  } else {
                    socket.emit("escalationRequestFailed", {
                      "type": "speakerValidationFailed",
                      "errorMessage": "The speaker is not in the room"
                    });
                    console.log("(FAILED) escalationRequest: speakerValidation failed\n\tres: ".concat(JSON.stringify(res), "\n\tsocket.id: ").concat(socket.id));
                  }
                } else {
                  socket.emit("escalationRequestFailed", {
                    "type": "statusValidationFailed",
                    "errorMessage": "This session does not have PRO (mode) enabled. Please ask your query yourself"
                  });
                  console.log("(FAILED) escalationRequest: statusValidation failed\n\tres: ".concat(JSON.stringify(res), "\n\tsocket.id: ").concat(socket.id));
                }
              } else {
                socket.emit("escalationRequestFailed", {
                  "type": "roomValidationFailed",
                  "errorMessage": "The room you are currently in does not exist"
                });
                console.log("(FAILED) escalationRequest: roomValidation failed\n\tres: ".concat(JSON.stringify(res), "\n\tsocket.id: ").concat(socket.id));
              }

            case 4:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    }))().catch(function (err) {
      return console.error("(ERROR) escalationRequest\n\t".concat(err));
    });
  });
  socket.on("transcriptUpdate", function (update) {
    if (!update) {
      socket.emit("transcriptUpdateFailed", {
        "type": "argumentInvalid",
        "errorMessage": "update argument invalid"
      });
      console.log("(FAILED) transcriptUpdate: update invalid argument\n\tupdate: ".concat(update, "\n\tsocket.id: ").concat(socket.id));
      return;
    }

    _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
      var res, updateString, transcript, tobeUpdated, updateRes;
      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _context4.next = 2;
              return (0, _db.queryDocument)(_config.room, [{
                "roomKey": socket.roomToken
              }], ["roomKey", "speaker.sid", "speaker.initialised", "transcript"]);

            case 2:
              res = _context4.sent;

              if (!(res && res.roomKey === socket.roomToken)) {
                _context4.next = 18;
                break;
              }

              if (!(res.speaker.initialised === true && res.speaker.sid === socket.id)) {
                _context4.next = 14;
                break;
              }

              updateString = String(update);
              transcript = res.transcript !== null && res.transcript !== undefined ? String(res.transcript) : "";
              tobeUpdated = transcript.concat(updateString);
              _context4.next = 10;
              return (0, _db.updateDocument)(_config.room, {
                "roomKey": socket.roomToken
              }, {
                "transcript": tobeUpdated
              });

            case 10:
              updateRes = _context4.sent;

              if (updateRes === 1) {
                io.of('/rooms').to(socket.roomToken).emit("transcriptUpdateCleared", {
                  "type": "pass",
                  "payload": tobeUpdated
                });
                console.log("(PASS) transcriptUpdateCleared");
              } else {
                socket.emit("transcriptUpdateFailed", {
                  "type": "databaseUpdateFailed",
                  "errorMessage": "Please speak slower. Database is not updated with new transcript"
                });
                console.log("(FAILED) transcriptUpdate: updateRes failed to update\n\tres: ".concat(JSON.stringify(res), "\n\tupdateRes: ").concat(updateRes, "\n\tsocket.id: ").concat(socket.id));
              }

              _context4.next = 16;
              break;

            case 14:
              socket.emit("transcriptUpdateFailed", {
                "type": "speakerValidationFailed",
                "errorMessage": "You will not be able to update the transcript unless you are the speaker"
              });
              console.log("(FAILED) transcriptUpdate: speakerValidation failed\n\tres: ".concat(JSON.stringify(res), "\n\tsocket.id: ").concat(socket.id));

            case 16:
              _context4.next = 20;
              break;

            case 18:
              socket.emit("transcriptUpdateFailed", {
                "type": "roomValidationFailed",
                "errorMessage": "The room you are currently in does not exist"
              });
              console.log("(FAILED) transcriptUpdate: roomValidation failed\n\tres: ".concat(JSON.stringify(res), "\n\tsocket.id: ").concat(socket.id));

            case 20:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4);
    }))().catch(function (err) {
      return console.error("(ERROR) transcriptUpdate:\n\t".concat(err));
    });
  });
  socket.on("checkStatus", function (proStatus) {
    if (!proStatus) {
      socket.emit("checkStatusFailed", {
        "type": "argumentInvalid",
        "errorMessage": "proStatus argument invalid OR PRO (mode) not enabled"
      });
      console.log("(FAILED) checkStatus: proStatus invalid argument\n\tproStatus: ".concat(proStatus, "\n\tsocket.id: ").concat(socket.id));
      return;
    }

    _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
      var res;
      return regeneratorRuntime.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              _context5.next = 2;
              return (0, _db.queryDocument)(_config.room, [{
                "roomKey": socket.roomToken
              }], ["proStatus", "roomKey"]);

            case 2:
              res = _context5.sent;

              if (res && res.roomKey === socket.roomToken) {
                if (res.proStatus === true) {
                  socket.emit("checkStatusCleared", {
                    "type": "pass",
                    "payload": socket.id
                  });
                  console.log("(PASS) checkStatusCleared");
                } else {
                  socket.emit("checkStatusFailed", {
                    "type": "statusValidationFailed",
                    "errorMessage": "This session does not have PRO (mode) enabled"
                  });
                  console.log("(FAILED) checkStatus: statusValidation failed\n\tres: ".concat(JSON.stringify(res), "\n\tsocket.id: ").concat(socket.id));
                }
              } else {
                socket.emit("checkStatusFailed", {
                  "type": "roomValidationFailed",
                  "errorMessage": "The room you are currently in does not exist"
                });
                console.log("(FAILED) checkStatus: roomValidation failed\n\tresStatus: ".concat(JSON.stringify(res), "\n\tsocket.id: ").concat(socket.id));
              }

            case 4:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5);
    }))().catch(function (err) {
      return console.error("(ERROR) checkStatus:\n\t".concat(err));
    });
  });
});