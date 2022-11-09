import mongoose from 'mongoose';
import config from '../config/index.js';
console.log(config);
const { MONGO_URI } = config;
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
};

mongoose.connect(MONGO_URI, options, function () {
  console.log('mongodb connected');
});

export default mongoose;
