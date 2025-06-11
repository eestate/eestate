
import express from 'express';
import { login,register,googleLogin, checkAuth, logout } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/google', googleLogin); 
router.get('/check', protect, checkAuth);
router.post('/logout', logout);

export default router;
