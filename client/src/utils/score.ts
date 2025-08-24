// utils/score.ts
export const calculateScore = (wpm: number, accuracy: number, durationSeconds: number): number => {
  // Example formula: weight WPM & Accuracy
  const baseScore = wpm * 0.7 + accuracy * 0.3;

  // Normalize against duration (optional)
  const durationFactor = Math.max(0.5, Math.min(1, 120 / durationSeconds));
  // if duration > 120s, factor drops a bit

  let score = baseScore * durationFactor;

  // Cap the score to max 200
  if (score > 200) score = 200;

  // Round neatly
  return Math.round(score);
};
