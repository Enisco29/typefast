import { ChevronDown, Check } from "lucide-react";

interface SelectOption {
  label: string;
  value: string;
  color?: string;
}

interface CustomSelectProps {
  label: string;
  options: SelectOption[];
  selected: string;
  isOpen: boolean;
  onToggle: () => void;
  onSelect: (value: string) => void;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  label,
  options,
  selected,
  isOpen,
  onToggle,
  onSelect,
}) => {
  const selectedOption = options.find((option) => option.value === selected);

  return (
    <div className="relative">
      <label className="block mb-2 font-medium text-xl text-gray-700">
        {label}
      </label>

      <div
        onClick={onToggle}
        className="flex justify-between w-full items-center bg-white border border-gray-300 rounded-xl px-4 py-5
         cursor-pointer shadow-sm hover:shadow-md focus:ring-2 focus:ring-indigo-400 transition-all duration-200"
      >
        <span className="text-xl">{selectedOption?.label || selected}</span>
        <ChevronDown
          className={`transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </div>

      {isOpen && (
        <div
          className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden"
          style={{
            animation: "fadeIn 0.2s ease-out",
          }}
        >
          {options.map((option) => (
            <div
              key={option.value}
              onClick={() => onSelect(option.value)}
              className="flex justify-between items-center px-4 py-2 hover:bg-indigo-50 cursor-pointer transition-all duration-150"
            >
              <span className={`font-medium ${option.color || ""}`}>
                {option.label}
              </span>
              {selected === option.value && (
                <Check className="text-indigo-500" size={16} />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomSelect;
