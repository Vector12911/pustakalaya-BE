const jwt = require('jsonwebtoken');
const ObjectID = require('mongodb').ObjectID;
const UAParser = require('ua-parser-js');

const config = require('../../config/config');
const client = require('../../config/init_redis');

const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = config;

module.exports = {
  generate_token: (payload, secret_key, exp) => {
    const options = { expiresIn: exp, issuer: 'pustakalaya-api' };
    const token = jwt.sign({ ...payload }, secret_key, options);
    return token;
  },

  verify_auth: async (req, res, next) => {
    try {
      if (req.is_optional_auth && !req.headers.authorization) {
        return next();
      }
      if (!req.headers['authorization']) {
        const error = new Error('Unauthorized');
        throw error;
      }
      const auth_header = req.headers['authorization'];
      let access_token = auth_header.split(' ');
      access_token = access_token[1];
      const decoded = jwt.verify(access_token, ACCESS_TOKEN_SECRET);

      const { origin_jti, email } = decoded;

      // const key = module.exports.generate_redis_key({ email, jti: origin_jti });

      // const is_blacklisted = (await client.get(key)) !== null;

      // if (is_blacklisted) {
      //   throw new Error('Revoked access token');
      // }
      // req.user = { ...decoded, user_id: new ObjectID(decoded.user_id) };
      next();
    } catch (err) {
      console.log(err);
      res.statusCode = 401;
      res.json({ status: false, message: err.message });
    }
  },

  verify_refresh_token: async (refresh_token) => {
    try {
      const payload = jwt.verify(refresh_token, REFRESH_TOKEN_SECRET);
      return { status: true, message: 'success', results: payload };
    } catch (err) {
      console.log(err);
      return { status: false, message: err.message };
    }
  },
};
