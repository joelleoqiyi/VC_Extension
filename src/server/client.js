const io = require("socket.io-client");
const assert = require("assert");
const AssertionError = require('assert').AssertionError;

try {
  assert.equal("9", "0", "hello this is error");
} catch (e) {
  console.log(e);
}

console.log("hello");

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

socket.emit("test", "helloworld");
socket.on("testsuccess", (msg) => {console.log(msg);})
*/
/*let socket = io.connect(
  "http://localhost:3000",{
  query: {
    token: "something fun :)"
  }
});*/

let socket = io.connect("http://localhost:3000")
socket.emit("gimmemsg", "gimmmmmeeee msg");
socket.on("test", (msg) => {
  console.log(msg);
});
socket.on("greetings", (msg) => {
  console.log(msg);
});

socket.on("error", (e)=>{console.log(e);})
