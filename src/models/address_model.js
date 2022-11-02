const db = require('../config/db');

const addressSchema = db.Schema(
  {
    full_name: {
      type: String,
      trim: true,
    },
    address_line_1: {
      type: String,
      requird: true,
      trim: true,
    },
    address_line_2: {
      type: String,
      trim: true,
    },
    land_mark: {
      type: String,
      trim: true,
    },
    mobile_number: {
      type: String,
      maxLength: 10,
      requird: true,
      trim: true,
    },
    pincode: {
      type: String,
      requird: true,
      maxLength: 6,
      trim: true,
    },
    city: {
      type: String,
      requird: true,
      trim: true,
    },
    state: {
      type: String,
      requird: true,
      trim: true,
    },
  },
  { timestamps: true }
);

const Address = db.model('Address', addressSchema);
module.exports = { Address };
