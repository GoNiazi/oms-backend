import express from "express";
import {
  applyLeave,
  updateLeaveStatus,
  getLeaves,
} from "../controllers/leaveController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/apply", auth(["Employee"]), applyLeave);
router.put("/:id/status", auth(["Manager"]), updateLeaveStatus);
router.get("/", auth(["Employee", "Manager", "Admin"]), getLeaves);

export default router;
