import UserModel from "../models/userModel.js";

export const getLeaderboard = async (req, res) => {
  try {
    // Get current period points from users (for 10-day reset system)
    const leaderboard = await UserModel.aggregate([
      {
        $project: {
          name: 1,
          currentPeriodPoints: { $ifNull: ["$currentPeriodPoints", 0] },
          totalPoints: { $ifNull: ["$totalPoints", 0] },
          lastLeaderboardReset: 1,
        },
      },
      { $sort: { currentPeriodPoints: -1 } },
      { $limit: 20 }, // top 20 users
    ]);

    // Calculate days until next reset for the first user (all users reset together)
    let daysUntilReset = 10;
    if (leaderboard.length > 0 && leaderboard[0].lastLeaderboardReset) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const lastReset = new Date(leaderboard[0].lastLeaderboardReset);
      const daysSinceReset = Math.floor((today - lastReset) / (1000 * 60 * 60 * 24));
      daysUntilReset = 10 - (daysSinceReset % 10);
    }

    // Format the leaderboard data
    const withRanks = leaderboard.map((entry, idx) => ({
      id: entry._id,
      rank: idx + 1,
      user: entry.name || "Anonymous",
      currentPeriodScore: entry.currentPeriodPoints,
      totalScore: entry.totalPoints,
    }));

    res.status(200).json({
      leaderboard: withRanks,
      daysUntilReset,
      resetPeriod: 10,
    });
  } catch (error) {
    console.error("Leaderboard error:", error);
    res.status(500).json({ error: "Failed to fetch leaderboard" });
  }
};
