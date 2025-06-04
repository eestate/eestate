
import { getPropertyById,getPropertyRecommendations,
    getAllProperties,
    getPropertiesByCategory,
    getFeaturedProperties
 } from "../controllers/propertyController.js";
 import express from 'express'



const router = express.Router();


router.get('/', getAllProperties);
router.get('/:id', getPropertyById);
router.get('/:id/similar', getPropertyRecommendations);
router.get('/category/:category', getPropertiesByCategory);
router.get('/featured', getFeaturedProperties);

export default router;