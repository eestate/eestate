
import express from 'express';
import { login,register,googleLogin, updateProfile, checkAuth, logout } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/google', googleLogin); 
router.put('/profile',protect, updateProfile);
router.get('/check', protect, checkAuth);
router.post('/logout', logout);

export default router;
