import Usage from "../models/Usage.js";

export const getDailyReport = async (req, res) => {
  try {
    const { userId, date } = req.params;

    const report = await Usage.aggregate([
      {
        $match: { userId, date },
      },
      {
        $group: {
          _id: "$website",
          totalSeconds: { $sum: "$timeSpent" },
        },
      },
    ]);

    const totalTime = report.reduce((sum, item) => sum + item.totalSeconds, 0);

    res.json({
      date,
      totalTime,
      breakdown: report,
    });
  } catch (err) {
    res.status(500).json({ error: "Report generation failed" });
  }
};
