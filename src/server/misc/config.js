const dotenv = require('dotenv');
dotenv.config();
module.exports = {
  room: process.env.DB_cName_1,
  auth: process.env.DB_cName_2,
  dName: process.env.DB_dName,
  uri: process.env.DB_URI,
  port: process.env.PORT || 80
};
