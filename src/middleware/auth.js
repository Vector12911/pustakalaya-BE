import jwt from 'jsonwebtoken';
import config from '../config/index.js';

const { ACCESS_TOKEN_SECRET } = config;
export const verifyAuth = async (req, res, next) => {
  try {
    const accessToken = req.cookies['access'];
    if (!accessToken) {
      const error = new Error('Unauthorized acc');
      throw error;
    }

    const decoded = jwt.verify(accessToken, ACCESS_TOKEN_SECRET);

    // const key = generate_redis_key({ email, jti: origin_jti });

    // const is_blacklisted = (await client.get(key)) !== null;

    // if (is_blacklisted) {
    //   throw new Error('Revoked access token');
    // }
    req.user = decoded;
    next();
  } catch (err) {
    console.log('failed verifying at ...');
    console.log(err.message);

    res.statusCode = 401;
    res.json({ status: false, message: err.message });
  }
};
