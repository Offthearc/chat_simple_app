import { type FormEvent, useState } from 'react'
import { useAuthContext } from '../../contexts/AuthContext'

interface RegisterFormProps {
  onSwitch: () => void
}

export function RegisterForm({ onSwitch }: RegisterFormProps) {
  const { signUp } = useAuthContext()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (username.trim().length < 3) {
      setError('Username must be at least 3 characters')
      return
    }
    setLoading(true)
    setError(null)
    const { error: err } = await signUp(email, password, username.trim())
    setLoading(false)
    if (err) {
      setError(err)
    } else {
      setSuccess(true)
    }
  }

  if (success) {
    return (
      <div className="text-center text-green-400 py-4">
        <p className="text-lg font-semibold">Account created!</p>
        <p className="text-sm text-gray-400 mt-1">
          You can now{' '}
          <button onClick={onSwitch} className="text-indigo-400 hover:underline">
            sign in
          </button>
          .
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" data-testid="register-form">
      <h2 className="text-xl font-bold text-white text-center">Create account</h2>
      {error && (
        <p className="text-red-400 text-sm bg-red-900/20 border border-red-800 rounded px-3 py-2" role="alert">
          {error}
        </p>
      )}
      <div>
        <label className="block text-sm text-gray-400 mb-1">Username</label>
        <input
          type="text"
          value={username}
          onChange={e => setUsername(e.target.value)}
          placeholder="yourname"
          required
          className="w-full bg-gray-700 text-white rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          data-testid="username-input"
        />
      </div>
      <div>
        <label className="block text-sm text-gray-400 mb-1">Email</label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
          className="w-full bg-gray-700 text-white rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          data-testid="email-input"
        />
      </div>
      <div>
        <label className="block text-sm text-gray-400 mb-1">Password</label>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="••••••••"
          required
          minLength={6}
          className="w-full bg-gray-700 text-white rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          data-testid="password-input"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded px-4 py-2 text-sm font-semibold transition-colors"
        data-testid="submit-btn"
      >
        {loading ? 'Creating account…' : 'Create account'}
      </button>
      <p className="text-center text-sm text-gray-500">
        Already have an account?{' '}
        <button type="button" onClick={onSwitch} className="text-indigo-400 hover:underline">
          Sign in
        </button>
      </p>
    </form>
  )
}
