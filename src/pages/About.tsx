import React from "react";

const About: React.FC = () => {
  const year = new Date().getFullYear();

  return (
    <div className="w-full min-h-[41vw] flex flex-col items-center">
      <div className="w-[90%] max-w-[1100px] py-12">
        <div className="flex items-center gap-4 mb-8">
          <h1 className="text-[40px] font-semibold">About TypeFast</h1>
        </div>

        <p className="text-gray-700 text-lg leading-7 mb-6">
          TypeFast is an interactive typing practice app designed to improve
          your speed and accuracy through guided tests. Choose your preferred
          difficulty and content type, and measure your performance with
          real-time scoring and history tracking.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="p-6 rounded-xl bg-gray-50 border border-gray-200">
            <h2 className="text-xl font-semibold mb-3">Key Features</h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>
                AI-generated passages tailored by difficulty and mode (Text,
                Code, Random)
              </li>
              <li>Timer with configurable duration</li>
              <li>Instant accuracy and WPM feedback</li>
              <li>Progress history saved on your device</li>
              <li>Clean, distraction-free test interface</li>
            </ul>
          </div>

          <div className="p-6 rounded-xl bg-gray-50 border border-gray-200">
            <h2 className="text-xl font-semibold mb-3">Technology</h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>React + TypeScript + Vite</li>
              <li>TailwindCSS UI</li>
              <li>Google Gemini for AI text generation</li>
              <li>Client-side storage (localStorage) for history</li>
            </ul>
          </div>
        </div>

        <div className="p-6 rounded-xl bg-blue-50 border border-blue-100 mb-10">
          <h2 className="text-xl font-semibold mb-2 text-blue-900">
            How it works
          </h2>
          <ol className="list-decimal pl-6 space-y-2 text-blue-900/80">
            <li>Configure your test: pick difficulty, mode, and timer.</li>
            <li>
              We fetch or generate a passage with AI that matches your
              preferences.
            </li>
            <li>
              Type the passage; backspace and paste are disabled for fair
              results.
            </li>
            <li>
              See your results instantly, and view your full history anytime.
            </li>
          </ol>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="p-6 rounded-xl bg-gray-50 border border-gray-200">
            <h2 className="text-xl font-semibold mb-3">Contact</h2>
            <p className="text-gray-700 mb-2">
              We value feedback and suggestions.
            </p>
            <ul className="space-y-2 text-blue-700">
              <li>
                <a
                  className="hover:underline"
                  href="mailto:opeyemioluwafisayo29@gmail.com"
                >
                  Send a Mail
                </a>
              </li>
              <li>
                <a
                  className="hover:underline"
                  href="https://github.com/Enisco29"
                  target="_blank"
                  rel="noreferrer"
                >
                  GitHub
                </a>
              </li>
              <li>
                <p>
                  Support us{"   "}{" "}
                  <span className="p-2 font-medium text-xl bg-green-200 rounded-md">
                    Opay 8143166138
                  </span>
                </p>
              </li>
            </ul>
          </div>

          <div className="p-6 rounded-xl bg-gray-50 border border-gray-200">
            <h2 className="text-xl font-semibold mb-3">Acknowledgements</h2>
            <p className="text-gray-700">
              Icons by lucide-react. AI text by Google Gemini. Built with love
              using React and TailwindCSS.
            </p>
          </div>
        </div>

        <footer className="border-t border-gray-200 pt-6 text-center text-gray-600">
          <p>© {year} TypeFast. All rights reserved.</p>
          <p className="text-sm mt-1">
            This application stores test history locally on your device.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default About;
