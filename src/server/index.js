import 'babel-polyfill'; //to allow babel to transpile async/await
const express = require("express");
const app = express();
const port = 3000;
const http = require("http").createServer()
const io = require("socket.io")(http);
const assert = require("assert");
import {queryDocument, deleteDocument, newDocument, updateDocument, newIndex} from './db';



/*
(async () => {
  let hello = await queryDocument("roomData",[{"roomKey": "249f9e3"},{"speaker.sid": "99ijgj9"}], ["speaker.sid","proStatus","roomKey"]);
  //await deleteDocuments();
  //let hello = await updateDocument("roomData", {"roomKey": "249f9e3"}, {"speaker.sid": "9i9ijgj9", "proStatus": true});
  //let hello = await newDocument("roomData",[{"sid":"858030","token":"r55m4m3","initialised":false},'249f9e3',null, false])
  //let hello = await deleteDocuments([{"roomKey":"249f9e3d"}])
  //let hello = await newIndex("roomData", [{"roomKey": 1}])
  //await console.log(typeof hello);
  await console.log(hello === null?"null is good": hello.speaker.sid)
})().catch(err => console.error(err));
*/




io.use((socket, next) => {
  let roomToken = socket.handshake.query.roomToken === ("null" || null)
                     ? null
                     : socket.handshake.query.roomToken;
  if (roomToken !== null){
    (async ()=>{
      let res = await queryDocument(
        "roomData",[{"roomKey": roomToken}],["roomKey", "speaker.token"]
      );
      if (res && res.roomKey === roomToken){
        return next()
      } else {
        return next(new Error("Room Token Invalid"));
      }
    })().catch(err => console.error(err));
  } else {
    return next(new Error("Room Token Empty"))
  }
});

io.of("/rooms").on("connection", (socket) => {
  let roomToken = socket.handshake.query.roomToken || null;
  console.log("new client connected");
  socket.join(roomToken);
  socket.emit("sucess", 1);
  io.of('/rooms').to(roomToken).emit("newUser", roomToken);
  /*socket.on("joinRoom", (room) => {
    if (chatrooms.includes(room)){
      socket.join(room);
      io.of("/games").to(room).emit("newUser", "new user joined games UWU");
      return socket.emit("success", "successfully joined room")
    } else {
      socket.emit("error", "no room name");
    }
  });*/
  /*socket.on("test", (msg) => {
    socket.username = msg;
    console.log(socket.username); //can set your own socket.username since it is a dictionary uwu
    socket.emit("testsuccess", "working");
  });*/
});

/*
const teststorage = []
io.on("connection", (socket) => {
  teststorage.push(socket.id);
  console.log("connection is successful for test socket");
  socket.emit("test","successful recieving");
  socket.on("gimmemsg", (msg)=>{
    io.to(teststorage[0]).emit("greetings", "hello");
  });
})
*/

http.listen(port, () => {
  console.log("listening to port 3000")
});
