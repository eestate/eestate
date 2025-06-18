
import { getPropertyById,getPropertyRecommendations,
    getAllProperties,
    getFeaturedProperties,
    getPropertyImagesByCategory,
    searchProperties,
    getSearchSuggestions
 } from "../controllers/propertyController.js";
 import express from 'express'



const router = express.Router();

router.get('/search', searchProperties);
router.get('/suggestions', getSearchSuggestions);

router.get('/', getAllProperties);
router.get('/:id', getPropertyById);
router.get('/:id/similar', getPropertyRecommendations);
router.get('/category/:category/images', getPropertyImagesByCategory);
router.get('/featured', getFeaturedProperties);



export default router;