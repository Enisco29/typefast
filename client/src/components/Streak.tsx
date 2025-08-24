import React, { useState, useEffect } from "react";
import { useAppContext } from "../context/AppContext";

const StreakDisplay: React.FC = () => {
  const { user, setUser, axios } = useAppContext();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const fetchStreak = async () => {
      try {
        const response = await axios.get("/api/streak", {
          headers: { Authorization: `${localStorage.getItem("token")}` },
        });
        if (!mounted) return;
        // merge only streak-related fields
        const streakData = {
          currentStreak: response.data.currentStreak,
          maxStreak: response.data.maxStreak,
          totalTests: response.data.totalTests,
          totalPoints: response.data.totalPoints,
          currentPeriodPoints: response.data.currentPeriodPoints,
          daysUntilReset: response.data.daysUntilReset,
        };
        if (user) {
          setUser({ ...user, ...streakData });
        }
      } catch (error) {
        console.error("Error fetching streak:", error);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    // Only fetch if we have a user and token
    if (user && localStorage.getItem("token")) {
      fetchStreak();
    } else {
      // If no user yet, wait a bit and try again
      const timer = setTimeout(() => {
        if (mounted && user && localStorage.getItem("token")) {
          fetchStreak();
        } else if (mounted) {
          setLoading(false);
        }
      }, 100);
      return () => clearTimeout(timer);
    }

    return () => {
      mounted = false;
    };
  }, [axios, setUser, user]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="grid gap-4 m-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 bg-white rounded-lg">
      <div className="card-container">
        <h2>Your Streak</h2>
        <p className="text-xs md:text-sm text-gray-500">
          Take a test today to improve your streak
        </p>
      </div>
      <div className="card-container">
        <p>Current Streak:</p>
        <span className="text-2xl"> 🔥 </span>
        <p className="flex items-center gap-1">
          <span className="font-bold text-2xl">{user?.currentStreak || 0}</span>{" "}
          days
        </p>
      </div>
      <div className="card-container">
        <p>Max Streak: </p>
        <span className="text-2xl"> 🏆</span>
        <p className="flex items-center gap-1">
          <span className="font-bold text-2xl">{user?.maxStreak || 0}</span>{" "}
          days
        </p>
      </div>
      <div className="card-container">
        <p>Total Tests: </p>
        <span className="text-2xl">📊</span>
        <p className="font-bold text-2xl">{user?.totalTests || 0}</p>
      </div>
      <div className="card-container">
        <p>Current XP:</p>
        <span className="text-2xl">⚡</span>
        <p className="font-bold text-2xl text-blue-600">{user?.currentPeriodPoints || 0}</p>
        <p className="text-xs text-gray-500">Resets in {user?.daysUntilReset || 10} days</p>
      </div>
      <div className="card-container">
        <p>XP Earned:</p>
        <span className="text-2xl">💎</span>
        <p className="font-bold text-2xl text-green-600">{user?.totalPoints || 0}</p>
        <p className="text-xs text-gray-500">All time</p>
      </div>
    </div>
  );
};

export default StreakDisplay;
