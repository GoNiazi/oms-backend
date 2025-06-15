import Performance from "../models/Performance.js";

export const addPerformanceReview = async (req, res) => {
  const { employee, feedback } = req.body;
  try {
    const review = new Performance({
      employee,
      reviewer: req.user.id,
      feedback,
    });
    await review.save();
    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPerformanceReport = async (req, res) => {
  const { employeeId, startDate, endDate } = req.query;
  try {
    const query = {};
    if (employeeId) query.employee = employeeId;
    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const report = await Performance.aggregate([
      { $match: query },
      {
        $group: {
          _id: "$employee",
          feedbackCount: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "employee",
        },
      },
      { $unwind: "$employee" },
      {
        $project: {
          name: "$employee.name",
          feedbackCount: 1,
        },
      },
    ]);

    res.json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
