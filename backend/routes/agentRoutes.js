import express from 'express';
import { createProperty, getMyProperties, editProperty, deleteProperty, getAgentStats } from '../controllers/agentController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.post('/', protect, upload.array('images', 5), createProperty); 
router.get('/my', protect, getMyProperties); 
router.put('/:productid', protect, upload.array('images', 5), editProperty); 
router.delete('/:productid', protect, deleteProperty); 

export default router;