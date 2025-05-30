
import { getPropertyById,getPropertyRecommendations,
    getAllProperties
 } from "../controllers/propertyController.js";
 import express from 'express'



const router = express.Router();


router.get('/', getAllProperties);
router.get('/:id', getPropertyById);
router.get('/:id/similar', getPropertyRecommendations);

export default router;