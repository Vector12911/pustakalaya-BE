var cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

const user = require('./src/routes/api/users');
const address = require('./src/routes/api/address');
const auth = require('./src/routes/api/auth');

app.use('/api/users', user);
app.use('/api/address', address);
app.use('/api/auth', auth);
const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`server is listening at ${port}`);
});
