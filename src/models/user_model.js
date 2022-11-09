// const mongoose = require('mongoose');
// const db = require('../config/db');
import db from '../config/db.js';
const userSchema = db.Schema(
  {
    name: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      requird: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      requird: true,
      trim: true,
    },
    tokenVersion: {
      type: Number,
      default: 0,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    address: [{ type: db.Schema.Types.ObjectId, ref: 'Address' }],
  },
  { timestamps: true }
);

userSchema.statics.checkUser = async function (email) {
  // console.log("emailTaken :", this);
  try {
    const user = await this.findOne({ email });
    return user;
  } catch (error) {
    console.log(error);
  }
};

export const User = db.model('User', userSchema);
