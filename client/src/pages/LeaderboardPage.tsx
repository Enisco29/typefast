import { useEffect, useRef, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { formatNames } from "../utils/help";

interface LeaderboardApiEntry {
  id: string;
  rank: number;
  user: string;
  currentPeriodScore: number;
  totalScore: number;
}

interface LeaderboardResponse {
  leaderboard: LeaderboardApiEntry[];
  daysUntilReset: number;
  resetPeriod: number;
}

const LeaderboardPage = () => {
  const { axios, user } = useAppContext();
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardApiEntry[]>(
    []
  );
  const [daysUntilReset, setDaysUntilReset] = useState<number>(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const userRowRef = useRef<HTMLTableRowElement | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    axios
      .get("/api/leaderboard", {
        headers: { Authorization: `${localStorage.getItem("token")}` },
      })
      .then((res) => {
        if (!mounted) return;
        const data: LeaderboardResponse = res.data;
        setLeaderboardData(data.leaderboard);
        setDaysUntilReset(data.daysUntilReset);
      })
      .catch((err) => {
        if (!mounted) return;
        setError(
          err?.response?.data?.error ||
            err.message ||
            "Failed to load leaderboard"
        );
      })
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, [axios]);

  //scroll to user row if not visible
  useEffect(() => {
    if (leaderboardData?.length > 0 && userRowRef.current) {
      const userRow = userRowRef.current;
      const isUserVisible = () => {
        const rect = userRow.getBoundingClientRect();
        return rect.top >= 0 && rect.bottom <= window.innerHeight;
      };

      if (!isUserVisible()) {
        userRow.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [leaderboardData]);

  // Function to get trophy icon and color based on rank
  const getTrophy = (rank: number): { icon: string; colorClass: string } => {
    switch (rank) {
      case 1:
        return { icon: "🏆", colorClass: "text-yellow-500" }; // Gold
      case 2:
        return { icon: "🥈", colorClass: "text-gray-400" }; // Silver
      case 3:
        return { icon: "🥉", colorClass: "text-amber-600" }; // Bronze
      default:
        return { icon: "", colorClass: "" };
    }
  };

  return (
    <div className="flex flex-col items-center justify-start w-full py-8 px-4">
     
      
      {/* Reset Information */}
      <div className="mb-6 p-4 flex flex-col md:flex-row rounded-lg justify-between items-center w-full text-center">
         <h1 className="text-4xl font-bold text-blue-700">Leaderboard</h1>
        <p className="text-orange-700 text-sm">
          Next reset in: <span className="font-bold text-lg">{daysUntilReset}</span> days
        </p>
      </div>

      <div className="w-full max-w-[1000px] bg-white rounded-lg border-2 border-gray-200">
        {loading ? (
          <div className="text-center py-12 text-gray-600">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-600 py-12">{error}</div>
        ) : leaderboardData && leaderboardData.length > 0 ? (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className=" text-black border-b-2 border-gray-300">
                <th className="py-3 px-4 rounded-tl-lg">Rank</th>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4"> Points</th>
               
              </tr>
            </thead>
            <tbody>
              {leaderboardData.map((entry) => {
                const { icon, colorClass } = getTrophy(entry.rank);
                return (
                  <tr
                    key={entry.rank}
                    ref={entry.id === user?.userId ? userRowRef : null}
                    className={`
                   ${
                     entry.id === user?.userId &&
                     "bg-blue-100 text-black font-bold"
                   } : border-b-2 border-gray-200`}
                  >
                    <td className={`py-2 px-4 flex items-center font-semibold ${colorClass}`}>
                      {entry.rank}
                      <span className="ml-1 text-xs md:text-sm">
                      {icon}</span>
                    </td>
                    <td className="py-2 px-4">{formatNames(entry.user)}</td>
                    <td className="py-2 px-4 font-bold text-blue-600">{entry.currentPeriodScore}</td>
                    
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-12 text-gray-600">
            No leaderboard data yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaderboardPage;
