import cors from 'cors';
import express from 'express';
import bodyParser from 'body-parser';
import user from './src/routes/api/users.js';
// import address from './src/routes/api/address.js';
import auth from './src/routes/api/auth.js';
import cookieParser from 'cookie-parser';
import config from './src/config/index.js';

const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({ credentials: true, origin: config.CLIENT_URL }));
app.use(cookieParser());

app.use('/api/user', user);
// app.use('/api/address', address);
app.use('/api/auth', auth);

const port = config.PORT || 5000;

app.listen(port, () => {
  console.log(`server is listening at ${port}`);
});
