import express from 'express';
import { markAttendance, getAttendanceReport } from '../controllers/attendanceController.js';
import auth from '../middleware/auth.js';
const router = express.Router();

router.post('/mark', auth(['Employee']), markAttendance);
router.get('/report', auth(['Admin', 'Manager']), getAttendanceReport);

export default router;