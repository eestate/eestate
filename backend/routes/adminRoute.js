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
  getTopPerfomingAgents,
  getTotalProperties,
  getTotalRevenue,
  searchAndFilterBookings,
  searchAndFilterProperties,
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
adminRouter.get("/getAllViews", protect, getAllViews);
adminRouter.delete("/deletePlan/:planId", protect, deletePlan);
adminRouter.get("/allProperties", protect, allProperties);
adminRouter.get("/allBookings", protect, allBookings);
adminRouter.get("/monthly-stats", protect, getMonthlyDashboardData);
adminRouter.get("/top-agents", protect, getTopPerfomingAgents);
adminRouter.get("/searchProperties", protect, searchAndFilterProperties);
adminRouter.get("/searchBookings", protect, searchAndFilterBookings);
adminRouter.get("/revenue",protect,getTotalRevenue)

export default adminRouter;
