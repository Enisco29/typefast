import { useEffect, useRef, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { capitalizeWords } from "../utils/help";

interface LeaderboardApiEntry {
  id: string;
  rank: number;
  user: string;
  totalScore: number;
}

const LeaderboardPage = () => {
  const { axios, user } = useAppContext(); // Assume user is available from AppContext
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardApiEntry[]>(
    []
  );
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
        setLeaderboardData(res.data);
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

  return (
    <div className="flex flex-col items-center justify-start w-full py-8 px-4">
      <h1 className="text-4xl font-bold mb-4 text-blue-700">Leaderboard</h1>
      <p className="text-gray-600 italic mb-6">
        Your entry is highlighted in blue.
      </p>

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
                <th className="py-3 px-4 rounded-tr-lg">Score</th>
              </tr>
            </thead>
            <tbody>
              {leaderboardData.map((entry) => (
                <tr
                  key={entry.id}
                  ref={entry.id === user?.userId ? userRowRef : null}
                  className={`
                   ${
                     entry.id === user?.userId &&
                     "bg-blue-100 text-black font-bold"
                   } : border-b-2 border-gray-200`}
                >
                  <td className="py-2 px-4 font-semibold">{entry.rank}</td>
                  <td className="py-2 px-4">{capitalizeWords(entry.user)}</td>
                  <td className="py-2 px-4 font-bold">{entry.totalScore}</td>
                </tr>
              ))}
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
