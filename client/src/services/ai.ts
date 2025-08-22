export type Difficulty = 'Easy' | 'Medium' | 'Hard'
export type Mode = 'Text' | 'Code' | 'Random'

interface GenerateOptions {
  difficulty: Difficulty
  mode: Mode
  maxChars?: number
}

const FALLBACK: Record<Difficulty, Record<Mode, string>> = {
  Easy: {
    Text: "The quick brown fox jumps over the lazy dog. Practice makes perfect. Keep your fingers light and steady as you type this sentence.",
    Code: "function greet(name) {\n  console.log('Hello, ' + name + '!');\n}\n\ngreet('World');",
    Random: "Sunlight warms the quiet park as children laugh and birds sing. A gentle breeze carries the scent of pine trees."
  },
  Medium: {
    Text: "Consistent practice improves typing accuracy and speed. Focus on rhythm and posture, keeping your wrists relaxed while maintaining a steady pace.",
    Code: "const sum = (list) => list.reduce((acc, n) => acc + n, 0);\nconst nums = [3, 5, 8, 13];\nconsole.log(sum(nums));",
    Random: "Mountains reflect across a glassy lake. Distant thunder hints at summer rain as wildflowers sway along the winding trail."
  },
  Hard: {
    Text: "Precision and endurance are crucial for advanced typists. Minimize extraneous motion, anticipate keystrokes, and apply steady breathing to sustain performance.",
    Code: "class LRUCache {\n  constructor(limit = 3) { this.limit = limit; this.map = new Map(); }\n  get(k){ if(!this.map.has(k)) return null; const v = this.map.get(k); this.map.delete(k); this.map.set(k, v); return v;}\n  set(k,v){ if(this.map.has(k)) this.map.delete(k); this.map.set(k,v); if(this.map.size>this.limit){ const key=this.map.keys().next().value; this.map.delete(key); } }\n}\nconst cache=new LRUCache(2); cache.set('a',1); cache.set('b',2); cache.get('a'); cache.set('c',3);",
    Random: "Quantum fluctuations subtly perturb vacuum energy fields, while thermal noise obfuscates signal integrity in high-precision instrumentation."
  }
}

const GEMINI_MODEL = 'gemini-1.5-flash'
const GEMINI_URL = (model: string, apiKey: string) => `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`

export async function generateTypingText({ difficulty, mode, maxChars = 450 }: GenerateOptions): Promise<string> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY as string | undefined
  if (!apiKey) {
    return FALLBACK[difficulty][mode]
  }

  const prompt = buildPrompt(difficulty, mode, maxChars)
  // Rough token cap (Gemini tokens ~4 chars/token). Keep safe margin
  const maxOutputTokens = Math.max(64, Math.min(512, Math.floor(maxChars / 4)))

  try {
    const res = await fetch(GEMINI_URL(GEMINI_MODEL, apiKey), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens,
        },
      }),
    })

    if (!res.ok) throw new Error('Bad response')
    const data = await res.json()
    const text: string | undefined = data?.candidates?.[0]?.content?.parts?.[0]?.text
    if (!text) throw new Error('No content')

    return text.trim().slice(0, maxChars)
  } catch {
    return FALLBACK[difficulty][mode]
  }maxChars
}

function buildPrompt(difficulty: Difficulty, mode: Mode, maxChars: number): string {
  const base = `Generate a single passage for a typing test in ${mode} mode at ${difficulty} difficulty. `
  const constraints = `Length under ${maxChars} characters. Avoid special quotes. No markdown. No backticks. Plain text only.`

  if (mode === 'Text') {
    if (difficulty === 'Easy') return `${base}Use simple words and short sentences suited for beginners. ${constraints}`
    if (difficulty === 'Medium') return `${base}Use general English with varied punctuation and compound sentences. ${constraints}`
    return `${base}Use complex structures and advanced vocabulary with punctuation variety. ${constraints}`
  }

  if (mode === 'Code') {
    if (difficulty === 'Easy') return `${base}Provide a short JavaScript function with console.log and a loop. ${constraints}`
    if (difficulty === 'Medium') return `${base}Provide a moderate JavaScript snippet using array methods and an arrow function. ${constraints}`
    return `${base}Provide a compact advanced JavaScript snippet (class or closure) without imports. ${constraints}`
  }

  // Random
  if (difficulty === 'Easy') return `${base}Provide a light everyday scenario description. ${constraints}`
  if (difficulty === 'Medium') return `${base}Provide a descriptive scene with natural elements and varied punctuation. ${constraints}`
  return `${base}Provide a technical or abstract description with rich punctuation, still readable. ${constraints}`
} 