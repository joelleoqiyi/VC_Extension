document.addEventListener("DOMContentLoaded", function ()  {
    alert("hello");
    var room_token = prompt("Please enter your room key: ", "");
    var speaker_token = prompt("Please enter your user token: ", "");

    let toContinue = true;
    if (String(room_token).length <= 0 || !room_token){
      alert("Ensure that your roomToken is filled up. Please try again!");
      toContinue = false;
    }

    if (toContinue){
      const roomname = document.getElementById('roomname');
      roomname.innerHTML = "Room is loading...";
      let socket = io.connect(
        "https://vcxtension.herokuapp.com/rooms",{
        query: {
          roomToken: room_token,
          speakerToken: speaker_token || null
        }
      });
      socket.on("error", msg => {alert(`Something went wrong! ${msg}`);});
      socket.on("initHandshake", (msg) => {
        if (msg.type === "pass"){
          alert(`Congrats you entered the room: ${room_token}`);

          const modelPromise = qna.load();
          const speakerButton = document.getElementById('start-button');
          const result = document.getElementById('result');
          const textButton = document.getElementById('search');
          const answerDiv = document.getElementById('answer');
          const userstatus = document.getElementById('usertype');

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

          let search;

          const process = async (questionText) => {
            let escalate = false;
            const model = await modelPromise;
			let transcriptx = "";
            chrome.storage.local.get(['VCXroomTranscript'], function(result) {
              transcriptx = result.VCXroomTranscript;
            });
			console.log(transcriptx)
			const answers = await model.findAnswers(questionText, transcriptx);
            console.log(answers == []);
			console.log(answers)
            console.log(answers.slice(0,1));
            answerMaxConfidence = answers.slice(0,1);
			if (answers[0] == undefined) {
				answerMaxConfidence = [{text:questionText, score: -1}];
				console.log(answerMaxConfidence);
			}
            if (answerMaxConfidence[0].score > 0){
              answerDiv.innerHTML = answerMaxConfidence.map(answer => answer.text).join('<br><br>');
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
              answerDiv.innerHTML = answerMaxConfidence[0].text;
            } else {
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

		  let listening = false;
          let questionText;
          const SpeechRecognition =
            window.SpeechRecognition || window.webkitSpeechRecognition;
          if (typeof SpeechRecognition !== "undefined") {
            const recognition = new SpeechRecognition();

            const stop = () => {
              recognition.stop();
              speakerButton.textContent = "Start listening";
            };

            const start = () => {
              recognition.start();
              speakerButton.textContent = "Stop listening";
            };

            const onResult = event => {
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
         socket.on("transcriptUpdateFailed", (transcriptMsg)=>{
           alert(`Something went wrong! ${transcriptMsg.errorMessage}`);
         });
         socket.on("escalationRequestSent", (msg)=>{
           chrome.storage.local.get(['VCXspeakerStatus'], function(result) {
             if (result.VCXspeakerStatus === "true" || result.VCXspeakerStatus === true) {
               answerDiv.innerHTML = `Someone asked a question: ${msg.payload}`;
             }
           });
         });
        }
      })
    }
});
