// const jwt = require('jsonwebtoken');
// const { config } = require('../config');
import jwt from 'jsonwebtoken';
import config from '../config/index.js';
const {
  REFRESH_TOKEN_SECRET,
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_EXPIRY,
  ACCESS_TOKEN_EXPIRY,
} = config;

const defaultCookieOptions = {
  httpOnly: true,
  secure: config.isProduction,
  sameSite: config.isProduction ? 'strict' : 'lax',
  domain: config.BASE_DOMAIN,
  path: '/',
};

const refreshTokenCookieOptions = {
  ...defaultCookieOptions,
  maxAge: parseInt(REFRESH_TOKEN_EXPIRY),
};

const accessTokenCookieOptions = {
  ...defaultCookieOptions,
  maxAge: parseInt(ACCESS_TOKEN_EXPIRY),
};
export const generateToken = (payload, secret_key, exp) => {
  const options = { expiresIn: exp, issuer: 'pustakalaya-api' };
  const token = jwt.sign({ ...payload }, secret_key, options);
  return token;
};
export const setTokens = (res, access, refresh) => {
  res.cookie('access', access, accessTokenCookieOptions);
  if (refresh) {
    res.cookie('refresh', refresh, refreshTokenCookieOptions);
  }
};
export const clearTokens = (res) => {
  res.cookie('access', '', { ...defaultCookieOptions, maxAge: 0 });
  res.cookie('refresh', '', { ...defaultCookieOptions, maxAge: 0 });
};
export const verifyRefreshToken = async (refreshToken) => {
  try {
    const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
    return decoded;
  } catch (err) {
    console.log(err.message);
    return { status: false, message: err.message };
  }
};
// module.exports = {
//   generateToken: (payload, secret_key, exp) => {
//     const options = { expiresIn: exp, issuer: 'pustakalaya-api' };
//     const token = jwt.sign({ ...payload }, secret_key, options);
//     return token;
//   },
//   setTokens: (res, access, refresh) => {
//     res.cookie('access', access, accessTokenCookieOptions);
//     if (refresh) {
//       res.cookie('refresh', refresh, refreshTokenCookieOptions);
//     }
//   },
//   clearTokens: (res) => {
//     res.cookie('access', '', { ...defaultCookieOptions, maxAge: 0 });
//     res.cookie('refresh', '', { ...defaultCookieOptions, maxAge: 0 });
//   },
//   verifyAuth: async (req, res, next) => {
//     try {
//       const accessToken = req.cookies['access'];
//       if (!accessToken) {
//         const error = new Error('Unauthorized acc');
//         throw error;
//       }

//       const decoded = jwt.verify(accessToken, ACCESS_TOKEN_SECRET);

//       // const key = module.exports.generate_redis_key({ email, jti: origin_jti });

//       // const is_blacklisted = (await client.get(key)) !== null;

//       // if (is_blacklisted) {
//       //   throw new Error('Revoked access token');
//       // }
//       req.user = decoded;
//       next();
//     } catch (err) {
//       console.log('failed verifying at ...');
//       console.log(err.message);

//       res.statusCode = 401;
//       res.json({ status: false, message: err.message });
//     }
//   },

//   verifyRefreshToken: async (refreshToken) => {
//     try {
//       const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
//       return decoded;
//     } catch (err) {
//       console.log(err.message);
//       return { status: false, message: err.message };
//     }
//   },
// };
