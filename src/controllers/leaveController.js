import Leave from "../models/Leave.js";

export const applyLeave = async (req, res) => {
  const { type, startDate, endDate, reason } = req.body;

  try {
    const leave = new Leave({
      user: req.user.id,
      type,
      startDate,
      endDate,
      reason,
    });

    await leave.save();

    res.status(201).json(leave);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateLeaveStatus = async (req, res) => {
  try {
    const leave = await Leave.findByIdAndUpdate(
      req.params.id,
      {
        status: req.body.status,
        reviewedBy: req.user.id,
      },
      { new: true }
    );

    if (!leave) {
      return res.status(404).json({ message: "Leave not found" });
    }

    res.json(leave);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getLeaves = async (req, res) => {
  const { page = 1, limit = 10, status } = req.query;

  try {
    const query = req.user.role === "Employee" ? { user: req.user.id } : {};
    if (status) query.status = status;

    const leaves = await Leave.find(query)
      .populate("user", "name")
      .populate("reviewedBy", "name")
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Leave.countDocuments(query);

    res.json({
      leaves,
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
