import express from 'express';
let router = express.Router();

import {
  register,
  login,
  renewTokens,
  logout,
} from '../../controllers/auth.js';
import { verifyAuth } from '../../middleware/auth.js';

router.post('/register', register);
router.post('/login', login);
router.post('/logout', verifyAuth, logout);
router.get('/refresh', renewTokens);

// module.exports = router;
export default router;
