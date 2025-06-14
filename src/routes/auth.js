import express from 'express';
import { login, register, refreshToken, logout } from '../controllers/authController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.post('/register', auth(['Admin']), register);
router.post("/login", login)
router.post('/refresh-token', refreshToken);
router.post("/logout", logout)
export default router;