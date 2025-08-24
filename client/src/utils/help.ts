// Utility function to capitalize the first letter of each word in a string
// Function to capitalize words in a string
export function capitalizeWords(str: string): string {
  return str
    .toLowerCase()
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

// Function to format names (first name full, others abbreviated)
export function formatNames(names: string): string {
  // Capitalize the input names first
  const capitalizedInput: string = capitalizeWords(names);

  // Split the capitalized string into an array of names
  const nameList: string[] = capitalizedInput.trim().split(/\s+/);

  // Keep the first name as is, and process the rest
  const result: string[] = [nameList[0]]; // First name stays full
  for (let i = 1; i < nameList.length; i++) {
    result.push(nameList[i][0] + "."); // Take first letter and add "."
  }

  // Join the names back into a string
  return result.join(" ");
}

// Handle keydown events to prevent backspace
export const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
  if (e.key === "Backspace" || e.key === "Enter") {
    e.preventDefault();
  }
};

// Format time display
export const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};
