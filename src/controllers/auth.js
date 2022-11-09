import bcrypt from 'bcrypt';
import { nanoid } from 'nanoid';
import { User } from '../models/user_model.js';
import config from '../config/index.js';

import {
  setTokens,
  verifyRefreshToken,
  clearTokens,
  generateToken,
} from '../shared/tokens.js';

const {
  REFRESH_TOKEN_SECRET,
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_EXPIRY,
  ACCESS_TOKEN_EXPIRY,
  REFRESH_IF_LESS_THAN,
} = config;

export const register = async (req, res) => {
  try {
    //1 check if user already exist
    const isUser = await User.checkUser(req.body.email);
    if (!!isUser) throw new Error('Email already exist');
    const hashedPassword = await bcrypt.hash(req.body.password, 12);
    const data = { ...req.body, password: hashedPassword };
    const user = new User(data);
    const doc = await user.save();
    //TODO: send an emeil
    res.status(200).send(doc);
  } catch (error) {
    res.status(400).json({ message: 'Error', error: error.message });
  }
};
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    //1 check if user already exist
    const user = await User.checkUser(email);
    if (!user) throw new Error('User does not exist');
    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new Error('Email or password is wrong');
    // generate tokens
    const userId = user._id;
    const version = user.tokenVersion;
    const jti = nanoid();
    const payload = { email, userId, version };
    const accessToken = generateToken(
      { ...payload, originJti: jti },
      ACCESS_TOKEN_SECRET,
      ACCESS_TOKEN_EXPIRY
    );
    const refreshToken = generateToken(
      { ...payload, jti },
      REFRESH_TOKEN_SECRET,
      REFRESH_TOKEN_EXPIRY
    );
    const data = {
      name: user.name,
      email,
      userId,
      accessToken,
      refreshToken,
    };
    setTokens(res, accessToken, refreshToken);
    res
      .status(200)
      .send({ status: true, message: 'successfully logedin', data });
  } catch (error) {
    res.status(400).json({ message: 'Error', error: error.message });
  }
};
export const logout = (req, res) => {
  clearTokens(res);
  res.end();
};

export const renewTokens = async (req, res) => {
  try {
    const token = req.cookies['refresh'];
    if (!token) throw new Error('Unauthorized');
    const current = await verifyRefreshToken(token);
    const user = await User.checkUser(current.email);
    if (!user) throw new Error('User does not exist');

    if (user.tokenVersion !== current.version) {
      throw new Error('Token revoked');
    }
    const { userId, jti, email, version } = current;
    // const userId = current.userId;
    // const jti = current.jti;
    const expiration = new Date(current.exp * 1000);
    const now = new Date();
    const secondsUntilExpiration =
      (expiration.getTime() - now.getTime()) / 1000;
    let refreshToken = null;
    const payload = { email, userId, version };
    // generate new refresh token if exp is less than 4days
    if (secondsUntilExpiration < parseInt(REFRESH_IF_LESS_THAN)) {
      refreshToken = generateToken(
        { ...payload, jti },
        REFRESH_TOKEN_SECRET,
        REFRESH_TOKEN_EXPIRY
      );
    }
    const accessToken = generateToken(
      { ...payload, originJti: jti },
      ACCESS_TOKEN_SECRET,
      ACCESS_TOKEN_EXPIRY
    );
    setTokens(res, accessToken, refreshToken);
    res.status(200).send({ status: true, message: 'successfully renewed..' });
  } catch (error) {
    console.log(error);
    clearTokens(res);
  }
  res.end();
};

// module.exports = {
//   register: async (req, res) => {
//     try {
//       //1 check if user already exist
//       const isUser = await User.checkUser(req.body.email);
//       if (!!isUser) throw new Error('Email already exist');
//       const hashedPassword = await bcrypt.hash(req.body.password, 12);
//       const data = { ...req.body, password: hashedPassword };
//       const user = new User(data);
//       const doc = await user.save();
//       //TODO: send an emeil
//       res.status(200).send(doc);
//     } catch (error) {
//       res.status(400).json({ message: 'Error', error: error.message });
//     }
//   },
//   login: async (req, res) => {
//     try {
//       const { email, password } = req.body;
//       //1 check if user already exist
//       const user = await User.checkUser(email);
//       if (!user) throw new Error('User does not exist');
//       const match = await bcrypt.compare(password, user.password);
//       if (!match) throw new Error('Email or password is wrong');
//       // generate tokens
//       const userId = user._id;
//       const version = user.tokenVersion;
//       const jti = nanoid();
//       const payload = { email, userId, version };
//       const accessToken = generateToken(
//         { ...payload, originJti: jti },
//         ACCESS_TOKEN_SECRET,
//         ACCESS_TOKEN_EXPIRY
//       );
//       const refreshToken = generateToken(
//         { ...payload, jti },
//         REFRESH_TOKEN_SECRET,
//         REFRESH_TOKEN_EXPIRY
//       );
//       const data = {
//         name: user.name,
//         email,
//         userId,
//         accessToken,
//         refreshToken,
//       };
//       setTokens(res, accessToken, refreshToken);
//       res
//         .status(200)
//         .send({ status: true, message: 'successfully logedin', data });
//     } catch (error) {
//       res.status(400).json({ message: 'Error', error: error.message });
//     }
//   },
//   logout: (req, res) => {
//     clearTokens(res);
//     res.end();
//   },
//   renewTokens: async (req, res) => {
//     try {
//       const token = req.cookies['refresh'];
//       if (!token) throw new Error('Unauthorized');
//       const current = await verifyRefreshToken(token);
//       const user = await User.checkUser(current.email);
//       if (!user) throw new Error('User does not exist');

//       if (user.tokenVersion !== current.version) {
//         throw new Error('Token revoked');
//       }
//       const { userId, jti, email, version } = current;
//       // const userId = current.userId;
//       // const jti = current.jti;
//       const expiration = new Date(current.exp * 1000);
//       const now = new Date();
//       const secondsUntilExpiration =
//         (expiration.getTime() - now.getTime()) / 1000;
//       let refreshToken = null;
//       const payload = { email, userId, version };
//       // generate new refresh token if exp is less than 4days
//       if (secondsUntilExpiration < parseInt(REFRESH_IF_LESS_THAN)) {
//         refreshToken = generateToken(
//           { ...payload, jti },
//           REFRESH_TOKEN_SECRET,
//           REFRESH_TOKEN_EXPIRY
//         );
//       }
//       const accessToken = generateToken(
//         { ...payload, originJti: jti },
//         ACCESS_TOKEN_SECRET,
//         ACCESS_TOKEN_EXPIRY
//       );
//       setTokens(res, accessToken, refreshToken);
//       res.status(200).send({ status: true, message: 'successfully renewed..' });
//     } catch (error) {
//       console.log(error);
//       clearTokens(res);
//     }
//     res.end();
//   },
// };
