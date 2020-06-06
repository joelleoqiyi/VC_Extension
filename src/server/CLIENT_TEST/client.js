//form submission
$('#submitButton').click(function(){
    $.post("http://localhost:3000/create",
    {
        transcript: "smth... ",
        proStatus: true
    },
    function(data, status){
        console.log("Data: " + data[1].payload.roomToken + data[1].payload.speakerToken + "\nStatus: " + status);
    });
});

//normal users 
let socket = io.connect(
  "http://localhost:3000/rooms",{
  query: {
    roomToken: "249f9e3",
    speakerToken: null 
  }
});

//Example Usage
socket.on("initHandshake", (msg)=> {
        console.log(msg)
        socket.emit("transcriptUpdate", "helloworld!");
        socket.emit("escalationRequest", [msg.payload.proStatus, "hello world!"]);
        socket.emit("checkStatus", msg.payload.proStatus);
});
socket.on("speakerEnteredCleared", (msg)=>{console.log(msg)});
socket.on("transcriptUpdateCleared", (msg)=>{console.log(msg)});
socket.on("transcriptUpdateFailed", (msg)=>{console.log(msg)});
socket.on("escalationRequestCleared", (msg)=>{console.log(msg)});
socket.on("escalationRequestSent", (msg)=>{console.log(msg)});
socket.on("escalationRequestFailed", (msg)=>{console.log(msg)});
socket.on("checkStatusCleared", (msg)=>{console.log(msg)});

