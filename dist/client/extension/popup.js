"use strict";

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

//seems like normal javascript also works. ++ use some chrome extension only APIs. https://developer.chrome.com/extensions/api_index
//links to the popup.html
document.addEventListener("DOMContentLoaded", function () {
  //const bg = chrome.extension.getBackgroundPage();
  //alert(bg);
  // do smth... the line above links
  alert("hello");
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
        alert("Congrats you entered the room: ".concat(room_token)); //const modelPromise = qna.load(); //loading the model.
        //get question from html//

        var input = document.getElementById('question'); //start listening button for stt//

        var speakerButton = document.getElementById('start-button'); //transcript from stt//

        var result = document.getElementById('result'); //eric's main thing//

        var main = document.getElementsByTagName("main")[0]; //button you click to run process() in model//

        var textButton = document.getElementById('search'); //transcript in local storage for model//

        var contextDiv = document.getElementById('result'); //answer outputed by model//

        var answerDiv = document.getElementById('answer'); //room name outputted

        var roomname = document.getElementById('roomname'); //userstatus outputted

        var userstatus = document.getElementById('usertype'); //setting up all the localstorage stuff....

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
        } //----- model goes here... -----
        //let modelPromise = {};


        var search; //let input;
        //let contextDiv;
        //let answerDiv;

        var process = /*#__PURE__*/function () {
          var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(questionText) {
            var escalate;
            return regeneratorRuntime.wrap(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    escalate = false; //const model = await modelPromise;

                    /*chrome.storage.local.get(['VCXroomTranscript'], function(result) {
                      const answers = await model.findAnswers(questionText, result.VCXroomTranscript);
                    });
                    console.log(answers);
                    console.log(answers.slice(0,1));
                    //answerMaxConfidence = answers.slice(0,1);*/
                    //console.log("In process, ", questionText);

                    answerMaxConfidence = [{
                      text: "Hello",
                      score: "11"
                    }];

                    if (answerMaxConfidence[0].score > 0) {
                      //score is above some arbitrary confidence value
                      answerDiv.innerHTML = answerMaxConfidence.map(function (answer) {
                        return answer.text;
                      }).join('<br><br>'); //check if tts

                      chrome.storage.local.get(['VCXproStatus'], function (result) {
                        socket.emit("checkStatus", result.VCXproStatus);
                      });
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

                  case 3:
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
          console.log(transcriptMsg);
        });
      }
    });
  }
});
/*
socket.on("initHandshake", (msg)=> {
  if (msg.type === "pass"){ //passed enterRoom event.
    alert(`Congrats you entered the room: ${room_token}`);
    chrome.storage.local.set({"VCXroomToken": String(msg.payload.roomToken)}, function() {
        console.log('Room Token is stored in localstorage.');
    });
    chrome.storage.local.get("VCXroomToken", function(result){
      console.log(result)
    })
    //------ setting "global" variables -----
    const modelPromise = qna.load(); //loading the model.
    //get question from html//
    const input = document.getElementById('question');
    //start listening button for stt//
    const speakerButton = document.getElementById('start-button');
    //transcript from stt//
    const result = document.getElementById('result');
    //eric's main thing//
    const main = document.getElementsByTagName("main")[0];
    //button you click to run process() in model//
    const textButton = document.getElementById('search');
    //transcript in local storage for model//
    const contextDiv = document.getElementById('result');
    //answer outputed by model//
    const answerDiv = document.getElementById('answer');
    //room name outputted
    const roomname = document.getElementById('roomname');
    //userstatus outputted
    //const userstatus = document.getElementById('usertype');
     //------ setting localStorage items -------
    localStorage.setItem('VCXroomToken', String(msg.payload.roomToken));
    alert(msg.payload.roomToken);
     localStorage.setItem('VCXroomTranscript', String(msg.payload.transcript));
    localStorage.setItem('VCXroomName', String(msg.payload.roomName));
    if (msg.payload.proStatus !== undefined){
      localStorage.setItem('VCXproStatus', String(msg.payload.proStatus));
    }
    if (msg.payload.speaker !== undefined && msg.payload.speaker === true){
      localStorage.setItem('VCXspeakerStatus', String(msg.payload.speaker));
      userstatus.innerHTML = "Speaker";
      chrome.tabs.query({url: "https://meet.google.com/*"}, function(tabs) {
        for (tab of tabs){
          chrome.tabs.sendMessage(tab.id, {"message": "start"});
        }
      });
    }
    //displaying roomName
    roomname.innerHTML = localStorage.getItem('VCXroomName');
     //----- model goes here... -----
     //let modelPromise = {};
    let search;
    //let input;
    let contextDiv;
    let answerDiv;
     const process = async (questionText) => {
      let escalate = false;
      const model = await modelPromise;
      const answers = await model.findAnswers(questionText, localStorage.getItem('VCXroomTranscript'));
      console.log(answers);
      console.log(answers.slice(0,1));
      answerMaxConfidence = answers.slice(0,1);
      if (answerMaxConfidence[0].score > 0){ //score is above some arbitrary confidence value
        answerDiv.innerHTML = answerMaxConfidence.map(answer => answer.text).join('<br><br>');
        //check if tts
        socket.emit("checkStatus", localStorage.getItem('VCXproStatus'));
        socket.on("checkStatusCleared", (resMsg)=>{
          if(answerMaxConfidence[0].text){
            const toSay = answerMaxConfidence[0].text.trim();
            const utterance = new SpeechSynthesisUtterance(toSay);
            speechSynthesis.speak(utterance);
          }
        });
        //either way still display answer...
        answerDiv.innerHTML = answerMaxConfidence[0].text;
      } else {
        //escalate
        socket.emit("checkStatus", localStorage.getItem('VCXproStatus'));
        socket.on("checkStatusCleared", (resMsg)=>{
          socket.emit("escalationRequest", [localStorage.getItem('VCXproStatus'), String(questionText)]);
          socket.on("escalationRequestCleared", (escMsg)=>{
            answerDiv.innerHTML = `Your question ${questionText} has been sent to the speaker!`;
          });
          socket.on("escalationRequestFailed", (escMsg)=>{
            alert(escMsg[1].errorMessage);
          });
        });
      }
    };
     //------ stt stuff... -------
    let listening = false;
    let questionText;
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (typeof SpeechRecognition !== "undefined") {
      const recognition = new SpeechRecognition();
       const stop = () => {
        main.classList.remove("speaking");
        recognition.stop();
        speakerButton.textContent = "Start listening";
      };
       const start = () => {
        main.classList.add("speaking");
        recognition.start();
        speakerButton.textContent = "Stop listening";
      };
       const onResult = event => {
        //result.innerHTML = "";
        questionText = "";
        for (const res of event.results) {
          questionText = questionText.concat(String(res[0].transcript));
          if (res.isFinal) {
            questionText = questionText.concat(".");
          }
        }
      };
       recognition.continuous = true;
      recognition.interimResults = true;
      recognition.addEventListener("result", onResult);
      speakerButton.addEventListener("click", event => {
        //listening ? stop() : start();
        event.preventDefault();
        alert("cool");
        if (listening){
          stop();
          listening = false;
          process(questionText);
        } else {
          socket.emit("checkStatus", localStorage.getItem('VCXproStatus'));
          socket.on("checkStatusFailed", (resMsg)=>{
            alert(resMsg[1].errorMessage);
          });
          socket.on("checkStatusCleared", (resMsg)=>{
            start();
            listening = true;
            console.log("Is listening", listening);
          });
        }
      });
    } else {
      speakerButton.remove();
      const message = document.getElementById("message");
      message.removeAttribute("hidden");
      message.setAttribute("aria-hidden", "false");
    }
    textButton.addEventListener("click", event=>{
      event.preventDefault();
      questionText = prompt("Please enter your question: ", "");
      process(questionText);
    });
     //------- all the transcript update stuff -------
    /*
    chrome.runtime.onMessage.addListener(
      function(request, sender, sendResponse) {
        if(request.newTranscript && request.newTranscript !== "") {
          if (localStorage.getItem("VCXspeakerStatus") === true){
            socket.emit("transcriptUpdate", request.newTranscript);
          }
        }
      }
    );*/

/*
          socket.on("transcriptUpdateCleared", (transcriptMsg)=>{ //global for all users
            localStorage.setItem('VCXroomTranscript', transcriptMsg.payload.transcript);
          });
          socket.on("transcriptUpdateFailed", (transcriptMsg)=>{console.log(transcriptMsg)});
        }
      })
    }
});*/

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

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(request);
    if(request.newTranscript && request.newTranscript !== "") {
      chrome.storage.local.get(['VCXspeakerStatus'], function(result) {
        //console.log('Value currently is ' + result.key);
        console.log(result.VCXspeakerStatus)
        if (result.VCXspeakerStatus === true){
          //socket.emit("transcriptUpdate", request.newTranscript);
          alert(request.newTranscript);
        }
      });
    }
  }
);

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