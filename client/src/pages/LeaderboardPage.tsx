
import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";

interface LeaderboardApiEntry {
  rank: number;
  user: string;
  totalScore: number;
}

const LeaderboardPage = () => {
  const { axios } = useAppContext();
  const [data, setData] = useState<LeaderboardApiEntry[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    axios
      .get("/api/leaderboard")
      .then((res) => {
        if (!mounted) return;
        setData(res.data);
      })
      .catch((err) => {
        if (!mounted) return;
        setError(err?.response?.data?.error || err.message || "Failed to load leaderboard");
      })
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, [axios]);

  return (
    <div className="flex flex-col items-center justify-start w-full bg-gray-50 py-8">
      <h1 className="text-4xl font-bold mb-8 text-blue-700">Leaderboard</h1>

      <div className="w-full max-w-[1000px] bg-white rounded-lg shadow-lg p-6">
        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-600 py-12">{error}</div>
        ) : data && data.length > 0 ? (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-blue-100">
                <th className="py-3 px-4 rounded-tl-lg">Rank</th>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4 rounded-tr-lg">Score</th>
              </tr>
            </thead>
            <tbody>
              {data.map((entry) => (
                <tr key={entry.rank} className={entry.rank % 2 === 1 ? "bg-gray-50" : "bg-gray-100"}>
                  <td className="py-2 px-4 font-semibold">{entry.rank}</td>
                  <td className="py-2 px-4">{entry.user}</td>
                  <td className="py-2 px-4 text-blue-600 font-bold">{entry.totalScore}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-12">No leaderboard data yet.</div>
        )}
      </div>
    </div>
  );
};

export default LeaderboardPage;
