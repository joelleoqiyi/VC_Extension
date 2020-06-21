/*

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
      contextDiv = document.getElementById('result');
      //answer outputed by model//
      answerDiv = document.getElementById('answer');
      //room name outputted
      roomname = document.getElementById('roomname');
      //userstatus outputted
      userstatus = document.getElementById('usertype');

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
      chrome.runtime.onMessage.addListener(
        function(request, sender, sendResponse) {
          if(request.newTranscript && request.newTranscript !== "") {
            if (localStorage.getItem("VCXspeakerStatus") === true){
              socket.emit("transcriptUpdate", request.newTranscript);
            }
          }
        }
      );
      socket.on("transcriptUpdateCleared", (transcriptMsg)=>{ //global for all users
        localStorage.setItem('VCXroomTranscript', transcriptMsg.payload.transcript);
      });
      socket.on("transcriptUpdateFailed", (transcriptMsg)=>{console.log(transcriptMsg)});
    }
  })
}
*/




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
