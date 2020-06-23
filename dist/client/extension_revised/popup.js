"use strict";

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

document.addEventListener("DOMContentLoaded", function () {
  alert("hello");
  var room_token = prompt("Please enter your room key: ", "");
  var speaker_token = prompt("Please enter your user token: ", "");
  var toContinue = true;

  if (String(room_token).length <= 0 || !room_token) {
    alert("Ensure that your roomToken is filled up. Please try again!");
    toContinue = false;
  }

  if (toContinue) {
    var roomname = document.getElementById('roomname');
    roomname.innerHTML = "Room is loading...";
    var socket = io.connect("https://vcxtension.herokuapp.com/rooms", {
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
        alert("Congrats you entered the room: ".concat(room_token));
        var modelPromise = qna.load();
        var speakerButton = document.getElementById('start-button');
        var result = document.getElementById('result');
        var textButton = document.getElementById('search');
        var answerDiv = document.getElementById('answer');
        var userstatus = document.getElementById('usertype');
        chrome.storage.local.set({
          "VCXroomToken": String(msg.payload.roomToken)
        }, function () {
          console.log('Room Token is stored in localstorage.');
        });
        chrome.storage.local.set({
          "VCXroomTranscript": String(msg.payload.transcript)
        }, function () {
          console.log('Transcript is stored in localstorage.');
        });
        chrome.storage.local.set({
          "VCXroomName": String(msg.payload.roomName)
        }, function () {
          console.log('Room Name is stored in localstorage.');
          roomname.innerHTML = "Room Name: ".concat(msg.payload.roomName);
        });

        if (msg.payload.proStatus !== undefined) {
          chrome.storage.local.set({
            "VCXproStatus": String(msg.payload.proStatus)
          }, function () {
            console.log("PRO status is stored in localStorage");
          });
        }

        if (msg.payload.speaker !== undefined && msg.payload.speaker === true) {
          userstatus.innerHTML = "Speaker";
          chrome.storage.local.set({
            "VCXspeakerStatus": String(msg.payload.speaker)
          }, function () {
            console.log('speakerStatus is stored in localstorage.');
            chrome.tabs.query({
              url: "https://meet.google.com/*"
            }, function (tabs) {
              //https://meet.google.com/*
              chrome.tabs.sendMessage(tabs[0].id, {
                "message": "start"
              });
            });
          });
        } else {
          chrome.storage.local.set({
            "VCXspeakerStatus": false
          });
        }

        var search;

        var process = /*#__PURE__*/function () {
          var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(questionText) {
            var escalate, model, transcriptx, answers;
            return regeneratorRuntime.wrap(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    escalate = false;
                    _context.next = 3;
                    return modelPromise;

                  case 3:
                    model = _context.sent;
                    transcriptx = "";
                    chrome.storage.local.get(['VCXroomTranscript'], function (result) {
                      transcriptx = result.VCXroomTranscript;
                    });
                    console.log(transcriptx);
                    _context.next = 9;
                    return model.findAnswers(questionText, transcriptx);

                  case 9:
                    answers = _context.sent;
                    console.log(answers == []);
                    console.log(answers);
                    console.log(answers.slice(0, 1));
                    answerMaxConfidence = answers.slice(0, 1);

                    if (answers[0] == undefined) {
                      answerMaxConfidence = [{
                        text: questionText,
                        score: -1
                      }];
                      console.log(answerMaxConfidence);
                    }

                    if (answerMaxConfidence[0].score > 0) {
                      answerDiv.innerHTML = answerMaxConfidence.map(function (answer) {
                        return answer.text;
                      }).join('<br><br>');
                      chrome.storage.local.get(['VCXproStatus'], function (result) {
                        socket.emit("checkStatus", result.VCXproStatus);
                      });
                      socket.on("checkStatusCleared", function (resMsg) {
                        if (answerMaxConfidence[0].text) {
                          var toSay = answerMaxConfidence[0].text.trim();
                          var utterance = new SpeechSynthesisUtterance(toSay);
                          speechSynthesis.speak(utterance);
                        }
                      });
                      answerDiv.innerHTML = answerMaxConfidence[0].text;
                    } else {
                      chrome.storage.local.get(['VCXproStatus'], function (result) {
                        socket.emit("checkStatus", result.VCXproStatus);
                      });
                      socket.on("checkStatusCleared", function (resMsg) {
                        socket.emit("escalationRequest", [true, String(questionText)]);
                        socket.on("escalationRequestCleared", function (escMsg) {
                          answerDiv.innerHTML = "Your question ".concat(questionText, " has been sent to the speaker!");
                        });
                        socket.on("escalationRequestFailed", function (escMsg) {
                          alert(escMsg[1].errorMessage);
                        });
                      });
                    }

                  case 16:
                  case "end":
                    return _context.stop();
                }
              }
            }, _callee);
          }));

          return function process(_x) {
            return _ref.apply(this, arguments);
          };
        }();

        var listening = false;
        var questionText;
        var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

        if (typeof SpeechRecognition !== "undefined") {
          var recognition = new SpeechRecognition();

          var stop = function stop() {
            recognition.stop();
            speakerButton.textContent = "Start listening";
          };

          var start = function start() {
            recognition.start();
            speakerButton.textContent = "Stop listening";
          };

          var onResult = function onResult(event) {
            questionText = "";

            var _iterator = _createForOfIteratorHelper(event.results),
                _step;

            try {
              for (_iterator.s(); !(_step = _iterator.n()).done;) {
                var res = _step.value;
                questionText = questionText.concat(String(res[0].transcript));

                if (res.isFinal) {
                  questionText = questionText.concat(".");
                }
              }
            } catch (err) {
              _iterator.e(err);
            } finally {
              _iterator.f();
            }
          };

          recognition.continuous = true;
          recognition.interimResults = true;
          recognition.addEventListener("result", onResult);
          speakerButton.addEventListener("click", function (event) {
            event.preventDefault();

            if (listening) {
              alert("VCXtension is processing your question");
              stop();
              listening = false;
              console.log(questionText);
              process(questionText);
            } else {
              chrome.storage.local.get(['VCXproStatus'], function (result) {
                socket.emit("checkStatus", result.VCXproStatus);
              });
              socket.on("checkStatusFailed", function (resMsg) {
                alert(resMsg[1].errorMessage);
              });
              socket.on("checkStatusCleared", function (resMsg) {
                alert("VCXtension is listening to your question");
                start();
                listening = true;
                console.log("Is listening", listening);
              });
            }

            console.log("overall: ", listening);
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
        });
        setInterval(function () {
          chrome.storage.local.get(['VCXspeakerStatus'], function (result) {
            if (result.VCXspeakerStatus === "true") {
              console.log(result.VCXspeakerStatus);
              chrome.tabs.query({
                url: "https://meet.google.com/*"
              }, function (tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {
                  message: "listening"
                }, function (capturedValue) {
                  console.log(capturedValue);
                  socket.emit("transcriptUpdate", capturedValue);
                });
              });
            }
          });
        }, 5000);
        socket.on("transcriptUpdateCleared", function (transcriptMsg) {
          //global for all users
          chrome.storage.local.set({
            "VCXroomTranscript": String(transcriptMsg.payload.transcript)
          }, function () {
            console.log('New Transcript is stored in localstorage.');
          });
        });
        socket.on("transcriptUpdateFailed", function (transcriptMsg) {
          alert("Something went wrong! ".concat(transcriptMsg.errorMessage));
        });
        socket.on("escalationRequestSent", function (msg) {
          chrome.storage.local.get(['VCXspeakerStatus'], function (result) {
            if (result.VCXspeakerStatus === "true" || result.VCXspeakerStatus === true) {
              answerDiv.innerHTML = msg.payload;
            }
          });
        });
      }
    });
  }
});