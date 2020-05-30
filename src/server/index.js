//[1, 2, 3].map((value) => console.log("Mapping value ", value));
//console.log("test");
//import fs from 'fs'
/*import {} from './socketcreate'
test();
var port = 3000;
const express = require('express')
const app = express()

app.get('/', function (req, res) {
  res.send('Hello World')
})

app.listen(3000, () => console.log(`Example app listening at http://localhost:${port}`))
*/
// ----
import 'babel-polyfill'; //to allow babel to transpile async/await
const chatrooms = ["a3k5", "4fg6"];
const express = require("express");
const app = express();
const port = 3000;
const http = require("http").createServer()
const io = require("socket.io")(http);
const MongoClient = require('mongodb').MongoClient;
const assert = require("assert");
import {testdb} from './db';
import {uri} from './config';



(async () => {
  let hello = await testdb(uri);
  await console.log(hello);
})();
/*
async function finDB(){
  const uri = "mongodb+srv://6vMgDwr0U6ieKiX:IxWdJ9IcEBqrHNW@vcxtension-v7tcr.mongodb.net/test?retryWrites=true&w=majority";
  const client = new MongoClient(uri, { useNewUrlParser: true });
  setTimeout(()=>{console.log("client is closing?");}, 5000);
  const hello = await client.connect(err => {
    const collection = client.db("test").collection("test");
    // perform actions on the collection object
    collection.find({}).toArray(function(err, docs) {
        assert.equal(err, null);
        console.log("Found the following records");
        console.log(docs)
        //callback(docs);
      });
    setTimeout(()=>{client.close(); console.log("client is closed");}, 5000);
    //client.close();
  });
  console.log(hello)
}
*/
//finDB();

/*const connectionString = 'mongodb+srv://6vMgDwr0U6ieKiX:IxWdJ9IcEBqrHNW@vcxtension-v7tcr.mongodb.net/test?retryWrites=true&w=majority';

(async () => {
        let client = await MongoClient.connect(connectionString,
            { useNewUrlParser: true });

        let db = client.db('test');
        try {
           const res = await db.collection("test").find({}).toArray(); //returns a promise :)
           /*function(err, docs) {
               assert.equal(err, null);
               console.log("Found the following records");
               console.log(docs)
               //callback(docs);
            }*/
/*
           console.log(`res => ${JSON.stringify(res)}`);
           console.log("hello");
        }
        finally {
            client.close();
        }
    })()
        .catch(err => console.error(err));
*/
/*io.use((socket, next) => {
  let token = socket.handshake.query.token;
  console.log(token);
  return next(new Error("hello"));
});*/
/*
io.of("/games").on("connection", (socket) => {
  socket.emit("hello", "hello from the other side");
  console.log("new client connected");
  socket.on("joinRoom", (room) => {
    if (chatrooms.includes(room)){
      socket.join(room);
      io.of("/games").to(room).emit("newUser", "new user joined games UWU");
      return socket.emit("success", "successfully joined room")
    } else {
      socket.emit("error", "no room name");
    }
  });
  socket.on("test", (msg) => {
    socket.username = msg;
    console.log(socket.username); //can set your own socket.username since it is a dictionary uwu
    socket.emit("testsuccess", "working");
  });
});
*/
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


http.listen(port, () => {
  console.log("listening to port 3000")
});
*/
