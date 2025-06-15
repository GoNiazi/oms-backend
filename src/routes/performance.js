import express from "express";
import {
  addPerformanceReview,
  getPerformanceReport,
} from "../controllers/performanceController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/", auth(["Manager"]), addPerformanceReview);
router.get(
  "/report",
  auth(["Employee", "Manager", "Admin"]),
  getPerformanceReport
);

export default router;
