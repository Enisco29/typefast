import React, { useState } from 'react'

type AuthMode = 'login' | 'signup'

const Login = () => {
  const [mode, setMode] = useState<AuthMode>('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  const isSignup = mode === 'signup'

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (isSignup && password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    // Placeholder submit handlers — replace with real auth calls
    if (mode === 'login') {
      // login(email, password)
      console.log('Logging in with', { email, password })
    } else {
      // signup(name, email, password)
      console.log('Signing up with', { name, email, password })
    }
  }

  const switchMode = () => {
    setMode((m) => (m === 'login' ? 'signup' : 'login'))
    setError(null)
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 border border-gray-200 rounded-2xl shadow-sm p-6 sm:p-8">
        <div className="mb-6 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold">
            {isSignup ? 'Create an account' : 'Welcome back'}
          </h1>
          <p className="mt-2 text-gray-600">
            {isSignup ? 'Sign up to start tracking your typing progress.' : 'Login to continue your practice.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignup && (
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              minLength={6}
            />
          </div>

          {isSignup && (
            <div>
              <label htmlFor="confirm" className="block text-sm font-medium text-gray-700">Confirm password</label>
              <input
                id="confirm"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                minLength={6}
              />
            </div>
          )}

          {error && (
            <div className="text-sm text-red-600" role="alert">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 text-white font-semibold py-2.5 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {isSignup ? 'Sign up' : 'Log in'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-700">
          {isSignup ? (
            <>
              Already have an account?{' '}
              <button type="button" onClick={switchMode} className="font-semibold text-blue-600 hover:underline">
                Log in
              </button>
            </>
          ) : (
            <>
              Don't have an account?{' '}
              <button type="button" onClick={switchMode} className="font-semibold text-blue-600 hover:underline">
                Sign up
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Login
