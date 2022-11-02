const { User } = require('../models/user_model');
const { generate_token } = require('../shared/tokens');
module.exports = {
  register: async (req, res) => {
    try {
      //1 check if user already exist
      const isUser = await User.checkUser(req.body.email);
      if (!!isUser) {
        res.status(200).json({ message: 'Email already exist' });
        return;
      }
      const user = new User(req.body);
      const doc = await user.save();
      console.log(doc);
      res.status(200).send(doc);
    } catch (error) {
      res.status(400).json({ message: 'Error', error: error });
    }
  },
  login: async (req, res) => {
    try {
      //1 check if user already exist
      const isUser = await User.checkUser(req.body.email);
      if (!isUser) {
        res.status(200).json({ message: 'User does not exist' });
        return;
      }
      // generate tokens
      res.status(200).send(doc);
    } catch (error) {
      res.status(400).json({ message: 'Error', error: error });
    }
  },
};
