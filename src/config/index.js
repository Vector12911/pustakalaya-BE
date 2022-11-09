import * as dotenv from 'dotenv';
dotenv.config();
const config = {
  isProduction: process.env.NODE_ENV === 'production',
  MONGO_URI: process.env.MONGO_URI,
  CLIENT_URL: process.env.CLIENT_URL,
  BASE_DOMAIN: process.env.BASE_DOMAIN,
  PORT: 5000,
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRY: process.env.ACCESS_TOKEN_EXPIRY,
  REFRESH_TOKEN_EXPIRY: process.env.REFRESH_TOKEN_EXPIRY,
  REFRESH_IF_LESS_THAN: process.env.REFRESH_IF_LESS_THAN,
};
export default config;
