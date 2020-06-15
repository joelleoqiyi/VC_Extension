"use strict";

//form submission
$('#submitButton').click(function () {
  /* $.post("http://localhost:3000/create",
   {
       transcript: "smth... ",
       proStatus: true,
       roomName: "hello world!",
       userToken: "8b8ac63"
   },
   function(data, status){
           console.log(data);
           //console.log("Data: " + data[1].payload.roomToken + data[1].payload.speakerToken + "\nStatus: " + status);
   });*/
  $.post("http://localhost:3000/register", {
    "username": "Joelleol",
    "password": "12345",
    "userToken": "dfIVc84",
    "paidStatus": true
  }, function (data, status) {
    console.log(data); //console.log("Data: " + data[1].payload.roomToken + data[1].payload.speakerToken + "\nStatus: " + status);
  });
}); //normal users

var socket = io.connect("http://localhost:3000/rooms", {
  query: {
    roomToken: "fx7mwBE",
    speakerToken: "ChMD1qB"
  }
}); //Example Usage

socket.on("initHandshake", function (msg) {
  console.log(msg);
  socket.emit("transcriptUpdate", "helloworld!");
  socket.emit("escalationRequest", [msg.payload.proStatus, "hello world!"]);
  socket.emit("checkStatus", msg.payload.proStatus);
});
socket.on("speakerEnteredCleared", function (msg) {
  console.log(msg);
});
socket.on("transcriptUpdateCleared", function (msg) {
  console.log(msg);
});
socket.on("transcriptUpdateFailed", function (msg) {
  console.log(msg);
});
socket.on("escalationRequestCleared", function (msg) {
  console.log(msg);
});
socket.on("escalationRequestSent", function (msg) {
  console.log(msg);
});
socket.on("escalationRequestFailed", function (msg) {
  console.log(msg);
});
socket.on("checkStatusCleared", function (msg) {
  console.log(msg);
});