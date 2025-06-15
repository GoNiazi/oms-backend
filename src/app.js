import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";
import attendanceRoutes from "./routes/attendance.js";
import leaveRoutes from "./routes/leave.js";
import taskRoutes from "./routes/task.js";
import performanceTask from "./routes/performance.js";
dotenv.config();
const app = express();

// Connect to MongoDB
connectDB();

app.use(express.json());

const PORT = process.env.PORT || 3000;
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/leaves", leaveRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/performance", performanceTask);
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
