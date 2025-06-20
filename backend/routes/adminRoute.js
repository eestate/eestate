import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  addSubscription,
  agentDetails,
  allBookings,
  allProperties,
  allSubscriptionPlans,
  BlockAndUnblock,
  deletePlan,
  editSubscription,
  getAllActiveUsers,
  getAllUser,
  getAllViews,
  getMonthlyDashboardData,
  getTotalProperties,
  userDetails,
} from "../controllers/adminController.js";
const adminRouter = express.Router();

adminRouter.get("/allUsers", protect, getAllUser);
adminRouter.get("/userDetails/:userId", protect, userDetails);
adminRouter.get("/agentDetails/:agentId", protect, agentDetails);
adminRouter.put("/BlockAndUnblock", protect, BlockAndUnblock);
adminRouter.post("/addSubscription", protect, addSubscription);
adminRouter.get("/getSubscriptions", protect, allSubscriptionPlans);
adminRouter.put("/editSubscription/:planId", protect, editSubscription);
adminRouter.get("/getTotalProperties", protect, getTotalProperties);
adminRouter.get("/getAllActiveUsers", protect, getAllActiveUsers);
adminRouter.get("/getAllViews",protect,getAllViews)
adminRouter.delete("/deletePlan/:planId", protect, deletePlan);
adminRouter.get("/allProperties", protect, allProperties);
adminRouter.get("/allBookings", protect, allBookings);
adminRouter.get("/monthly-stats",protect,getMonthlyDashboardData)

export default adminRouter;
