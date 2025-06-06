
import express from 'express';
import { getCurrentUser } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import { getWishlist,addToWishlist,removeFromWishlist } from '../controllers/propertyController.js';
import { updateProfile } from '../controllers/authController.js';
const router = express.Router();



router.get('/profile', protect, getCurrentUser);

router.put('/profile',protect, updateProfile);


router.get('/wishlist', protect, getWishlist);
router.post('/wishlist/:propertyId', protect, addToWishlist);
router.delete('/wishlist/:propertyId', protect, removeFromWishlist);


export default router;
