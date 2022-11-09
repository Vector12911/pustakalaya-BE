import express from 'express';
let router = express.Router();
// const { user } = require('../../controllers/user');
// const { verifyAuth } = require('../../shared/tokens');
import { verifyAuth } from '../../middleware/auth.js';
import { user } from '../../controllers/user.js';

router.get('/currentUser', verifyAuth, user);

export default router;
