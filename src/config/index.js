require('dotenv').config();

const config = {
  DB_HOST: process.env.DB_HOST,
  MONGO_URI: process.env.MONGO_URI,
  PORT: 5000,
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
};
module.exports = { config };
