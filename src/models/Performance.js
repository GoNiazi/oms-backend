import mongoose from 'mongoose';

const performanceSchema = new mongoose.Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  reviewer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  feedback: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Performance = mongoose.model('Performance', performanceSchema);

export default Performance;