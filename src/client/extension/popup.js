//seems like normal javascript also works. ++ use some chrome extension only APIs. https://developer.chrome.com/extensions/api_index
//links to the popup.html

document.addEventListener("DOMContentLoaded", function ()  {
    //const bg = chrome.extension.getBackgroundPage();
    //alert(bg);
    // do smth... the line above links
    alert("hello");
    var room_token = prompt("Please enter your room key: ", "");
    var speaker_token = prompt("Please enter your user token: ", "");

    let toContinue = true;
    if (String(room_token).length <= 0 || !room_token){
      alert("Ensure that your roomToken is filled up. Please try again!");
      toContinue = false;
    }

    if (toContinue){
      let socket = io.connect( //connection with the server for enterRoom event
        "https://vcxtension.herokuapp.com/rooms",{
        query: {
          roomToken: room_token,
          speakerToken: speaker_token || null
        }
      });
      socket.on("error", msg => {alert(`Something went wrong! ${msg}`);});
      socket.on("initHandshake", (msg) => {
        if (msg.type === "pass"){ //passed enterRoom event.
          alert(`Congrats you entered the room: ${room_token}`);

          //const modelPromise = qna.load(); //loading the model.
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
          const userstatus = document.getElementById('usertype');

          //setting up all the localstorage stuff....
          chrome.storage.local.set({"VCXroomToken": String(msg.payload.roomToken)}, function() {
              console.log('Room Token is stored in localstorage.');
          });
          chrome.storage.local.set({"VCXroomTranscript": String(msg.payload.transcript)}, function() {
              console.log('Transcript is stored in localstorage.');
          });
          chrome.storage.local.set({"VCXroomName": String(msg.payload.roomName)}, function() {
              console.log('Room Name is stored in localstorage.');
              roomname.innerHTML = `Room Name: ${msg.payload.roomName}`;
          });
          if (msg.payload.proStatus !== undefined){
            chrome.storage.local.set({"VCXproStatus": String(msg.payload.proStatus)}, function() {
              console.log("PRO status is stored in localStorage");
            });
          }
          if (msg.payload.speaker !== undefined && msg.payload.speaker === true){
            userstatus.innerHTML = "Speaker";
            chrome.storage.local.set({"VCXspeakerStatus": String(msg.payload.speaker)}, function() {
              console.log('speakerStatus is stored in localstorage.');
              chrome.tabs.query({url: "https://meet.google.com/*"}, function(tabs) { //https://meet.google.com/*
                  chrome.tabs.sendMessage(tabs[0].id, {"message": "start"});
              });
            });
          } else {
            chrome.storage.local.set({"VCXspeakerStatus": false});
          }

          //----- model goes here... -----

          //let modelPromise = {};
          let search;
          //let input;
          //let contextDiv;
          //let answerDiv;

          const process = async (questionText) => {
            let escalate = false;
            //const model = await modelPromise;
            /*chrome.storage.local.get(['VCXroomTranscript'], function(result) {
              const answers = await model.findAnswers(questionText, result.VCXroomTranscript);
            });
            console.log(answers);
            console.log(answers.slice(0,1));
            //answerMaxConfidence = answers.slice(0,1);*/
            //console.log("In process, ", questionText);
            answerMaxConfidence = [{text: "Hello", score:"11"}];
            if (answerMaxConfidence[0].score > 0){ //score is above some arbitrary confidence value
              answerDiv.innerHTML = answerMaxConfidence.map(answer => answer.text).join('<br><br>');
              //check if tts
              chrome.storage.local.get(['VCXproStatus'], function(result) {
                socket.emit("checkStatus", result.VCXproStatus);
              });
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
              chrome.storage.local.get(['VCXproStatus'], function(result) {
                socket.emit("checkStatus", result.VCXproStatus);
              });
              socket.on("checkStatusCleared", (resMsg)=>{
                socket.emit("escalationRequest", [true, String(questionText)]);
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
              event.preventDefault();
              if (listening){
                alert("VCXtension is processing your question");
                stop();
                listening = false;
                console.log(questionText);
                process(questionText);
              } else {
                chrome.storage.local.get(['VCXproStatus'], function(result) {
                  socket.emit("checkStatus", result.VCXproStatus);
                });
                socket.on("checkStatusFailed", (resMsg)=>{
                  alert(resMsg[1].errorMessage);
                });
                socket.on("checkStatusCleared", (resMsg)=>{
                  alert("VCXtension is listening to your question");
                  start();
                  listening = true;
                  console.log("Is listening", listening);
                });
              }
              console.log("overall: ",listening);
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


          setInterval(()=>{
            chrome.storage.local.get(['VCXspeakerStatus'], function(result) {
              if (result.VCXspeakerStatus === "true") {
                console.log(result.VCXspeakerStatus);
                chrome.tabs.query({url: "https://meet.google.com/*"}, function(tabs) {
                     chrome.tabs.sendMessage(tabs[0].id, {message: "listening"}, function(capturedValue) {
                        console.log(capturedValue);
                        socket.emit("transcriptUpdate", capturedValue);
                     });
                 });
              }
            });
         },5000);

         socket.on("transcriptUpdateCleared", (transcriptMsg)=>{ //global for all users
           chrome.storage.local.set({"VCXroomTranscript": String(transcriptMsg.payload.transcript)}, function() {
               console.log('New Transcript is stored in localstorage.');
           });
         });
         socket.on("transcriptUpdateFailed", (transcriptMsg)=>{console.log(transcriptMsg)});
        }
      })
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
