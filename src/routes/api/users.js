const express = require('express');
require('dotenv').config();
let router = express.Router();
const { User } = require('../../models/user_model');
const { grantAccess } = require('../../middleware/roles');

router.route('/register')
    .post(async (req, res) => {
        try {
            //1 check if user already exist
            const isUser = await User.checkUser(req.body.uid);
            if (!!isUser) {
                res.status(200).json({ message: 'Successfully Sign In' });
                return;
            }

            const user = new User(req.body)

            const doc = await user.save();
            console.log(doc);
            res.status(200).send(doc);
        } catch (error) {
            res.status(400).json({ message: 'Error', error: error })
        }
    })
router.route('/:userId')
    .get(async (req, res) => {
        try {
            const userData = await User.checkUser(req.params.userId);
            res.status(200).send(userData);
        } catch (error) {
            res.status(400).json({ message: 'Error', error: error })
        }
    })


module.exports = router;