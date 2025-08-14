import { useNavigate } from "react-router-dom";
import HeroImage from "../assets/hero_image.png";

const Hero = () => {
  const navigate = useNavigate();
  return (
    <section className="relative overflow-hidden bg-white">
      {/* subtle decorative shapes */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-sky-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-fuchsia-200/40 blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <div className="pt-16 pb-12 sm:pt-24 sm:pb-16 lg:pt-28 lg:pb-24 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="text-center lg:text-left">
            <h1 className="font-extrabold text-4xl sm:text-5xl lg:text-6xl leading-tight bg-gradient-to-r from-slate-900 via-sky-700 to-indigo-700 bg-clip-text text-transparent">
              Master your typing.
            </h1>
            <p className="mt-5 text-slate-600 text-lg sm:text-xl max-w-2xl mx-auto lg:mx-0">
              Practice with AI‑generated passages tailored to your level. Improve accuracy and speed with a clean, distraction‑free experience.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button
                className="px-7 py-3 rounded-lg bg-sky-600 text-white font-semibold shadow hover:bg-sky-700 transition"
                onClick={() => navigate("/configure")}
              >
                Start Test
              </button>
              <button
                className="px-7 py-3 rounded-lg bg-white text-sky-700 font-semibold border border-sky-200 hover:border-sky-300 hover:shadow-sm transition"
                onClick={() => navigate("/history")}
              >
                View History
              </button>
            </div>
            <div className="mt-6 text-slate-500 text-sm">
              Customize difficulty, mode, and timer. Backspace and paste are disabled for fair results.
            </div>
          </div>

          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              <img
                src={HeroImage}
                alt="Typing practice illustration"
                className="w-full max-w-[560px] h-auto drop-shadow-xl rounded-xl ring-1 ring-slate-200"
              />
              <div className="absolute -bottom-4 -left-4 bg-white/95 text-slate-700 text-sm px-4 py-2 rounded-lg shadow hidden sm:flex items-center gap-2 ring-1 ring-slate-200">
                <span className="h-2 w-2 rounded-full bg-emerald-500" /> Live accuracy preview
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
