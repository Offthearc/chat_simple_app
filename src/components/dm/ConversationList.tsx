import type { Profile } from '../../types'

interface ConversationListProps {
  users: Profile[]
  selectedUserId: string | null
  onSelect: (userId: string) => void
}

export function ConversationList({ users, selectedUserId, onSelect }: ConversationListProps) {
  return (
    <aside className="w-52 border-r border-gray-700 bg-gray-800 flex flex-col" data-testid="conversation-list">
      <div className="px-4 py-3 border-b border-gray-700">
        <h2 className="text-sm font-semibold text-gray-300">Direct Messages</h2>
      </div>
      <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-1">
        {users.length === 0 && (
          <p className="text-xs text-gray-600 px-2 py-2">No other users yet.</p>
        )}
        {users.map(u => (
          <button
            key={u.id}
            onClick={() => onSelect(u.id)}
            className={`flex items-center gap-2 px-3 py-2 rounded text-left transition-colors w-full ${
              selectedUserId === u.id
                ? 'bg-indigo-600 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
            data-testid={`user-${u.id}`}
          >
            <div className="w-7 h-7 rounded-full bg-indigo-700 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
              {u.username[0].toUpperCase()}
            </div>
            <span className="text-sm truncate">{u.username}</span>
          </button>
        ))}
      </div>
    </aside>
  )
}
