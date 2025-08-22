import History from "../models/historyModel.js";
import UserModel from "../models/userModel.js";

export const getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await History.aggregate([
      {
        $group: {
          _id: "$userId",
          totalScore: { $sum: "$score" },
        },
      },
      { $sort: { totalScore: -1 } },
      { $limit: 20 }, // top 20 users
    ]);

    //populate username
    const withUsers = await Promise.all(
      leaderboard.map(async (entry, idx) => {
        const user = await UserModel.findById(entry._id).select("name email");
        return {
          id: entry._id,
          rank: idx + 1,
          user: user?.name || "Anonymous",
          totalScore: entry.totalScore,
        };
      })
    );
    res.status(200).json(withUsers);
  } catch (error) {
  res.status(500).json({ error: "Failed to fetch leaderboard" });
  }
};
