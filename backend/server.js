import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { config } from "./src/config/env.js";
import {
  errorHandler,
  notFoundHandler,
} from "./src/middleware/errorHandler.js";
import authRoutes from "./src/routes/auth.js";
import caregiversRoutes from "./src/routes/caregivers.js";
import trackingRoutes from "./src/routes/tracking.js";
import matchingRoutes from "./src/routes/matching.js";

dotenv.config();

const app = express();
const PORT = config.port;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "Server is running", environment: config.nodeEnv });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/caregivers", caregiversRoutes);
app.use("/api/tracking", trackingRoutes);
app.use("/api/matching", matchingRoutes);

// Error handling middleware (must be last)
app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${config.nodeEnv} mode`);
});
