import express from "express";
import {
  createTask,
  updateTaskStatus,
  addComment,
  getTasks,
} from "../controllers/taskController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/", auth(["Manager"]), createTask);
router.put("/:id/status", auth(["Employee"]), updateTaskStatus);
router.post("/:id/comment", auth(["Employee", "Manager"]), addComment);
router.get("/", auth(["Employee", "Manager"]), getTasks);

export default router;
