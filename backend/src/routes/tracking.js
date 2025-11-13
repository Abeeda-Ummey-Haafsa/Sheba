import express from "express";
import {
  getLocation,
  updateLocation,
} from "../controllers/trackingController.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/:userId", verifyToken, getLocation);
router.put("/:userId", verifyToken, updateLocation);

export default router;
