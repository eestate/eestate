import express from 'express'
import { protect } from '../middleware/authMiddleware.js';
import { addSubscription, agentDetails, allSubscriptionPlans, BlockAndUnblock, editSubscription, getAllActiveUsers, getAllUser, getTotalProperties, userDetails } from '../controllers/adminController.js';
const adminRouter = express.Router();

adminRouter.get('/allUsers',protect,getAllUser)
adminRouter.get('/userDetails/:userId',protect,userDetails)
adminRouter.get('/agentDetails/:agentId',protect,agentDetails)
adminRouter.put('/BlockAndUnblock',protect,BlockAndUnblock)
adminRouter.post('/addSubscription',protect,addSubscription)
adminRouter.get('/getSubscriptions',protect,allSubscriptionPlans)
adminRouter.put('/editSubscription/:planId',protect,editSubscription)
adminRouter.get('/getTotalProperties',protect,getTotalProperties)
adminRouter.get('/getAllActiveUsers',protect,getAllActiveUsers)

export default adminRouter