# TypeFast

A modern typing practice app with AI‑generated passages, configurable difficulty and modes, real‑time feedback, and local history — built with React, TypeScript, Vite, and TailwindCSS.

## Features

- AI passages powered by Google Gemini, tailored by:
  - Difficulty: Easy, Medium, Hard
  - Mode: Text, Code, Random
- Distraction‑free typing test
  - Backspace and paste disabled for fair practice
  - Multi‑line input and target text highlighting (green/red)
- Timer (customizable; default 60s)
- Live accuracy and WPM
- Test history stored on your device (localStorage)
- Route protection
  - Test page requires configuration
  - Result page requires a completed test in current session
- Responsive UI and mobile hamburger navigation

## Tech Stack

- React + TypeScript + Vite
- TailwindCSS
- lucide‑react icons
- Google Gemini (Generative Language API)

## Getting Started

### 1) Prerequisites
- Node.js 18+

### 2) Install dependencies
```bash
npm install
```

### 3) Environment variables
Create a `.env` file in the project root with your Gemini API key:
```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```
If this key is missing or the API call fails, the app uses safe built‑in fallback passages.

### 4) Run the app
```bash
npm run dev
```
Then open the printed local URL (usually `http://localhost:5173`).

## Usage

1. Go to Configure and choose:
   - Difficulty (Easy/Medium/Hard)
   - Mode (Text/Code/Random)
   - Timer duration (seconds)
2. Start the test. The target passage is generated (or falls back) based on your preferences.
3. Type the passage:
   - Correct chars show green, incorrect red
   - Backspace and paste are disabled
4. When the timer ends or you complete the passage correctly, results are saved and the app navigates to Results.
5. View past results in History.

## Route Protection

- Test (`/test`) requires configuration. If you navigate directly without state, you’ll be redirected to `/configure`.
- Result (`/result`) requires a test just completed in this session. A one‑time session token enables access and is consumed on entry.

## Project Structure

```
src/
  App.tsx                # Routes and guards
  components/
    Navbar.tsx           # Responsive navbar with hamburger
    Hero.tsx             # Home hero section
  pages/
    HomePage.tsx         # Landing page
    ConfigurePage.tsx    # Test configuration
    TestPage.tsx         # Typing test (AI text, timer, UI)
    ResultPage.tsx       # Displays latest test result
    HistoryPage.tsx      # Local history viewer
    About.tsx            # About, contact, acknowledgements
  services/
    ai.ts                # Gemini text generation with fallbacks
```

## Scripts

- `npm run dev` — start dev server
- `npm run build` — production build
- `npm run preview` — preview production build locally

## Styling

- TailwindCSS utility classes
- Responsive layout for mobile, tablet, desktop

## License

MIT License

Copyright (c) 2025 TypeFast

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.