var mongoose = require('mongoose');
const { config } = require('../config');
const { MONGO_URI } = config;
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
};

mongoose.connect(MONGO_URI, options, function () {
  console.log('mongodb connected');
});
module.exports = mongoose;
