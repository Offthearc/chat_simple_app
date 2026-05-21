import { NavLink } from 'react-router-dom'
import type { ChatRoom } from '../../types'

interface SidebarProps {
  rooms: ChatRoom[]
  onCreateRoom: () => void
}

export function Sidebar({ rooms, onCreateRoom }: SidebarProps) {
  const navClass = ({ isActive }: { isActive: boolean }) =>
    `block px-3 py-1.5 rounded text-sm transition-colors ${
      isActive ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-700'
    }`

  return (
    <aside className="w-56 bg-gray-800 flex flex-col border-r border-gray-700 flex-shrink-0">
      <nav className="p-3 flex flex-col gap-1">
        <NavLink to="/articles" className={navClass}>
          📰 AI Articles
        </NavLink>
        <NavLink to="/dm" className={navClass}>
          💬 Direct Messages
        </NavLink>
      </nav>

      <div className="px-3 py-2">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Rooms</span>
          <button
            onClick={onCreateRoom}
            className="text-gray-500 hover:text-white text-lg leading-none"
            title="Create room"
          >
            +
          </button>
        </div>
        <div className="flex flex-col gap-0.5">
          {rooms.map(room => (
            <NavLink key={room.id} to={`/chat/${room.id}`} className={navClass}>
              # {room.name}
            </NavLink>
          ))}
        </div>
      </div>
    </aside>
  )
}
