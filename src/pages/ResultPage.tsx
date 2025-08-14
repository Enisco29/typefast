import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type ResultEntry = {
  id: string;
  dateISO: string;
  wpm: number;
  accuracy: number;
  durationSeconds: number;
  charactersTyped: number;
  textLength: number;
  difficulty?: string;
  mode?: string;
};

const STORAGE_KEY = "typing_history";

const ResultPage = () => {
  const navigate = useNavigate();
  const [latest, setLatest] = useState<ResultEntry | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const list: ResultEntry[] = JSON.parse(raw) || [];
      if (!Array.isArray(list) || list.length === 0) return;
      // Pick the newest by date
      const newest = list.reduce((a, b) =>
        new Date(a.dateISO).getTime() > new Date(b.dateISO).getTime() ? a : b
      );
      setLatest(newest);
    } catch {
      setLatest(null);
    }
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="w-full h-[41vw] flex flex-col justify-center items-center">
      <div className="w-[50%]">
        <h1 className="text-[50px] font-medium text-center">Test Results</h1>

        {!latest ? (
          <div className="mt-8 p-6 rounded-lg bg-gray-50 border border-gray-200 text-center text-gray-600">
            No recent results found. Start a new test to see your results here.
            <div className="mt-6">
              <button
                onClick={() => navigate("/configure")}
                className="p-4 rounded-md px-10 cursor-pointer bg-blue-600 text-white font-medium"
              >
                Start a Test
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex py-5 gap-7 ">
              <div className="p-5 px-4 space-y-5 bg-gray-100 w-[400px] rounded-lg">
                <h3 className="text-xl">Words Per Minute</h3>
                <p className="text-2xl font-bold">{latest.wpm}</p>
              </div>
              <div className="p-5 px-4 space-y-5 bg-gray-100 w-[400px] rounded-lg">
                <h3 className="text-xl">Accuracy</h3>
                <p className="text-2xl font-bold">{latest.accuracy}%</p>
              </div>
            </div>

            <p className="text-xl font-medium py-5 border-b border-gray-100">
              Summary
            </p>

            <div className="grid grid-cols-2 gap-5 py-5">
              <div className="p-5 rounded-lg bg-gray-50">
                <p className="text-gray-500 text-sm">Duration</p>
                <p className="text-lg font-semibold">{formatTime(latest.durationSeconds)}</p>
              </div>
              <div className="p-5 rounded-lg bg-gray-50">
                <p className="text-gray-500 text-sm">Characters</p>
                <p className="text-lg font-semibold">{latest.charactersTyped} / {latest.textLength}</p>
              </div>
              <div className="p-5 rounded-lg bg-gray-50">
                <p className="text-gray-500 text-sm">Difficulty</p>
                <p className="text-lg font-semibold">{latest.difficulty || "—"}</p>
              </div>
              <div className="p-5 rounded-lg bg-gray-50">
                <p className="text-gray-500 text-sm">Mode</p>
                <p className="text-lg font-semibold">{latest.mode || "—"}</p>
              </div>
            </div>

            <div className="flex w-full justify-center gap-6 mt-6">
              <button
                onClick={() => navigate("/configure")}
                className="p-4 rounded-md px-10 cursor-pointer bg-blue-600 text-white font-medium"
              >
                Restart Test
              </button>
              <button
                onClick={() => navigate("/history")}
                className="p-4 rounded-md px-10 cursor-pointer font-medium bg-gray-200"
              >
                View History
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ResultPage;
