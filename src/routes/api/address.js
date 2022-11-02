const express = require('express');
require('dotenv').config();
let router = express.Router();
const { Address } = require('../../models/address_model');
const { User } = require('../../models/user_model');
const { grantAccess } = require('../../middleware/roles');

router.route('/:user_id')
    .post(async (req, res) => {
        try {
            const uid = req.params.user_id;

            const address = new Address(req.body)

            const address_doc = await address.save();
            const user_doc = await User.update(
                { uid },
                { "$push": { "address": address_doc._id } }
            ).exec(function (err, res) {
                if (err) {
                    res.status(400).json({ message: 'Error', error: err });
                    return;
                }
                console.log(res);
                res.status(200).send(res)
            });
        } catch (error) {
            res.status(400).json({ message: 'Error', error: error })
        }
    })

module.exports = router;