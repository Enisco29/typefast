import { ArrowLeft } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { generateTypingText, type Difficulty, type Mode } from "../services/ai";
import { useAppContext } from "../context/AppContext";

const STORAGE_KEY = "typing_history";

const TestPage = () => {
  const { axios, user } = useAppContext();
  const location = useLocation() as {
    state?: { difficulty?: Difficulty; mode?: Mode };
  };
  const difficulty: Difficulty = location.state?.difficulty ?? "Easy";
  const mode: Mode = location.state?.mode ?? "Text";

  const [value, setValue] = useState("");
  const [started, setStarted] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60); // 60 seconds default
  const [customTime, setCustomTime] = useState(60);
  const [timerActive, setTimerActive] = useState(false);
  const [targetText, setTargetText] = useState<string>("");
  const [loadingText, setLoadingText] = useState<boolean>(true);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const navigate = useNavigate();

  // Load/generate target text based on configuration
  useEffect(() => {
    let isMounted = true;
    setLoadingText(true);
    generateTypingText({ difficulty, mode, maxChars: 500 })
      .then((text) => {
        if (!isMounted) return;
        setTargetText(text);
      })
      .finally(() => {
        if (!isMounted) return;
        setLoadingText(false);
      });
    return () => {
      isMounted = false;
    };
  }, [difficulty, mode]);

  // Timer effect
  useEffect(() => {
    let interval: number;

    if (timerActive && timeLeft > 0 && !completed) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setTimerActive(false);
            setCompleted(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerActive, timeLeft, completed]);

  // Check if typing is complete
  useEffect(() => {
    if (
      started &&
      !completed &&
      value.length >= targetText.length &&
      targetText.length > 0
    ) {
      // Check if all characters match
      let allCorrect = true;
      for (let i = 0; i < targetText.length; i++) {
        if (value[i] !== targetText[i]) {
          allCorrect = false;
          break;
        }
      }

      if (allCorrect) {
        setCompleted(true);
        setTimerActive(false);
      }
    }
  }, [value, started, completed, targetText]);

  // Save result and navigate when completed
  useEffect(() => {
    if (!completed) return;

    const charactersTyped = value.length;
    const accuracy = (() => {
      if (charactersTyped === 0) return 0;
      let correct = 0;
      for (let i = 0; i < charactersTyped && i < targetText.length; i++) {
        if (value[i] === targetText[i]) correct++;
      }
      return Math.round((correct / charactersTyped) * 100);
    })();

    const wpm = (() => {
      if (!started) return 0;
      const words = value.trim().split(/\s+/).filter(Boolean).length;
      const timeElapsedMin = (customTime - timeLeft) / 60;
      if (timeElapsedMin <= 0) return 0;
      return Math.round(words / timeElapsedMin);
    })();

    const entry = {
      id: `${Date.now()}`,
      dateISO: new Date().toISOString(),
      wpm,
      accuracy,
      durationSeconds: customTime - timeLeft,
      charactersTyped,
      textLength: targetText.length,
      difficulty,
      mode,
    };

    // Persist locally for guests
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const list = raw ? JSON.parse(raw) : [];
      list.push(entry);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch {
      // ignore storage errors
    }

    // If authenticated, also persist to backend
    (async () => {
      try {
        if (!user) return;
        await axios.post(
          "/api/history/add",
          {
            wpm: entry.wpm,
            accuracy: entry.accuracy,
            durationSeconds: entry.durationSeconds,
            charactersTyped: entry.charactersTyped,
            textLength: entry.textLength,
          }
        );
      } catch (e) {
        // silently ignore for now
      }
    })();

    navigate("/result");
  }, [completed]);

  // Handle input changes with backspace prevention
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!started || completed) return;

    const newValue = e.target.value;

    // Prevent backspace by checking if new value is shorter than current value
    if (newValue.length < value.length) {
      e.preventDefault();
      return;
    }

    // Prevent typing beyond the target text length
    if (targetText && newValue.length > targetText.length) {
      return;
    }

    setValue(newValue);
  };

  // Handle keydown events to prevent backspace
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Backspace" || e.key === "Enter") {
      e.preventDefault();
    }
  };

  // Start the test
  const startTest = () => {
    if (loadingText || !targetText) return;
    setStarted(true);
    setCompleted(false);
    setValue("");
    setTimeLeft(customTime);
    setTimerActive(true);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Reset the test
  const resetTest = () => {
    setStarted(false);
    setCompleted(false);
    setValue("");
    setTimeLeft(customTime);
    setTimerActive(false);
  };

  // Format time display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Render target text with character-by-character comparison
  const renderTargetText = () => {
    if (loadingText) {
      return <span className="text-gray-400">Generating passage...</span>;
    }
    return (targetText || "").split("").map((char, index) => {
      let colorClass = "text-gray-600"; // Default color

      if (started && index < value.length) {
        if (value[index] === char) {
          colorClass = "text-green-600"; // Correct character
        } else {
          colorClass = "text-red-600"; // Incorrect character
        }
      }

      return (
        <span
          key={index}
          className={colorClass}
          style={{ userSelect: "none" }} // Prevent text selection
        >
          {char}
        </span>
      );
    });
  };

  // Calculate accuracy
  const calculateAccuracy = () => {
    if (value.length === 0) return 0;

    let correct = 0;
    for (let i = 0; i < value.length && i < targetText.length; i++) {
      if (value[i] === targetText[i]) correct++;
    }
    return Math.round((correct / value.length) * 100);
  };

  // Calculate words per minute
  const calculateWPM = () => {
    if (value.length === 0 || !started) return 0;

    const words = value.trim().split(/\s+/).length;
    const timeElapsed = (customTime - timeLeft) / 60; // Convert to minutes

    if (timeElapsed === 0) return 0;
    return Math.round(words / timeElapsed);
  };

  return (
    <div className="w-full flex justify-center items-start min-h-[70vh] px-4 py-8 sm:py-12">
      <div
        className="rounded-full fixed bg-gray-200 left-3 top-3 sm:left-5 sm:top-4 max-sm:top-7 p-2 sm:p-3 cursor-pointer hover:bg-gray-300"
        onClick={() => navigate("/configure")}
      >
        <ArrowLeft />
      </div>
      <div className="max-w-7xl w-full flex flex-col items-center space-y-6">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl max-sm:text-2xl font-medium text-center">
          Typing Speed Test
        </h1>
        <p className="text-gray-700 font-[400] text-base sm:text-lg text-center">
          Improve your typing speed and accuracy with this interactive test.
        </p>

        <div className="flex flex-col md:flex-row p-4 gap-4">
          {/* Config summary */}
          <div className="bg-blue-50 px-4 py-2 rounded-md text-blue-800 w-full max-w-2xl flex justify-center items-center text-center sm:text-left">
            Difficulty: <span className="font-semibold">{difficulty}</span> •
            Mode: <span className="font-semibold">{mode}</span>
          </div>

          {/* Timer Configuration */}
          {!started && (
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 gap-3 bg-blue-50 p-4 rounded-lg w-full max-w-2xl">
              <label className="text-base sm:text-lg font-medium text-gray-700">
                Timer Duration (seconds):
              </label>
              <input
                type="number"
                min="10"
                max="300"
                value={customTime}
                onChange={(e) => setCustomTime(parseInt(e.target.value) || 60)}
                className="border border-gray-300 rounded-lg px-3 py-2 w-full sm:w-28 text-center"
              />
            </div>
          )}
        </div>

        {/* Timer Display */}
        {started && (
          <div
            className={`text-xl sm:text-2xl font-bold px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg ${
              timeLeft <= 10
                ? "bg-red-100 text-red-800"
                : "bg-blue-100 text-blue-800"
            }`}
          >
            Time: {formatTime(timeLeft)}
          </div>
        )}

        {/*display text to practice */}
        <div className="border border-gray-200 p-4 sm:p-6 lg:p-8 rounded-lg bg-gray-50 w-full max-w-4xl">
          <p
            className="text-2xl sm:text-3xl leading-relaxed select-none"
            style={{ userSelect: "none" }}
            onCopy={(e) => e.preventDefault()} // Prevent copy
            onPaste={(e) => e.preventDefault()}
          >
            {renderTargetText()}
          </p>
        </div>

        {/* where the user inputs texts   */}

        <textarea
          ref={inputRef}
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onCopy={(e) => e.preventDefault()} // Prevent copy from input
          onPaste={(e) => e.preventDefault()}
          placeholder={
            started
              ? "Start typing here..."
              : loadingText
              ? "Generating passage..."
              : "Click Start to begin"
          }
          disabled={!started || completed || loadingText}
          rows={4}
          className="border border-gray-200 w-full max-w-4xl p-5 sm:p-7 rounded-lg text-xl sm:text-2xl
					outline-none shadow-sm hover:shadow-md focus:ring-1 focus:ring-indigo-300 transition-all duration-200
					disabled:bg-gray-100 disabled:cursor-not-allowed resize-none"
        />

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full max-w-4xl">
          {!started ? (
            <button
              onClick={startTest}
              disabled={loadingText}
              className="w-full sm:w-auto bg-blue-600 text-white px-6 sm:px-8 py-3 rounded-lg text-lg sm:text-xl font-medium hover:bg-blue-700 transition-colors disabled:opacity-60"
            >
              {loadingText ? "Preparing..." : "Start Test"}
            </button>
          ) : (
            <>
              <button
                onClick={resetTest}
                className="w-full sm:w-auto bg-gray-600 text-white px-6 sm:px-8 py-3 rounded-lg text-lg sm:text-xl font-medium hover:bg-gray-700 transition-colors"
              >
                Reset
              </button>
              <div className="w-full sm:w-auto text-center bg-green-100 text-green-800 px-6 py-3 rounded-lg text-lg font-medium">
                Accuracy: {calculateAccuracy()}%
              </div>
              {completed && (
                <div className="w-full sm:w-auto text-center bg-blue-100 text-blue-800 px-6 py-3 rounded-lg text-lg font-medium">
                  WPM: {calculateWPM()}
                </div>
              )}
            </>
          )}
        </div>

        {/* Status Messages */}
        {started && !completed && (
          <div className="text-center text-gray-600">
            <p>
              Characters typed: {value.length} / {targetText.length}
            </p>
            <p className="text-sm mt-2">
              Note: Backspace is disabled. Type carefully!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestPage;
