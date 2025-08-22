import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomSelect from "../components/CustomSelect";

interface SelectOption {
  label: string;
  value: string;
  color?: string;
}

const ConfigurePage: React.FC = () => {
  const [difficultyOpen, setDifficultyOpen] = useState(false);
  const [testModeOpen, setTestModeOpen] = useState(false);

  const [selectedDifficulty, setSelectedDifficulty] = useState("Easy");
  const [selectedTestMode, setSelectedTestMode] = useState("Text");

  const difficulties: SelectOption[] = [
    { label: "🟢 Easy", value: "Easy", color: "text-green-500" },
    { label: "🟡 Medium", value: "Medium", color: "text-yellow-500" },
    { label: "🔴 Hard", value: "Hard", color: "text-red-500" },
  ];

  const testModes: SelectOption[] = [
    { label: "Text", value: "Text" },
    { label: "Code", value: "Code" },
    { label: "Random", value: "Random" },
  ];

  const handleDifficultyToggle = () => {
    setDifficultyOpen(!difficultyOpen);
    setTestModeOpen(false);
  };

  const handleTestModeToggle = () => {
    setTestModeOpen(!testModeOpen);
    setDifficultyOpen(false);
  };

  const handleDifficultySelect = (value: string) => {
    setSelectedDifficulty(value);
    setDifficultyOpen(false);
    setTestModeOpen(false);
  };

  const handleTestModeSelect = (value: string) => {
    setSelectedTestMode(value);
    setTestModeOpen(false);
  };

  const navigate = useNavigate();

  return (
    <div className="w-full flex flex-col items-center mt-20 px-4">
      <h2 className="mb-8 text-2xl sm:text-4xl font-bold text-gray-800 text-center">
        Configure your Test
      </h2>
      <div className="relative max-w-md w-full ">
        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          <CustomSelect
            label="Select Difficulty"
            options={difficulties}
            selected={selectedDifficulty}
            isOpen={difficultyOpen}
            onToggle={handleDifficultyToggle}
            onSelect={handleDifficultySelect}
          />

          <CustomSelect
            label="Select Test Mode"
            options={testModes}
            selected={selectedTestMode}
            isOpen={testModeOpen}
            onToggle={handleTestModeToggle}
            onSelect={handleTestModeSelect}
          />

          <button
            onClick={() => navigate("/test", { state: { difficulty: selectedDifficulty, mode: selectedTestMode } })}
            type="button"
            className="bg-indigo-600 py-5 px-6 cursor-pointer rounded-lg w-full mt-2 text-white font-medium text-lg sm:text-xl hover:bg-indigo-700"
          >
            Start Test
          </button>
        </form>

        <style>{` 
        @keyframes fadeIn {
          0% { opacity: 0; transform: translateY(-5px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      </div>
    </div>
  );
};

export default ConfigurePage;
