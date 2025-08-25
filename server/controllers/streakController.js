import UserModel from "../models/userModel.js";

export const updateStreak = async (req, res) => {
  // Prefer authenticated user id from auth middleware
  const userId = req.user?.userId || req.params.userId;
  if (!userId) {
    return res.status(400).json({ success: false, message: "Missing user id" });
  }

  try {
    const user = await UserModel.findById(userId);
    if (!user)
      return res.status(404).json({
        success: false,
        message: "User not found",
      });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let lastDate = user.lastTestDate ? new Date(user.lastTestDate) : null;

    if (lastDate) lastDate.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Check if we need to reset the leaderboard (every 10 days)
    const lastReset = user.lastLeaderboardReset ? new Date(user.lastLeaderboardReset) : new Date(0);
    const daysSinceReset = Math.floor((today - lastReset) / (1000 * 60 * 60 * 24));
    
    if (daysSinceReset >= 10) {
      // Reset current period points and update reset date
      user.currentPeriodPoints = 0;
      user.lastLeaderboardReset = today;
    }

    // if (lastDate && lastDate.getTime() === today.getTime()) {
    //   return res.json({
    //     message: "Already took a test today: No streak change",
    //     currentStreak: user.currentStreak,
    //     maxStreak: user.maxStreak,
    //     totalPoints: user.totalPoints,
    //     currentPeriodPoints: user.currentPeriodPoints,
    //     daysUntilReset: 10 - (daysSinceReset % 10),
    //   });
    // } else if (lastDate && lastDate.getTime() === yesterday.getTime()) {
    //   // Increment streak
    //   user.currentStreak = (user.currentStreak || 0) + 1;
    // } else {
    //   // Missed a day or first test
    //   user.currentStreak = 1;
    // }

    if (lastDate && lastDate.getTime() === today.getTime()) {
  // Already tested today → don't update streak OR lastTestDate
  return res.json({
    message: "Already took a test today: No streak change",
    currentStreak: user.currentStreak,
    maxStreak: user.maxStreak,
    totalPoints: user.totalPoints,
    currentPeriodPoints: user.currentPeriodPoints,
    daysUntilReset: 10 - (daysSinceReset % 10),
  });
} else if (lastDate && lastDate.getTime() === yesterday.getTime()) {
  // Increment streak
  user.currentStreak = (user.currentStreak || 0) + 1;
  user.lastTestDate = today;
  user.totalTests = (user.totalTests || 0) + 1;
} else {
  // Missed a day or first test
  user.currentStreak = 1;
  user.lastTestDate = today;
  user.totalTests = (user.totalTests || 0) + 1;
}

    // Update max streak if needed
    if ((user.maxStreak || 0) < user.currentStreak) {
      user.maxStreak = user.currentStreak;
    }

    user.lastTestDate = today;
    user.totalTests = (user.totalTests || 0) + 1;

    await user.save();

    res.json({
      currentStreak: user.currentStreak,
      maxStreak: user.maxStreak,
      lastTestDate: user.lastTestDate,
      totalTests: user.totalTests,
      totalPoints: user.totalPoints,
      currentPeriodPoints: user.currentPeriodPoints,
      daysUntilReset: 10 - (daysSinceReset % 10),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getStreak = async (req, res) => {
  try {
    const userId = req.user?.userId || req.params.userId;
    if (!userId) return res.status(400).json({ message: "Missing user id" });
    const user = await UserModel.findById(userId).select(
      "currentStreak maxStreak lastTestDate totalTests totalPoints currentPeriodPoints lastLeaderboardReset"
    );
    if (!user)
      return res.status(404).json({
        success: false,
        message: "User not found",
      });

    // Calculate days until next reset
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const lastReset = user.lastLeaderboardReset ? new Date(user.lastLeaderboardReset) : new Date(0);
    const daysSinceReset = Math.floor((today - lastReset) / (1000 * 60 * 60 * 24));
    const daysUntilReset = 10 - (daysSinceReset % 10);

    res.json({
      ...user.toObject(),
      daysUntilReset,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
