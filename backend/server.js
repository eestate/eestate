import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/mongodb.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middleware/errorHandlerMiddleware.js";
import http from "http";
import { initializeSocket } from "./config/socket.js";
import userRoutes from "./routes/userRoutes.js"
import authRoutes from "./routes/authRoutes.js"
import agentRoutes from "./routes/agentRoutes.js";
import PropertyRoutes from "./routes/propertyRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import aboutRoutes from "./routes/aboutRoutes.js";

// Route imports
import adminRouter from "./routes/adminRoute.js";

import subscriptionRoutes from './routes/subscriptionRoutes.js'


// Model imports

import { Property } from './models/Property.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
const io = initializeSocket(server);

// Make io instance available in routes
app.set('io', io);
// Database initialization
const initializeDB = async () => {
  try {
    // Warm up indexes
    await Property.initializeIndexes();

    // For production: Refresh indexes periodically
    if (process.env.NODE_ENV === "production") {
      setInterval(async () => {
        await Property.syncIndexes();
      }, 86400000); // Daily sync
    }
  } catch (err) {
    console.error("Database initialization failed:", err);
  }
};

// Connect to MongoDB
connectDB().then(initializeDB);

app.use(
  "/api/subscriptions/webhook",
  express.raw({ type: "application/json" })
);

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Health check endpoint
app.get("/", (req, res) => {
  res.status(200).json({
    status: "healthy",
    message: "Estate API is running",
    socket: io.engine.clientsCount > 0 ? "active" : "inactive",
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/agent', agentRoutes);
app.use('/api/property', PropertyRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use("/api/chat", chatRoutes);
app.use('/api/bookings',bookingRoutes);
app.use('/api/admin', adminRouter);
app.use('/api/bookings', bookingRoutes);
app.use('/api/about', aboutRoutes);
app.use('/api/chat', chatRoutes);


// Error handling middleware
app.use(errorHandler);

// Start server
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(
    `🔌 Socket.IO ${io.engine.clientsCount > 0 ? "ready" : "initializing"}`
  );
});


// Handle server shutdown gracefully
process.on("SIGTERM", () => {
  console.log("🛑 SIGTERM received. Shutting down gracefully...");
  server.close(() => {
    console.log("💤 Server terminated");
    process.exit(0);
  });
});
