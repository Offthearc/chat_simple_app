import { useParams } from 'react-router-dom'
import { useRooms } from '../hooks/useRooms'
import { ChatRoom } from '../components/chat/ChatRoom'

export function ChatPage() {
  const { roomId } = useParams<{ roomId: string }>()
  const { rooms, loading } = useRooms()

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500 text-sm">
        Loading rooms…
      </div>
    )
  }

  const room = rooms.find(r => r.id === roomId)

  if (!room) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500 text-sm">
        Room not found. Select one from the sidebar.
      </div>
    )
  }

  return <ChatRoom room={room} />
}
