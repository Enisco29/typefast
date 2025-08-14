import Hero from '../components/Hero'
import { CheckCircle2, Timer, BrainCircuit, BarChart3 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const Feature = ({ icon: Icon, title, desc }: { icon: any, title: string, desc: string }) => (
  <div className="p-6 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition">
    <div className="flex items-center gap-3">
      <div className="p-2 rounded-full bg-indigo-50 text-indigo-600"><Icon size={20} /></div>
      <h3 className="text-lg font-semibold">{title}</h3>
    </div>
    <p className="text-gray-600 mt-3">{desc}</p>
  </div>
)

const HomePage = () => {
  const navigate = useNavigate()
  return (
    <div className="flex flex-col">
      <Hero/>

      <section className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-14">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-8">Why TypeFast?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Feature icon={BrainCircuit} title="AI-tailored Passages" desc="Content adapts to your difficulty and mode preferences to keep you engaged." />
            <Feature icon={Timer} title="Smart Timer" desc="Set your session length and stay focused with a clean countdown." />
            <Feature icon={BarChart3} title="Instant Feedback" desc="See accuracy and WPM as you type to improve in real time." />
            <Feature icon={CheckCircle2} title="Practice That Sticks" desc="Backspace and paste disabled to build true muscle memory and accuracy." />
          </div>
        </div>
      </section>

      <section>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-14">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl bg-white border border-gray-100">
              <p className="text-sm text-indigo-600 font-semibold mb-2">Step 1</p>
              <h3 className="text-xl font-semibold mb-2">Configure Your Test</h3>
              <p className="text-gray-600">Choose your difficulty, mode (Text, Code, Random), and session time.</p>
            </div>
            <div className="p-6 rounded-xl bg-white border border-gray-100">
              <p className="text-sm text-indigo-600 font-semibold mb-2">Step 2</p>
              <h3 className="text-xl font-semibold mb-2">Practice With AI</h3>
              <p className="text-gray-600">We generate a clean passage suited to your level. Just type — no distractions.</p>
            </div>
            <div className="p-6 rounded-xl bg-white border border-gray-100">
              <p className="text-sm text-indigo-600 font-semibold mb-2">Step 3</p>
              <h3 className="text-xl font-semibold mb-2">Track Your Progress</h3>
              <p className="text-gray-600">See accuracy and WPM instantly and review your full history anytime.</p>
            </div>
          </div>

          <div className="mt-10 flex justify-center">
            <button onClick={() => navigate('/configure')} className="px-8 py-3 rounded-lg bg-indigo-600 text-white font-semibold shadow hover:bg-indigo-700 transition">
              Get Started
            </button>
          </div>
        </div>
      </section>

      <section className="bg-indigo-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-14 flex flex-col lg:flex-row items-center gap-8">
          <div className="flex-1">
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Built for focus and growth</h3>
            <p className="text-gray-700">We keep the interface clean and accessible across devices, so you can focus on improvement. Customize your sessions and let the AI keep things fresh.</p>
          </div>
          <div className="flex-1 flex justify-center">
            <div className="rounded-xl border border-indigo-200 bg-white p-6 shadow-sm w-full max-w-md">
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-center gap-3"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Responsive design</li>
                <li className="flex items-center gap-3"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Keyboard-first interactions</li>
                <li className="flex items-center gap-3"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Privacy-friendly local history</li>
                <li className="flex items-center gap-3"><span className="h-2 w-2 rounded-full bg-emerald-500" /> No distractions</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage