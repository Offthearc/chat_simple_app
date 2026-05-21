import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuthContext } from './contexts/AuthContext'
import { Header } from './components/layout/Header'
import { Sidebar } from './components/layout/Sidebar'
import { AuthPage } from './pages/AuthPage'
import { ChatPage } from './pages/ChatPage'
import { DirectMessagesPage } from './pages/DirectMessagesPage'
import { ArticlesPage } from './pages/ArticlesPage'
import { WelcomePage } from './pages/WelcomePage'
import { useRooms } from './hooks/useRooms'
import { useAuthContext as useAuth } from './contexts/AuthContext'

function CreateRoomModal({ onClose, onCreate }: {
  onClose: () => void
  onCreate: (name: string, description: string, userId: string) => Promise<{ error: string | null }>
}) {
  const { user } = useAuth()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!user) return
    setLoading(true)
    const { error: err } = await onCreate(name.trim().toLowerCase().replace(/\s+/g, '-'), description.trim(), user.id)
    setLoading(false)
    if (err) setError(err)
    else onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-sm p-6">
        <h3 className="text-white font-semibold mb-4">Create Room</h3>
        {error && <p className="text-red-400 text-sm mb-3">{error}</p>}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="room-name"
            required
            className="bg-gray-700 text-white rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            data-testid="room-name-input"
          />
          <input
            type="text"
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Description (optional)"
            className="bg-gray-700 text-white rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <div className="flex gap-2 justify-end">
            <button type="button" onClick={onClose} className="text-gray-400 hover:text-white text-sm px-3 py-2">
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !name.trim()}
              className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white rounded px-4 py-2 text-sm font-semibold"
            >
              {loading ? 'Creating…' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function AppShell() {
  const { user, loading } = useAuthContext()
  const { rooms, createRoom } = useRooms()
  const [showCreateRoom, setShowCreateRoom] = useState(false)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <span className="text-gray-500 text-sm">Loading…</span>
      </div>
    )
  }

  if (!user) return <AuthPage />

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar rooms={rooms} onCreateRoom={() => setShowCreateRoom(true)} />
        <main className="flex flex-1 overflow-hidden bg-gray-750" style={{ backgroundColor: '#1e2130' }}>
          <Routes>
            <Route path="/" element={<WelcomePage />} />
            <Route path="/chat/:roomId" element={<ChatPage />} />
            <Route path="/dm" element={<DirectMessagesPage />} />
            <Route path="/articles" element={<ArticlesPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
      {showCreateRoom && (
        <CreateRoomModal
          onClose={() => setShowCreateRoom(false)}
          onCreate={createRoom}
        />
      )}
    </div>
  )
}

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppShell />
      </AuthProvider>
    </BrowserRouter>
  )
}
