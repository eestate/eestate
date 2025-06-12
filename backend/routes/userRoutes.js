
import express from 'express';
import { getCurrentUser } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import { getWishlist,addToWishlist,removeFromWishlist } from '../controllers/propertyController.js';
import { getAgentDetails,getAllAgents ,updateProfile} from '../controllers/userController.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();



router.get('/profile', protect, getCurrentUser);

router.put('/profile',protect,upload.single('profilePic'), updateProfile);


router.get('/wishlist', protect, getWishlist);
router.post('/wishlist/:propertyId', protect, addToWishlist);
router.delete('/wishlist/:propertyId', protect, removeFromWishlist);

router.get('/agents', getAllAgents);
router.get('/agents/:id', getAgentDetails);

export default router;
