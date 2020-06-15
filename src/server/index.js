//importing neccessary functions from other supporting files
import 'babel-polyfill'; //to allow babel to transpile async/await
import {queryDocument, updateDocument} from './misc/db';
import {port} from './misc/config'
import {createRoom} from './route/createRoom'
import {auth, room} from './misc/config'
import {authPro} from './route/authPro'
import {dataPro} from './route/dataPro'
import {signUp} from './route/signUp'

//declaring variables, npm packages
const assert = require("assert");
const bodyParser = require('body-parser');
const express = require("express");

//initialising server and socket.io connection
const app = express();
const cors = require("cors");
const http = require("http").createServer(app)
const io = require("socket.io")(http);

//setting up server "settings"
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use('/create', createRoom);
app.use('/auth', authPro);
app.use('/data', dataPro);
app.use('/register', signUp);
http.listen(port, () => {
  console.log(`listening to port ${port}`)
});
//socket.io connection listeners
io.use((socket, next) => {
  let roomToken = socket.handshake.query.roomToken === ("null" || null)
                     ? null
                     : socket.handshake.query.roomToken;
  if (roomToken !== null){
    (async ()=>{
      let res = await queryDocument(
        room,
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
  console.log(`\(NEW\): ${socket.id} is connected on /rooms/${socket.roomToken}`);
  socket.join(socket.roomToken);
  (async () => {
    let res = await queryDocument(
        room,
        [{"roomKey": socket.roomToken}],
        ["roomKey", "proStatus", "transcript", "speaker.sid", "speaker.initialised", "speaker.token"]
    );
    let isPro = (res.proStatus === true) ? true : false;
    if (res.speaker.sid === null && res.speaker.initialised === false && res.speaker.token !== undefined && res.speaker.token !== null){
        if (socket.speakerToken === res.speaker.token){
            isSpeaker = true;
            let updateRes = await updateDocument(
                room,
                {"roomKey": socket.roomToken},
                {
                    "speaker.sid": socket.id,
                    "speaker.initialised": true
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
    let toBePayload = {
                "roomToken": res.roomKey,
                "transcript": res.transcript || "",
                "proStatus": res.proStatus || false,
                "speaker": isSpeaker
        }
    Object.keys(toBePayload).forEach(function (key) {
        if (toBePayload[key] === false) {
            delete toBePayload[key];
        }
    });
    socket.emit(
        "initHandshake",
        {
            "type": "pass",
            "payload": toBePayload
        }
    );
    console.log(`\(PASS\) initHandshakeCleared`);
  })().catch(err => console.error(`\(ERROR\) Error during HandShake: ${err}`));

  socket.on("escalationRequest", ([proStatus, escalation])=>{
    if (!proStatus || !escalation) {
      if (!proStatus){
         socket.emit(
             "escalationRequestFailed",
             {
                 "type": "argumentInvalid",
                 "errorMessage": "proStatus argument invalid OR PRO (mode) not enabled"
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
      return;
    }
    (async ()=>{
        let res = await queryDocument(
            room,
            [{"roomKey": socket.roomToken}],
            ["proStatus", "roomKey", "speaker.sid", "speaker.initialised"]
        );
        if (res && res.roomKey === socket.roomToken){
            if (res.proStatus === true) {
              if (res.speaker.initialised === true && res.speaker.sid){
                  socket.broadcast.to(res.speaker.sid).emit(
                      "escalationRequestSent",
                      {
                          "type": "pass",
                          "payload": escalation
                      }
                  );
                  if (socket.id !== res.speaker.sid){
                    socket.emit(
                        "escalationRequestCleared",
                        {
                              "type": "pass",
                              "payload": "Your question has been sent to speaker"
                        }
                    );
                  }
                  console.log(`\(PASS\) escalationRequestCleared`);
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
    if (!update) {
       socket.emit(
           "transcriptUpdateFailed",
           {
               "type": "argumentInvalid",
               "errorMessage": "update argument invalid"
           }
       );
       console.log(`\(FAILED\) transcriptUpdate: update invalid argument\n\tupdate: ${update}\n\tsocket.id: ${socket.id}`);
       return;
    }
    (async ()=>{
        let res = await queryDocument(
            room,
            [{"roomKey": socket.roomToken}],
            ["roomKey", "speaker.sid", "speaker.initialised", "transcript"]
        );
        if (res && res.roomKey === socket.roomToken){
            if (res.speaker.initialised === true && res.speaker.sid === socket.id){
                let updateString = String(update);
                let transcript = (res.transcript !== null && res.transcript !== undefined)
                                   ? String(res.transcript)
                                   : ""
                let tobeUpdated = transcript.concat(updateString);
                let updateRes = await updateDocument(
                    room,
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
                console.log(`\(FAILED\) transcriptUpdate: speakerValidation failed\n\tres: ${JSON.stringify(res)}\n\tsocket.id: ${socket.id}`);
            }
        } else {
            socket.emit(
                "transcriptUpdateFailed",
                {
                    "type": "roomValidationFailed",
                    "errorMessage": "The room you are currently in does not exist"
                }
            );
            console.log(`\(FAILED\) transcriptUpdate: roomValidation failed\n\tres: ${JSON.stringify(res)}\n\tsocket.id: ${socket.id}`);
        }
    })().catch(err => console.error(`\(ERROR\) transcriptUpdate:\n\t${err}`));
  });

  socket.on("checkStatus", (proStatus) =>{

    if (!proStatus){
        socket.emit(
            "checkStatusFailed",
            {
                "type": "argumentInvalid",
                "errorMessage": "proStatus argument invalid OR PRO (mode) not enabled"
            }
        );
        console.log(`\(FAILED\) checkStatus: proStatus invalid argument\n\tproStatus: ${proStatus}\n\tsocket.id: ${socket.id}`);
        return;
    }
    (async ()=>{
        let res = await queryDocument(
            room,
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
});
