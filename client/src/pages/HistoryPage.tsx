import React, { useEffect, useState } from 'react'
import { useAppContext } from '../context/AppContext'

interface HistoryEntry {
  _id?: string; // from DB
  id?: string; // from local fallback
  dateISO: string;
  wpm: number;
  accuracy: number;
  durationSeconds: number;
  charactersTyped: number;
  score: number;
  textLength: number;
}

const STORAGE_KEY = 'typing_history'

const HistoryPage: React.FC = () => {
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const { axios, user } = useAppContext()

  useEffect(() => {
    const load = async () => {
      // If logged in, fetch from backend
      if (user?.userId) {
        try {
          const { data } = await axios.get(`/api/history/${user.userId}`)
          const normalized: HistoryEntry[] = data.map((d: any) => ({
            _id: d._id,
            dateISO: d.dateISO,
            wpm: d.wpm,
            accuracy: d.accuracy,
            durationSeconds: d.durationSeconds,
            charactersTyped: d.charactersTyped,
            score: d.score,
            textLength: d.textLength,
          }))
          normalized.sort((a, b) => new Date(b.dateISO).getTime() - new Date(a.dateISO).getTime())
          setHistory(normalized)
          return
        } catch {
          // fallback to local
        }
      }
      try {
        const raw = localStorage.getItem(STORAGE_KEY)
        if (raw) {
          const parsed: HistoryEntry[] = JSON.parse(raw)
          parsed.sort((a, b) => new Date(b.dateISO).getTime() - new Date(a.dateISO).getTime())
          setHistory(parsed)
        }
      } catch {
        setHistory([])
      }
    }
    load()
  }, [user?.userId])

  const clearHistory = async () => {
    if (!history.length) return
    if (confirm('Clear all history? This cannot be undone.')) {
      // Try backend if logged in
      if (user?.userId) {
        try {
          await axios.delete(`/api/history/delete-all/${user.userId}`)
          setHistory([])
          return
        } catch {
          // ignore and fallback
        }
      }
      localStorage.removeItem(STORAGE_KEY)
      setHistory([])
    }
  }

  const deleteEntry = async (identifier: string) => {
    // Try backend first when logged in
    if (user?.userId) {
      try {
        await axios.delete(`/api/history/${identifier}`)
        setHistory(prev => prev.filter(h => h._id !== identifier))
        return
      } catch {
        // ignore and fallback
      }
    }
    // local fallback uses id
    const updated = history.filter(h => (h._id ?? h.id) !== identifier)
    setHistory(updated)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  }

  const formatDate = (iso: string) => new Date(iso).toLocaleString()
  const formatTime = (seconds: number) => `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`

  return (
    <div className="w-full h-[41vw] flex flex-col items-center justify-start py-10">
      <div className="w-[90%] max-w-[1100px]">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-[40px] font-semibold">History</h1>
          <button
            onClick={clearHistory}
            className="px-5 py-2 rounded-lg bg-red-600 text-white font-medium disabled:opacity-50"
            disabled={!history.length}
          >
            Clear All
          </button>
        </div>

        {!history.length ? (
          <div className="w-full p-8 rounded-lg border border-gray-200 bg-gray-50 text-center text-gray-600">
            No history yet. Complete a test to see results here.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {history.map((h) => (
              <div key={(h._id ?? h.id) as string} className="p-5 rounded-lg border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-gray-500 text-sm">{formatDate(h.dateISO)}</p>
                  <button onClick={() => deleteEntry((h._id ?? h.id) as string)} className="text-red-600 text-sm hover:underline">Delete</button>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex-1 p-4 rounded-md bg-gray-50">
                    <p className="text-sm text-gray-500">WPM</p>
                    <p className="text-2xl font-bold">{h.wpm}</p>
                  </div>
                  <div className="flex-1 p-4 rounded-md bg-gray-50">
                    <p className="text-sm text-gray-500">Accuracy</p>
                    <p className="text-2xl font-bold">{h.accuracy}%</p>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-3 mt-4">
                  <div className="p-3 rounded-md bg-gray-50 text-center">
                    <p className="text-xs text-gray-500">Duration</p>
                    <p className="font-semibold">{formatTime(h.durationSeconds)}</p>
                  </div>
                  <div className="p-3 rounded-md bg-gray-50 text-center">
                    <p className="text-xs text-gray-500">Typed</p>
                    <p className="font-semibold">{h.charactersTyped}</p>
                  </div>
                  <div className="p-3 rounded-md bg-gray-50 text-center">
                    <p className="text-xs text-gray-500">Score</p>
                    <p className="font-semibold">{h.score || "-"}</p>
                  </div>
                  <div className="p-3 rounded-md bg-gray-50 text-center">
                    <p className="text-xs text-gray-500">Target Character</p>
                    <p className="font-semibold">{h.textLength}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default HistoryPage