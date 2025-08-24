import History from "../models/historyModel.js";
import UserModel from "../models/userModel.js";
import { calculateScore } from "../utils/score.js";

//save new history entry
export const addHistory = async (req, res) => {
  try {
    const { wpm, accuracy, durationSeconds, charactersTyped, textLength } =
      req.body;

    const score = calculateScore(wpm, accuracy, durationSeconds);

    const entry = new History({
      userId: req.user.userId, // from JWT
      wpm,
      accuracy,
      durationSeconds,
      charactersTyped,
      textLength,
      score,
    });
    await entry.save();

    // Update user's points
    const user = await UserModel.findById(req.user.userId);
    if (user) {
      // Check if we need to reset the leaderboard (every 10 days)
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const lastReset = user.lastLeaderboardReset ? new Date(user.lastLeaderboardReset) : new Date(0);
      const daysSinceReset = Math.floor((today - lastReset) / (1000 * 60 * 60 * 24));
      
      if (daysSinceReset >= 10) {
        // Reset current period points and update reset date
        user.currentPeriodPoints = score;
        user.lastLeaderboardReset = today;
      } else {
        // Add to current period points
        user.currentPeriodPoints = (user.currentPeriodPoints || 0) + score;
      }

      // Always add to total points
      user.totalPoints = (user.totalPoints || 0) + score;
      
      await user.save();
    }

    res.status(201).json(entry);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//get all history entries for a user
export const getHistory = async (req, res) => {
  try {
    const userId = req.params.userId;
    if (!userId || String(userId) !== String(req.user.userId)) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }
    const historyEntries = await History.find({ userId }).sort({ dateISO: -1 });
    res.status(200).json(historyEntries);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//delete a history entry by id
export const deleteHistoryEntry = async (req, res) => {
  try {
    const deleted = await History.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId,
    });
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Not found" });
    }
    res.json({ success: true, message: "Entry deleted" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//delete all history entries for a user
export const deleteAllHistory = async (req, res) => {
  try {
    const userId = req.params.userId;
    if (!userId || String(userId) !== String(req.user.userId)) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }
    await History.deleteMany({ userId });
    res.json({ success: true, message: "All history entries deleted" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
