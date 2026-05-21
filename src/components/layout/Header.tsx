import { useAuthContext } from '../../contexts/AuthContext'

export function Header() {
  const { profile, signOut } = useAuthContext()

  return (
    <header className="h-14 bg-gray-900 border-b border-gray-700 flex items-center justify-between px-4 flex-shrink-0">
      <div className="flex items-center gap-2">
        <span className="text-xl font-bold text-indigo-400">ChatApp</span>
        <span className="text-gray-500 text-sm">— AI Discussions</span>
      </div>
      {profile && (
        <div className="flex items-center gap-3">
          <span className="text-gray-300 text-sm">@{profile.username}</span>
          <button
            onClick={signOut}
            className="text-xs text-gray-400 hover:text-white transition-colors"
          >
            Sign out
          </button>
        </div>
      )}
    </header>
  )
}
