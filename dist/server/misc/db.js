"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.queryDocument = queryDocument;
exports.deleteDocuments = deleteDocuments;
exports.newDocument = newDocument;
exports.updateDocument = updateDocument;
exports.newIndex = newIndex;

var _config = require("./config");

var _date = require("./date");

require("babel-polyfill");

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

//declaring variables, npm packages
var MongoClient = require('mongodb').MongoClient;

var assert = require("assert"); //database functions


function connectRemote() {
  return _connectRemote.apply(this, arguments);
}

function _connectRemote() {
  _connectRemote = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var client;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return MongoClient.connect(_config.uri, {
              useUnifiedTopology: true,
              useNewUrlParser: true
            });

          case 2:
            client = _context.sent;
            return _context.abrupt("return", client);

          case 4:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _connectRemote.apply(this, arguments);
}

function connectCollection(_x, _x2) {
  return _connectCollection.apply(this, arguments);
}

function _connectCollection() {
  _connectCollection = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(client, cName) {
    var db, collection;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            db = client.db(_config.dName);
            collection = db.collection(cName);
            return _context2.abrupt("return", {
              db: db,
              collection: collection
            });

          case 3:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _connectCollection.apply(this, arguments);
}

function queryDocument(_x3, _x4, _x5, _x6) {
  return _queryDocument.apply(this, arguments);
}

function _queryDocument() {
  _queryDocument = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(cName, queryArray, projectArray, queryOne) {
    var ret, projectionArray, client, project, _yield$connectCollect, db, collection, queryRes, projectRes, dbRes;

    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            projectionArray = {
              _id: 0
            };
            _context3.next = 3;
            return connectRemote();

          case 3:
            client = _context3.sent;
            project = projectArray === undefined ? false : true;
            _context3.prev = 5;
            _context3.next = 8;
            return connectCollection(client, cName);

          case 8:
            _yield$connectCollect = _context3.sent;
            db = _yield$connectCollect.db;
            collection = _yield$connectCollect.collection;
            project ? projectArray.forEach(function (project) {
              return projectionArray[project] = 1;
            }) : null;
            _context3.next = 14;
            return collection.find({
              $and: queryArray
            });

          case 14:
            queryRes = _context3.sent;

            if (!(project && queryRes !== [])) {
              _context3.next = 21;
              break;
            }

            _context3.next = 18;
            return queryRes.project(projectionArray);

          case 18:
            _context3.t0 = _context3.sent;
            _context3.next = 22;
            break;

          case 21:
            _context3.t0 = queryRes;

          case 22:
            projectRes = _context3.t0;
            _context3.next = 25;
            return projectRes.toArray();

          case 25:
            dbRes = _context3.sent;

            if (queryOne !== undefined && queryOne === true) {
              ret = dbRes.length === 0 ? null : dbRes;
            } else {
              ret = dbRes.length === 0 ? null : dbRes[0];
            }

            _context3.next = 32;
            break;

          case 29:
            _context3.prev = 29;
            _context3.t1 = _context3["catch"](5);
            console.log(_context3.t1);

          case 32:
            _context3.prev = 32;
            client.close();
            return _context3.finish(32);

          case 35:
            return _context3.abrupt("return", ret);

          case 36:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[5, 29, 32, 35]]);
  }));
  return _queryDocument.apply(this, arguments);
}

function deleteDocuments(_x7, _x8) {
  return _deleteDocuments.apply(this, arguments);
}

function _deleteDocuments() {
  _deleteDocuments = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(cName, queryArray) {
    var ret, client, _yield$connectCollect2, db, collection, res;

    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return connectRemote();

          case 2:
            client = _context4.sent;
            _context4.prev = 3;
            _context4.next = 6;
            return connectCollection(client, cName);

          case 6:
            _yield$connectCollect2 = _context4.sent;
            db = _yield$connectCollect2.db;
            collection = _yield$connectCollect2.collection;
            _context4.next = 11;
            return collection.deleteMany({
              $and: queryArray
            });

          case 11:
            res = _context4.sent;
            ret = res.result.ok;
            _context4.next = 18;
            break;

          case 15:
            _context4.prev = 15;
            _context4.t0 = _context4["catch"](3);
            console.log(_context4.t0);

          case 18:
            _context4.prev = 18;
            client.close();
            return _context4.finish(18);

          case 21:
            return _context4.abrupt("return", ret);

          case 22:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, null, [[3, 15, 18, 21]]);
  }));
  return _deleteDocuments.apply(this, arguments);
}

function newDocument(_x9, _x10) {
  return _newDocument.apply(this, arguments);
}

function _newDocument() {
  _newDocument = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(cName, insertionString) {
    var ret, client, _yield$connectCollect3, db, collection, res;

    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.next = 2;
            return connectRemote();

          case 2:
            client = _context5.sent;
            _context5.prev = 3;
            _context5.next = 6;
            return connectCollection(client, cName);

          case 6:
            _yield$connectCollect3 = _context5.sent;
            db = _yield$connectCollect3.db;
            collection = _yield$connectCollect3.collection;
            _context5.next = 11;
            return collection.insertOne(insertionString);

          case 11:
            res = _context5.sent;
            ret = res.result.ok;
            _context5.next = 18;
            break;

          case 15:
            _context5.prev = 15;
            _context5.t0 = _context5["catch"](3);
            console.log(_context5.t0);

          case 18:
            _context5.prev = 18;
            client.close();
            return _context5.finish(18);

          case 21:
            return _context5.abrupt("return", ret);

          case 22:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, null, [[3, 15, 18, 21]]);
  }));
  return _newDocument.apply(this, arguments);
}

function updateDocument(_x11, _x12, _x13, _x14, _x15) {
  return _updateDocument.apply(this, arguments);
}

function _updateDocument() {
  _updateDocument = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(cName, queryArray, updateArray, pushArray, pullArray) {
    var ret, client, _yield$connectCollect4, db, collection, finalUpdateArray, res;

    return regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.next = 2;
            return connectRemote();

          case 2:
            client = _context6.sent;
            _context6.prev = 3;
            _context6.next = 6;
            return connectCollection(client, cName);

          case 6:
            _yield$connectCollect4 = _context6.sent;
            db = _yield$connectCollect4.db;
            collection = _yield$connectCollect4.collection;
            finalUpdateArray = {};

            if (updateArray !== undefined && updateArray !== null) {
              finalUpdateArray["$set"] = updateArray;
            }

            if (pushArray !== undefined && pushArray !== null) {
              finalUpdateArray["$push"] = pushArray;
            }

            if (pullArray !== undefined && pullArray !== null) {
              finalUpdateArray["$pull"] = pullArray;
            }

            if (!Object.keys(finalUpdateArray)) {
              _context6.next = 18;
              break;
            }

            _context6.next = 16;
            return collection.updateOne(queryArray, finalUpdateArray);

          case 16:
            res = _context6.sent;
            ret = res.result.ok;

          case 18:
            _context6.next = 23;
            break;

          case 20:
            _context6.prev = 20;
            _context6.t0 = _context6["catch"](3);
            console.log(_context6.t0);

          case 23:
            _context6.prev = 23;
            client.close();
            return _context6.finish(23);

          case 26:
            return _context6.abrupt("return", ret);

          case 27:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6, null, [[3, 20, 23, 26]]);
  }));
  return _updateDocument.apply(this, arguments);
}

function newIndex(_x16, _x17) {
  return _newIndex.apply(this, arguments);
}

function _newIndex() {
  _newIndex = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(cName, indexArray) {
    var ret, client, _yield$connectCollect5, db, collection;

    return regeneratorRuntime.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            _context7.next = 2;
            return connectRemote();

          case 2:
            client = _context7.sent;
            _context7.prev = 3;
            _context7.next = 6;
            return connectCollection(client, cName);

          case 6:
            _yield$connectCollect5 = _context7.sent;
            db = _yield$connectCollect5.db;
            collection = _yield$connectCollect5.collection;
            _context7.next = 11;
            return collection.createIndex(indexArray);

          case 11:
            ret = _context7.sent;
            _context7.next = 17;
            break;

          case 14:
            _context7.prev = 14;
            _context7.t0 = _context7["catch"](3);
            console.log(_context7.t0);

          case 17:
            _context7.prev = 17;
            client.close();
            return _context7.finish(17);

          case 20:
            return _context7.abrupt("return", ret);

          case 21:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7, null, [[3, 14, 17, 20]]);
  }));
  return _newIndex.apply(this, arguments);
}