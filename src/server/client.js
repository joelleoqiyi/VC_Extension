const io = require("socket.io-client");
const assert = require("assert");
const AssertionError = require('assert').AssertionError;
//password: "r55m4m3"

//normal users
let socket = io.connect(
  "http://localhost:3000/rooms",{
  query: {
    roomToken: "249f93",
    speakerToken: null
  }
});

socket.emit("joinRoom");
socket.on("sucess", (msg) => {console.log(msg);})
socket.on("newUser", (msg) => {console.log(msg);})
socket.on("error", (msg)=>{console.log(msg);})

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
