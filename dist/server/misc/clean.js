"use strict";

require("babel-polyfill");

var _db = require("./db");

var _date = require("./date");

var _config = require("./config");

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

//executable function.
_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
  var DaysToClean, queryRes, queryArray, updateRes, res;
  return regeneratorRuntime.wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          DaysToClean = [-1, -2, -3, -4, -5];
          DaysToClean.forEach(function (day, i) {
            DaysToClean[i] = (0, _date.getCurrDate)(day);
          });
          _context.next = 4;
          return (0, _db.queryDocument)(_config.room, [{
            "expirationDate": {
              "$in": DaysToClean
            }
          }], ["roomKey"], true);

        case 4:
          queryRes = _context.sent;
          queryArray = [];
          queryRes.forEach(function (res) {
            return queryArray.push(res.roomKey);
          });
          _context.next = 9;
          return (0, _db.updateDocument)(_config.auth, {}, null, null, {
            "currActiveRooms": {
              "roomToken": {
                "$in": queryArray
              }
            }
          });

        case 9:
          updateRes = _context.sent;

          if (updateRes !== 1) {
            console.log("(FAILED) cleanRequest: updateRes failed to update database\n\tres: ".concat(updateRes, "\n\tDaysToClean: ").concat(queryArray));
          }

          _context.next = 13;
          return (0, _db.deleteDocuments)(_config.room, [{
            "expirationDate": {
              "$in": DaysToClean
            }
          }]);

        case 13:
          res = _context.sent;

          if (res !== 1) {
            console.log("(FAILED) cleanRequest: res failed to update database\n\tres: ".concat(res, "\n\tDaysToClean: ").concat(DaysToClean));
          }

        case 15:
        case "end":
          return _context.stop();
      }
    }
  }, _callee);
}))().catch(function (err) {
  return console.error("Error during Cleaning: ".concat(err));
});