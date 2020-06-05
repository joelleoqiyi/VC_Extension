import 'babel-polyfill'; //to allow babel to transpile async/await
const express = require("express");
const app = express();
const port = 3000;
const http = require("http").createServer()
const io = require("socket.io")(http);
const assert = require("assert");
import {queryDocument, deleteDocument, newDocument, updateDocument} from './db';


io.use((socket, next) => {
  let roomToken = socket.handshake.query.roomToken === ("null" || null)
                     ? null
                     : socket.handshake.query.roomToken;
  if (roomToken !== null){
    (async ()=>{
      let res = await queryDocument(
        "roomData",
        [{"roomKey": roomToken}],
        ["roomKey"]
      );
      if (res && res.roomKey === roomToken){
        console.log(`\(PASS\) enterRoomCleared`);
        return next()
      } else {
        console.log(`\(FAILED\) enterRoom: roomValidation failed\n\troomToken: ${roomToken}\n\tsocket.id: ${socket.id}`);
        return next(new Error("Room Token Invalid"));
      }
    })().catch(err => console.error(`\(ERROR\) enterRoom:\n\t${err}`));
  } else {
    console.log(`\(FAILED\) enterRoom: roomValidation empty\n\troomToken: ${roomToken}\n\tsocket.id: ${socket.id}`);
    return next(new Error("Room Token Empty"))
  }
});

io.of("/rooms").on("connection", (socket) => {
  let isSpeaker;
  socket.roomToken = socket.handshake.query.roomToken || null;
  socket.speakerToken = socket.handshake.query.speakerToken === ("null" || null)
                     ? null
                     : socket.handshake.query.speakerToken;
  console.log(`newClient: ${socket.id} is connected on /rooms/${socket.roomToken}`);
  socket.join(socket.roomToken);
  (async () => {
    let res = await queryDocument(
        "roomData",
        [{"roomKey": socket.roomToken}],
        ["roomKey", "proStatus", "transcript", "speaker.sid", "speaker.initalised", "speaker.token"]
    );
    if (res.speaker.sid === null && res.speaker.initialised === false && res.speaker.token !== undefined && res.speaker.token !== null){
        if (socket.speakerToken === res.speaker.token){
            isSpeaker = true;
            let updateRes = await updateDocument(
                "roomData", 
                {"roomKey": socket.roomToken},
                {
                    "speaker.sid": socket.id, 
                    "speaker.initalised": true
                }
            );
            if (updateRes === 1){
                io.of('/rooms').to(socket.roomToken).emit(
                    "speakerEnteredCleared",
                    {
                        "type": "pass",
                        "payload": "speaker is here"
                    }
                );
                console.log(`\(PASS\) speakerEnteredCleared`);
            } else {
                socket.emit(
                    "speakerEnteredFailed",
                    {
                        "type": "databaseUpdateFailed",
                        "errorMessage": "Database failed to register your entry. Please try again"
                    }
                );
                console.log(`\(FAILED\) speakerEntered: updateRes failed to update\n\tupdateRes: ${updateRes}\n\tsocket.id: ${socket.id}`);
            }
        } else {
            isSpeaker = false;
        }
    }
    socket.emit(
        "initHandshake",
        {
            "type": "pass",
            "payload": 
                {
                    "roomKey": res.roomKey,
                    "proStatus": res.proStatus || false,
                    "transcript": res.transcript,
                    "speaker": isSpeaker
                }
        }
    );
    console.log(`\(PASS\) initHandshakeCleared`);
  })().catch(err => console.error(`Error during HandShake: ${err}`));

  socket.on("escalationRequest", (proStatus, escalation)=>{
    if (!proStatus || !escalation) {
      if (!proStatus){
         socket.emit(
             "escalationRequestFailed",
             {
                 "type": "argumentInvalid",
                 "errorMessage": "proStatus argument invalid"
             }
         );
        console.log(`\(FAILED\) escalationRequest: proStatus invalid argument\n\tproStatus: ${proStatus}\n\tsocket.id: ${socket.id}`);
      } 
      if (!escalation) {
         socket.emit(
             "escalationRequestFailed",
             {  
                 "type": "argumentInvalid",
                 "errorMessage": "escalation argument invalid"
             }
         );
         console.log(`\(FAILED\) escalationRequest: escalation invalid argument\n\tescalation: ${escalation}\n\tsocket.id: ${socket.id}`);
      }
      continue;
    }
    (async ()=>{
        let res = await queryDocument(
            "roomData",
            [{"roomKey": socket.roomToken}],
            ["proStatus", "roomKey", "speaker.sid", "speaker.initialised"]
        );
        if (res && res.roomKey === socket.roomToken){
            if (res.proStatus === true) {
              if (res.speaker.initialised === true && res.speaker.sid){
                  io.to(res.speaker.sid).emit(
                      "escalationRequestCleared",
                      {
                          "type": "pass",
                          "payload": escalation
                      }
                      console.log(`\(PASS\) escalationRequestCleared`);
                  );
              } else { 
                  socket.emit(
                      "escalationRequestFailed",
                      {
                         "type": "speakerValidationFailed",
                         "errorMessage": "The speaker is not in the room"
                      }
                  );
                  console.log(`\(FAILED\) escalationRequest: speakerValidation failed\n\tres: ${JSON.stringify(res)}\n\tsocket.id: ${socket.id}`);
              }
           } else {
               socket.emit(
                   "escalationRequestFailed", 
                   {
                      "type": "statusValidationFailed",
                      "errorMessage": "This session does not have PRO (mode) enabled. Please ask your query yourself"
                   }
               );
               console.log(`\(FAILED\) escalationRequest: statusValidation failed\n\tres: ${JSON.stringify(res)}\n\tsocket.id: ${socket.id}`);
           }
        } else {
            socket.emit(
                "escalationRequestFailed",
                {
                    "type": "roomValidationFailed",
                    "errorMessage": "The room you are currently in does not exist"
                }
            );
            console.log(`\(FAILED\) escalationRequest: roomValidation failed\n\tres: ${JSON.stringify(res)}\n\tsocket.id: ${socket.id}`);
        }
    })().catch(err => console.error(`\(ERROR\) escalationRequest\n\t${err}`));
  });

  socket.on("transcriptUpdate", (update)=>{
    (!update)
       ? socket.emit("transcriptUpdateFailed", "update argument invalid")
       : continue
    (async ()=>{
        let res = await queryDocument(
            "roomData",
            [{"roomKey": socket.roomToken}],
            ["roomKey", "speaker.sid", "speaker.initialised", "transcript"] 
        );
        if (res && res.roomKey === socket.roomToken){
            if (res.speaker.initialised === true && res.speaker.sid === socket.id){
                let updateString = String(update);
                let transcript = String(res.transcript);
                let tobeUpdated = transcript.concat(updateString);
                let updateRes = await updateDocument(
                    "roomData", 
                    {"roomKey": socket.roomToken},
                    {"transcript": tobeUpdated}
                );
                if (updateRes === 1){
                    io.of('/rooms').to(socket.roomToken).emit(
                            "transcriptUpdateCleared",
                            {
                                "type": "pass",
                                "payload": tobeUpdated
                            }
                    );
                    console.log(`\(PASS\) transcriptUpdateCleared`);
                } else {
                    socket.emit(
                        "transcriptUpdateFailed", 
                        {
                           "type": "databaseUpdateFailed",
                           "errorMessage": "Please speak slower. Database is not updated with new transcript"
                        }
                    );
                    console.log(`\(FAILED\) transcriptUpdate: updateRes failed to update\n\tres: ${JSON.stringify(res)}\n\tupdateRes: ${updateRes}\n\tsocket.id: ${socket.id}`);
                }
            } else {
                socket.emit(
                    "transcriptUpdateFailed", 
                    {
                        "type": "speakerValidationFailed",
                        "errorMessage": "You will not be able to update the transcript unless you are the speaker"
                    }
                );
                console.log(`\(FAILED\) transcriptUpdate: speakerValidation failed\n\tres: ${JSON.stringify(res)}\n\tupdateRes: ${updateRes}\n\tsocket.id: ${socket.id}`);
            }
        } else {
            socket.emit(
                "transcriptUpdateFailed",
                {
                    "type": "roomValidationFailed",
                    "errorMessage": "The room you are currently in does not exist"
                }
            );
            console.log(`\(FAILED\) transcriptUpdate: roomValidation failed\n\tres: ${JSON.stringify(res)}\n\tupdateRes: ${updateRes}\n\tsocket.id: ${socket.id}`);
        }
    })().catch(err => console.error(`\(ERROR\) transcriptUpdate:\n\t${err}`));
  });

  socket.on("checkStatus", (proStatus) =>{
      
    if (!proStatus){
        socket.emit(
            "checkStatusFailed",
            {
                "type": "argumentInvalid",
                "errorMessage": "proStatus argument invalid"
            }
        );
        console.log(`\(FAILED\) checkStatus: proStatus invalid argument\n\tproStatus: ${proStatus}\n\tsocket.id: ${socket.id}`);
        continue;
    } 
    (async ()=>{
        let res = await queryDocument(
            "roomData",
            [{"roomKey": socket.roomToken}],
            ["proStatus", "roomKey"]
        );
        if (res && res.roomKey === socket.roomToken){
           if (res.proStatus === true) {
                socket.emit(
                    "checkStatusCleared",
                    {
                        "type": "pass",
                        "payload": socket.id
                    }
                );
                console.log(`\(PASS\) checkStatusCleared`);
           } else {
                socket.emit(
                    "checkStatusFailed", 
                    {
                        "type": "statusValidationFailed",
                        "errorMessage": "This session does not have PRO (mode) enabled"
                    }
                );
                console.log(`\(FAILED\) checkStatus: statusValidation failed\n\tres: ${JSON.stringify(res)}\n\tsocket.id: ${socket.id}`);
           }
        } else {
            socket.emit(
                "checkStatusFailed", 
                {
                    "type": "roomValidationFailed",
                    "errorMessage": "The room you are currently in does not exist"
                }
            );
            console.log(`\(FAILED\) checkStatus: roomValidation failed\n\tresStatus: ${JSON.stringify(res)}\n\tsocket.id: ${socket.id}`);
        }
    })().catch(err => console.error(`\(ERROR\) checkStatus:\n\t${err}`));
  });


http.listen(port, () => {
  console.log("listening to port 3000")
});

//------------------------ REDACTED --------------------------//
// io.of('/rooms').to(socket.roomToken).emit("newUser", "new user entered room");
  /*socket.on("joinRoom", (room) => {
    if (chatrooms.includes(room)){
      socket.join(room);
      io.of("/games").to(room).emit("newUser", "new user joined games UWU");
      return socket.emit("success", "successfully joined room")
    } else {
      socket.emit("error", "no room name");
    }
  });
*/
  /*socket.on("test", (msg) => {
    socket.username = msg;
    console.log(socket.username); //can set your own socket.username since it is a dictionary uwu
    socket.emit("testsuccess", "working");
  });
});*/

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

