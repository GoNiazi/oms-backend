import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  priority: { type: String, enum: ['High', 'Medium', 'Low'], required: true },
  status: { type: String, enum: ['To Do', 'In Progress', 'Completed'], default: 'To Do' },
  startDate: { type: Date, required: true },
  dueDate: { type: Date, required: true },
  comments: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    text: { type: String },
    createdAt: { type: Date, default: Date.now },
  }],
});

const Task = mongoose.model('Task', taskSchema);

export default Task;