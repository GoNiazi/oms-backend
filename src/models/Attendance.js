import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  checkIn: { type: Date },
  checkOut: { type: Date },
  type: { type: String, enum: ['onsite', 'remote', 'half-day'], required: true },
  status: { type: String, enum: ['present', 'absent', 'late'], default: 'present' },
});

const Attendance = mongoose.model('Attendance', attendanceSchema);

export default Attendance;