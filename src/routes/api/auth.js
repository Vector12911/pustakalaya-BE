const express = require('express');
require('dotenv').config();
let router = express.Router();
const { User } = require('../../models/user_model');
const { register } = require('../../controllers/auth');

router.post('/register', register);

router.route('/:userId').get(async (req, res) => {
  try {
    const userData = await User.checkUser(req.params.userId);
    res.status(200).send(userData);
  } catch (error) {
    res.status(400).json({ message: 'Error', error: error });
  }
});

module.exports = router;
