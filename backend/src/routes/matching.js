import express from "express";
import {
  findMatches,
  getMatchingStats,
} from "../controllers/matchingController.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// Find matching caregivers (protected route)
router.post("/find-matches", verifyToken, findMatches);

// Get matching algorithm statistics (protected route)
router.get("/stats", verifyToken, getMatchingStats);

export default router;
