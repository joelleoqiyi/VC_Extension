"use strict";

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

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
        chrome.tabs.sendMessage("start", {
          "message": "start"
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

          var _iterator = _createForOfIteratorHelper(event.results),
              _step;

          try {
            for (_iterator.s(); !(_step = _iterator.n()).done;) {
              var res = _step.value;
              //const text = document.createTextNode(res[0].transcript);
              //const p = document.createElement("p");
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
      });
      chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
        if (request.newTranscript && request.newTranscript !== "") {
          if (localStorage.getItem("VCXspeakerStatus")) {
            socket.emit("transcriptUpdate", request.newTranscript);
          }
        }
      });
      socket.on("transcriptUpdateCleared", function (transcriptMsg) {
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