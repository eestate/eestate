

import express from 'express' 
const router = express.Router();
import { createBooking,getAgentBookings ,updateBookingStatus} from '../controllers/bookingController.js';
import { protect } from '../middleware/authMiddleware.js';
router.post('/',createBooking);
router.get('/agent/:agentId',getAgentBookings);
router.patch('/:id/status', protect, updateBookingStatus);

export default router