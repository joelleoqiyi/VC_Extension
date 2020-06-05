const io = require("socket.io-client");
const assert = require("assert");
const AssertionError = require('assert').AssertionError;
//password: "r55m4m3"

//normal users
let socket = io.connect(
  "http://localhost:3000/rooms",{
  query: {
    roomToken: "249f9e3",
    speakerToken: null
  }
});

//socket.emit("joinRoom");
socket.on("successHandshake", (msg) => {
        console.log(msg);
})
socket.emit("checkStatus");
socket.on("newUser", (msg) => {console.log(msg);})
socket.on("error", (msg)=>{console.log(msg);})
socket.on("queryFailed", (msg)=>{console.log(msg);})
socket.on("proStatusFailed", (msg)=>{console.log(msg);})
socket.on("proStatusCleared",(msg)=>{console.log(msg);})
/*
let sockets = io.connect(
  "http://localhost:3000/rooms",{
  query: {
    roomToken: "gjej396",
    speakerToken: null
  }
});

sockets.on("successHandshake", (msg) => {
        console.log(msg);
})
*/
/*
let socket = io.connect("http://localhost:3000")
socket.emit("gimmemsg", "gimmmmmeeee msg");
socket.on("test", (msg) => {
  console.log(msg);
});
socket.on("greetings", (msg) => {
  console.log(msg);
});

socket.on("error", (e)=>{console.log(e);})
*/


/*
try {
  assert.equal("9", "0", "hello this is error");
} catch (e) {
  console.log(e);
}
*/


/*
let socket = io.connect("http://localhost:3000/games");

socket.on("hello", (data) => {
  console.log(data);
})
socket.emit("joinRoom", "a3k5")
socket.on("success", (msg) => {console.log(msg);});
socket.on("error", (msg) => {console.log(msg);})
socket.on("newUser", (msg) => {
  console.log(msg);
});
*/
