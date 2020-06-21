"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;

        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        } // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.


        if (previousRequire) {
          return previousRequire(name, true);
        } // Try the node require function if it exists.


        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};
      var module = cache[name] = new newRequire.Module(name);
      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x) {
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x) {
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;

  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;

  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]); // CommonJS

    if ((typeof exports === "undefined" ? "undefined" : _typeof(exports)) === "object" && typeof module !== "undefined") {
      module.exports = mainExports; // RequireJS
    } else if (typeof define === "function" && define.amd) {
      define(function () {
        return mainExports;
      }); // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  } // Override the current require with this new one


  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
}({
  "../../../../../../../../../../../usr/local/lib/node_modules/parcel/node_modules/process/browser.js": [function (require, module, exports) {
    // shim for using process in browser
    var process = module.exports = {}; // cached from whatever global is present so that test runners that stub it
    // don't break things.  But we need to wrap it in a try catch in case it is
    // wrapped in strict mode code which doesn't define any globals.  It's inside a
    // function because try/catches deoptimize in certain engines.

    var cachedSetTimeout;
    var cachedClearTimeout;

    function defaultSetTimout() {
      throw new Error('setTimeout has not been defined');
    }

    function defaultClearTimeout() {
      throw new Error('clearTimeout has not been defined');
    }

    (function () {
      try {
        if (typeof setTimeout === 'function') {
          cachedSetTimeout = setTimeout;
        } else {
          cachedSetTimeout = defaultSetTimout;
        }
      } catch (e) {
        cachedSetTimeout = defaultSetTimout;
      }

      try {
        if (typeof clearTimeout === 'function') {
          cachedClearTimeout = clearTimeout;
        } else {
          cachedClearTimeout = defaultClearTimeout;
        }
      } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
      }
    })();

    function runTimeout(fun) {
      if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
      } // if setTimeout wasn't available but was latter defined


      if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
      }

      try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
      } catch (e) {
        try {
          // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
          return cachedSetTimeout.call(null, fun, 0);
        } catch (e) {
          // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
          return cachedSetTimeout.call(this, fun, 0);
        }
      }
    }

    function runClearTimeout(marker) {
      if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
      } // if clearTimeout wasn't available but was latter defined


      if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
      }

      try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
      } catch (e) {
        try {
          // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
          return cachedClearTimeout.call(null, marker);
        } catch (e) {
          // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
          // Some versions of I.E. have different rules for clearTimeout vs setTimeout
          return cachedClearTimeout.call(this, marker);
        }
      }
    }

    var queue = [];
    var draining = false;
    var currentQueue;
    var queueIndex = -1;

    function cleanUpNextTick() {
      if (!draining || !currentQueue) {
        return;
      }

      draining = false;

      if (currentQueue.length) {
        queue = currentQueue.concat(queue);
      } else {
        queueIndex = -1;
      }

      if (queue.length) {
        drainQueue();
      }
    }

    function drainQueue() {
      if (draining) {
        return;
      }

      var timeout = runTimeout(cleanUpNextTick);
      draining = true;
      var len = queue.length;

      while (len) {
        currentQueue = queue;
        queue = [];

        while (++queueIndex < len) {
          if (currentQueue) {
            currentQueue[queueIndex].run();
          }
        }

        queueIndex = -1;
        len = queue.length;
      }

      currentQueue = null;
      draining = false;
      runClearTimeout(timeout);
    }

    process.nextTick = function (fun) {
      var args = new Array(arguments.length - 1);

      if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
          args[i - 1] = arguments[i];
        }
      }

      queue.push(new Item(fun, args));

      if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
      }
    }; // v8 likes predictible objects


    function Item(fun, array) {
      this.fun = fun;
      this.array = array;
    }

    Item.prototype.run = function () {
      this.fun.apply(null, this.array);
    };

    process.title = 'browser';
    process.env = {};
    process.argv = [];
    process.version = ''; // empty string to avoid regexp issues

    process.versions = {};

    function noop() {}

    process.on = noop;
    process.addListener = noop;
    process.once = noop;
    process.off = noop;
    process.removeListener = noop;
    process.removeAllListeners = noop;
    process.emit = noop;
    process.prependListener = noop;
    process.prependOnceListener = noop;

    process.listeners = function (name) {
      return [];
    };

    process.binding = function (name) {
      throw new Error('process.binding is not supported');
    };

    process.cwd = function () {
      return '/';
    };

    process.chdir = function (dir) {
      throw new Error('process.chdir is not supported');
    };

    process.umask = function () {
      return 0;
    };
  }, {}],
  "background.js": [function (require, module, exports) {
    var process = require("process");

    function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
      try {
        var info = gen[key](arg);
        var value = info.value;
      } catch (error) {
        reject(error);
        return;
      }

      if (info.done) {
        resolve(value);
      } else {
        Promise.resolve(value).then(_next, _throw);
      }
    }

    function _asyncToGenerator(fn) {
      return function () {
        var self = this,
            args = arguments;
        return new Promise(function (resolve, reject) {
          var gen = fn.apply(self, args);

          function _next(value) {
            asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
          }

          function _throw(err) {
            asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
          }

          _next(undefined);
        });
      };
    }

    function _createForOfIteratorHelper(o, allowArrayLike) {
      var it;

      if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) {
        if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
          if (it) o = it;
          var i = 0;

          var F = function F() {};

          return {
            s: F,
            n: function n() {
              if (i >= o.length) return {
                done: true
              };
              return {
                done: false,
                value: o[i++]
              };
            },
            e: function e(_e) {
              throw _e;
            },
            f: F
          };
        }

        throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
      }

      var normalCompletion = true,
          didErr = false,
          err;
      return {
        s: function s() {
          it = o[Symbol.iterator]();
        },
        n: function n() {
          var step = it.next();
          normalCompletion = step.done;
          return step;
        },
        e: function e(_e2) {
          didErr = true;
          err = _e2;
        },
        f: function f() {
          try {
            if (!normalCompletion && it.return != null) it.return();
          } finally {
            if (didErr) throw err;
          }
        }
      };
    }

    function _unsupportedIterableToArray(o, minLen) {
      if (!o) return;
      if (typeof o === "string") return _arrayLikeToArray(o, minLen);
      var n = Object.prototype.toString.call(o).slice(8, -1);
      if (n === "Object" && o.constructor) n = o.constructor.name;
      if (n === "Map" || n === "Set") return Array.from(o);
      if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
    }

    function _arrayLikeToArray(arr, len) {
      if (len == null || len > arr.length) len = arr.length;

      for (var i = 0, arr2 = new Array(len); i < len; i++) {
        arr2[i] = arr[i];
      }

      return arr2;
    }

    var room_token = prompt("Please enter your room key: ", "");
    var speaker_token = prompt("Please enter your user token: ", "");
    var toContinue = true;

    if (String(room_token).length <= 0 || !room_token) {
      alert("Ensure that your roomToken is filled up. Please try again!");
      toContinue = false;
    }

    if (toContinue) {
      var socket = io.connect( //connection with the server for enterRoom event
      "https://vcxtension.herokuapp.com/rooms", {
        query: {
          roomToken: room_token,
          speakerToken: speaker_token || null
        }
      });
      socket.on("error", function (msg) {
        alert("Something went wrong! ".concat(msg));
      });
      socket.on("initHandshake", function (msg) {
        if (msg.type === "pass") {
          //passed enterRoom event.
          alert("Congrats you entered the room: ".concat(room_token)); //------ setting "global" variables -----

          var modelPromise = qna.load(); //loading the model.
          //get question from html//

          var input = document.getElementById('question'); //start listening button for stt//

          var speakerButton = document.getElementById('start-button'); //transcript from stt//

          var result = document.getElementById('result'); //eric's main thing//

          var main = document.getElementsByTagName("main")[0]; //button you click to run process() in model//

          var textButton = document.getElementById('search'); //transcript in local storage for model//

          contextDiv = document.getElementById('result'); //answer outputed by model//

          answerDiv = document.getElementById('answer'); //------ setting localStorage items -------

          localStorage.setItem('VCXroomToken', String(msg.payload.roomToken));
          localStorage.setItem('VCXroomTranscript', String(msg.payload.transcript));
          localStorage.setItem('VCXroomName', String(msg.payload.roomName));

          if (msg.payload.proStatus !== undefined) {
            localStorage.setItem('VCXproStatus', String(msg.payload.proStatus));
          }

          if (msg.payload.speaker !== undefined && msg.payload.speaker === true) {
            localStorage.setItem('VCXspeakerStatus', String(msg.payload.speaker));
            var speakerStatusToBeDisplayed = document.createTextNode("Speaker");
            document.body.appendChild(speakerStatusToBeDisplayed);
            chrome.tabs.query({
              url: "https://meet.google.com/*"
            }, function (tabs) {
              var _iterator = _createForOfIteratorHelper(tabs),
                  _step;

              try {
                for (_iterator.s(); !(_step = _iterator.n()).done;) {
                  tab = _step.value;
                  chrome.tabs.sendMessage(tab.id, {
                    "message": "start"
                  });
                }
              } catch (err) {
                _iterator.e(err);
              } finally {
                _iterator.f();
              }
            });
          } //displaying roomName


          var roomNameToBeDisplayed = document.createTextNode(localStorage.getItem('VCXroomName'));
          document.body.appendChild(roomNameToBeDisplayed); //----- model goes here... -----
          //let modelPromise = {};

          var search; //let input;

          var contextDiv;
          var answerDiv;

          var process = /*#__PURE__*/function () {
            var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(questionText) {
              var escalate, model, answers;
              return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                  switch (_context.prev = _context.next) {
                    case 0:
                      escalate = false;
                      _context.next = 3;
                      return modelPromise;

                    case 3:
                      model = _context.sent;
                      _context.next = 6;
                      return model.findAnswers(questionText, localStorage.getItem('VCXroomTranscript'));

                    case 6:
                      answers = _context.sent;
                      console.log(answers);
                      console.log(answers.slice(0, 1));
                      answerMaxConfidence = answers.slice(0, 1);

                      if (answerMaxConfidence[0].score > 0) {
                        //score is above some arbitrary confidence value
                        answerDiv.innerHTML = answerMaxConfidence.map(function (answer) {
                          return answer.text;
                        }).join('<br><br>'); //check if tts

                        socket.emit("checkStatus", localStorage.getItem('VCXproStatus'));
                        socket.on("checkStatusCleared", function (resMsg) {
                          if (answerMaxConfidence[0].text) {
                            var toSay = answerMaxConfidence[0].text.trim();
                            var utterance = new SpeechSynthesisUtterance(toSay);
                            speechSynthesis.speak(utterance);
                          }
                        }); //either way still display answer...

                        answerDiv.innerHTML = answerMaxConfidence[0].text;
                      } else {
                        //escalate
                        socket.emit("checkStatus", localStorage.getItem('VCXproStatus'));
                        socket.on("checkStatusCleared", function (resMsg) {
                          socket.emit("escalationRequest", [localStorage.getItem('VCXproStatus'), String(questionText)]);
                          socket.on("escalationRequestCleared", function (escMsg) {
                            answerDiv.innerHTML = "Your question ".concat(questionText, " has been sent to the speaker!");
                          });
                          socket.on("escalationRequestFailed", function (escMsg) {
                            alert(escMsg[1].errorMessage);
                          });
                        });
                      }

                    case 11:
                    case "end":
                      return _context.stop();
                  }
                }
              }, _callee);
            }));

            return function process(_x) {
              return _ref.apply(this, arguments);
            };
          }(); //------ stt stuff... -------


          var listening = false;
          var questionText;
          var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

          if (typeof SpeechRecognition !== "undefined") {
            var recognition = new SpeechRecognition();

            var stop = function stop() {
              main.classList.remove("speaking");
              recognition.stop();
              speakerButton.textContent = "Start listening";
            };

            var start = function start() {
              main.classList.add("speaking");
              recognition.start();
              speakerButton.textContent = "Stop listening";
            };

            var onResult = function onResult(event) {
              //result.innerHTML = "";
              questionText = "";

              var _iterator2 = _createForOfIteratorHelper(event.results),
                  _step2;

              try {
                for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
                  var res = _step2.value;
                  questionText = questionText.concat(String(res[0].transcript));

                  if (res.isFinal) {
                    questionText = questionText.concat(".");
                  }
                }
              } catch (err) {
                _iterator2.e(err);
              } finally {
                _iterator2.f();
              }
            };

            recognition.continuous = true;
            recognition.interimResults = true;
            recognition.addEventListener("result", onResult);
            speakerButton.addEventListener("click", function (event) {
              //listening ? stop() : start();
              event.preventDefault();
              alert("cool");

              if (listening) {
                stop();
                listening = false;
                process(questionText);
              } else {
                socket.emit("checkStatus", localStorage.getItem('VCXproStatus'));
                socket.on("checkStatusFailed", function (resMsg) {
                  alert(resMsg[1].errorMessage);
                });
                socket.on("checkStatusCleared", function (resMsg) {
                  start();
                  listening = true;
                  console.log("Is listening", listening);
                });
              }
            });
          } else {
            speakerButton.remove();
            var message = document.getElementById("message");
            message.removeAttribute("hidden");
            message.setAttribute("aria-hidden", "false");
          }

          textButton.addEventListener("click", function (event) {
            event.preventDefault();
            questionText = prompt("Please enter your question: ", "");
            process(questionText);
          }); //------- all the transcript update stuff -------

          chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
            if (request.newTranscript && request.newTranscript !== "") {
              if (localStorage.getItem("VCXspeakerStatus") === true) {
                socket.emit("transcriptUpdate", request.newTranscript);
              }
            }
          });
          socket.on("transcriptUpdateCleared", function (transcriptMsg) {
            //global for all users
            localStorage.setItem('VCXroomTranscript', transcriptMsg.payload.transcript);
          });
          socket.on("transcriptUpdateFailed", function (transcriptMsg) {
            console.log(transcriptMsg);
          });
        }
      });
    }
    /*
    // if free only have stt peaker
    window.addEventListener('DOMContentLoaded', () => {
    
    });
    
    //only available for pro participants//
    window.addEventListener('DOMContentLoaded', () => {
        const result = document.getElementById('result');
        const form = document.getElementById('voice-form');
        const speak = document.getElementById('speak-button');
    
        if(form){
            form.addEventListener('submit', event => {
                event.preventDefault();
                const toSay = result.innerHTML.trim();
                const utterance = new SpeechSynthesisUtterance(toSay);
                speechSynthesis.speak(utterance);
                result.value = '';
              });
        }
    })
    
    
    
    window.onload = () => {
      //load model//
      modelPromise = qna.load();
      //question - manually inputed//
      input = document.getElementById('question');
      //search button//
      search = document.getElementById('search');
      //transcript in local storage//
      contextDiv = document.getElementById('result');
      answerDiv = document.getElementById('answer');
      search.onclick = process;
    };*/

  }, {
    "process": "../../../../../../../../../../../usr/local/lib/node_modules/parcel/node_modules/process/browser.js"
  }],
  "../../../../../../../../../../../usr/local/lib/node_modules/parcel/src/builtins/hmr-runtime.js": [function (require, module, exports) {
    var global = arguments[3];
    var OVERLAY_ID = '__parcel__error__overlay__';
    var OldModule = module.bundle.Module;

    function Module(moduleName) {
      OldModule.call(this, moduleName);
      this.hot = {
        data: module.bundle.hotData,
        _acceptCallbacks: [],
        _disposeCallbacks: [],
        accept: function accept(fn) {
          this._acceptCallbacks.push(fn || function () {});
        },
        dispose: function dispose(fn) {
          this._disposeCallbacks.push(fn);
        }
      };
      module.bundle.hotData = null;
    }

    module.bundle.Module = Module;
    var checkedAssets, assetsToAccept;
    var parent = module.bundle.parent;

    if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
      var hostname = "" || location.hostname;
      var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
      var ws = new WebSocket(protocol + '://' + hostname + ':' + "49484" + '/');

      ws.onmessage = function (event) {
        checkedAssets = {};
        assetsToAccept = [];
        var data = JSON.parse(event.data);

        if (data.type === 'update') {
          var handled = false;
          data.assets.forEach(function (asset) {
            if (!asset.isNew) {
              var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

              if (didAccept) {
                handled = true;
              }
            }
          }); // Enable HMR for CSS by default.

          handled = handled || data.assets.every(function (asset) {
            return asset.type === 'css' && asset.generated.js;
          });

          if (handled) {
            console.clear();
            data.assets.forEach(function (asset) {
              hmrApply(global.parcelRequire, asset);
            });
            assetsToAccept.forEach(function (v) {
              hmrAcceptRun(v[0], v[1]);
            });
          } else if (location.reload) {
            // `location` global exists in a web worker context but lacks `.reload()` function.
            location.reload();
          }
        }

        if (data.type === 'reload') {
          ws.close();

          ws.onclose = function () {
            location.reload();
          };
        }

        if (data.type === 'error-resolved') {
          console.log('[parcel] ✨ Error resolved');
          removeErrorOverlay();
        }

        if (data.type === 'error') {
          console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
          removeErrorOverlay();
          var overlay = createErrorOverlay(data);
          document.body.appendChild(overlay);
        }
      };
    }

    function removeErrorOverlay() {
      var overlay = document.getElementById(OVERLAY_ID);

      if (overlay) {
        overlay.remove();
      }
    }

    function createErrorOverlay(data) {
      var overlay = document.createElement('div');
      overlay.id = OVERLAY_ID; // html encode message and stack trace

      var message = document.createElement('div');
      var stackTrace = document.createElement('pre');
      message.innerText = data.error.message;
      stackTrace.innerText = data.error.stack;
      overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
      return overlay;
    }

    function getParents(bundle, id) {
      var modules = bundle.modules;

      if (!modules) {
        return [];
      }

      var parents = [];
      var k, d, dep;

      for (k in modules) {
        for (d in modules[k][1]) {
          dep = modules[k][1][d];

          if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
            parents.push(k);
          }
        }
      }

      if (bundle.parent) {
        parents = parents.concat(getParents(bundle.parent, id));
      }

      return parents;
    }

    function hmrApply(bundle, asset) {
      var modules = bundle.modules;

      if (!modules) {
        return;
      }

      if (modules[asset.id] || !bundle.parent) {
        var fn = new Function('require', 'module', 'exports', asset.generated.js);
        asset.isNew = !modules[asset.id];
        modules[asset.id] = [fn, asset.deps];
      } else if (bundle.parent) {
        hmrApply(bundle.parent, asset);
      }
    }

    function hmrAcceptCheck(bundle, id) {
      var modules = bundle.modules;

      if (!modules) {
        return;
      }

      if (!modules[id] && bundle.parent) {
        return hmrAcceptCheck(bundle.parent, id);
      }

      if (checkedAssets[id]) {
        return;
      }

      checkedAssets[id] = true;
      var cached = bundle.cache[id];
      assetsToAccept.push([bundle, id]);

      if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
        return true;
      }

      return getParents(global.parcelRequire, id).some(function (id) {
        return hmrAcceptCheck(global.parcelRequire, id);
      });
    }

    function hmrAcceptRun(bundle, id) {
      var cached = bundle.cache[id];
      bundle.hotData = {};

      if (cached) {
        cached.hot.data = bundle.hotData;
      }

      if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
        cached.hot._disposeCallbacks.forEach(function (cb) {
          cb(bundle.hotData);
        });
      }

      delete bundle.cache[id];
      bundle(id);
      cached = bundle.cache[id];

      if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
        cached.hot._acceptCallbacks.forEach(function (cb) {
          cb();
        });

        return true;
      }
    }
  }, {}]
}, {}, ["../../../../../../../../../../../usr/local/lib/node_modules/parcel/src/builtins/hmr-runtime.js", "background.js"], null);