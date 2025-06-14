import express from "express"
import dotenv from 'dotenv';
import connectDB from './config/db.js'
import authRoutes from "./routes/auth.js"
import userRoutes from "./routes/user.js"
dotenv.config();
const app = express();

// Connect to MongoDB
connectDB();


app.use(express.json());

const PORT = process.env.PORT || 3000;
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes)
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))