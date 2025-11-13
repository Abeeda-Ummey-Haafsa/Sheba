import express from "express";
import {
  getCaregivers,
  getCaregiverById,
  createCaregiver,
} from "../controllers/caregiverController.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/", getCaregivers);
router.get("/:id", getCaregiverById);
router.post("/", verifyToken, createCaregiver);

export default router;
