const dotenv = require('dotenv');
dotenv.config();
module.exports = {
  //endpoint: process.env.API_URL,
  //masterKey: process.env.API_KEY,
  uri: process.env.DB_URI,
  port: process.env.PORT
};
