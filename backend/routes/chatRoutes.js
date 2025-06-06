// chat.routes.js
import express from "express";
import { getUsersForSidebar, getMessages, sendMessage } from "../controllers/chatController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/users", getUsersForSidebar);

router.get("/messages/:id", getMessages);

router.post("/messages/:id", sendMessage);

export default router;