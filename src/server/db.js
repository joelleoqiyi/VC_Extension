const MongoClient = require('mongodb').MongoClient;
const assert = require("assert");
import "babel-polyfill";
//import {uri} from './config';

//const connectionString = 'mongodb+srv://6vMgDwr0U6ieKiX:IxWdJ9IcEBqrHNW@vcxtension-v7tcr.mongodb.net/test?retryWrites=true&w=majority';

async function testdb(uri){
        let client = await MongoClient.connect(uri,
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
           console.log(`res => ${JSON.stringify(res)}`);
           console.log("hello");
        }
        finally {
            client.close();
        }
        return "hello";
}
//)().catch(err => console.error(err));


export {testdb};
