//importing neccessary functions from supporting files
import {uri, dName} from './config'
import {getCurrDate} from './date'
import "babel-polyfill";

//declaring variables, npm packages
const MongoClient = require('mongodb').MongoClient;
const assert = require("assert");

//database functions
async function connectRemote(){
  let client = await MongoClient.connect(uri, {useUnifiedTopology: true, useNewUrlParser: true });
  return client;
}

async function connectCollection(client, cName){
  let db = client.db(dName);
  let collection = db.collection(cName)
  return {db, collection};
}

async function queryDocument(cName, queryArray, projectArray){
  let ret;
  let projectionArray = {_id: 0};
  const client = await connectRemote();
  let project = (projectArray === undefined) ? false : true
  try {
    const {db, collection} = await connectCollection(client, cName);
    (project)
      ? projectArray.forEach(project => projectionArray[project] = 1)
      : null;
    const queryRes = await collection.find({$and: queryArray});
    const projectRes = (project && queryRes !== [])
                         ? await queryRes.project(projectionArray)
                         : queryRes;
    const dbRes = await projectRes.toArray()
    ret = (dbRes.length === 0) ? null : dbRes[0];
  } catch (e) {
    console.log(e);
  } finally {
    client.close();
  }
  return ret;
}

async function deleteDocuments(cName, queryArray){
  let ret;
  const client = await connectRemote();
  try {
    const {db, collection} = await connectCollection(client, cName);
    const res = await collection.deleteMany({$and: queryArray})
    ret = res.result.ok;
  } catch (e) {
    console.log(e);
  } finally {
    client.close();
  }
  return ret;
}

async function newDocument(cName, insertionString){
  let ret;
  const client = await connectRemote();
  try {
    const {db, collection} = await connectCollection(client, cName);
    /*let insertionString = {speaker, roomKey, transcript, proStatus,
        expirationDate: getCurrDate(5)
    }*/
    const res = await collection.insertOne(insertionString);
    ret = res.result.ok;
  } catch (e) {
    console.log(e)
  } finally {
    client.close()
  }
  return ret;
}

async function updateDocument(cName, queryArray, updateArray, pushArray){
  let ret;
  const client = await connectRemote();
  try {
    const {db, collection} = await connectCollection(client, cName);
    let finalUpdateArray = {}
    if (updateArray !== undefined && updateArray !== null){
        finalUpdateArray["$set"] = updateArray;
    }
    if (pushArray !== undefined && pushArray !== null){
        finalUpdateArray["$push"] = pushArray
    }
    if (Object.keys(finalUpdateArray)){
        const res = await collection.updateOne(queryArray, finalUpdateArray);
        ret = res.result.ok;
    }
  } catch (e) {
    console.log(e);
  } finally {
    client.close();
  }
  return ret;
}
async function newIndex(cName,indexArray){
  let ret;
  const client = await connectRemote();
  try {
    const {db, collection} = await connectCollection(client, cName);
    ret = await collection.createIndex(indexArray);
  } catch (e) {
    console.log(e);
  } finally {
    client.close();
  }
  return ret;
}

export {queryDocument, deleteDocuments, newDocument, updateDocument, newIndex};
