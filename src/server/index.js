//[1, 2, 3].map((value) => console.log("Mapping value ", value));
//console.log("test");
//import fs from 'fs'
import {test} from './hello'
test();
var port = 3000;
const express = require('express')
const app = express()
 
app.get('/', function (req, res) {
  res.send('Hello World')
})
 
app.listen(3000, () => console.log(`Example app listening at http://localhost:${port}`))
