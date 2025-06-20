import express from "express";
import {
  createProperty,
  getMyProperties,
  editProperty,
  deleteProperty,
  getAgentStats,
  enquiriesMail,
} from "../controllers/agentController.js";
import { protect } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post("/", protect, upload.array("images", 5), createProperty);
router.get("/my", protect, getMyProperties);
router.put("/:id", protect, upload.array("images", 5), editProperty);
router.delete("/:id", protect, deleteProperty);
router.get("/stats", protect, getAgentStats);
router.post("/sendMail", protect, enquiriesMail);

export default router;
