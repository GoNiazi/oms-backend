import Task from "../models/Task.js";

export const createTask = async (req, res) => {
  const { title, description, assignedTo, priority, startDate, dueDate } =
    req.body;
  try {
    const task = new Task({
      title,
      description,
      assignedTo,
      assignedBy: req.user.id,
      priority,
      startDate,
      dueDate,
    });
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateTaskStatus = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addComment = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { $push: { comments: { user: req.user.id, text: req.body.text } } },
      { new: true }
    );
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTasks = async (req, res) => {
  const { page = 1, limit = 10, status, priority } = req.query;
  try {
    const query =
      req.user.role === "Employee"
        ? { assignedTo: req.user.id }
        : { assignedBy: req.user.id };

    if (status) query.status = status;
    if (priority) query.priority = priority;

    const tasks = await Task.find(query)
      .populate("assignedTo", "name")
      .populate("assignedBy", "name")
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Task.countDocuments(query);
    res.json({
      tasks,
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
