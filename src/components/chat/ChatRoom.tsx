import { useMessages } from '../../hooks/useMessages'
import { useAuthContext } from '../../contexts/AuthContext'
import { MessageList } from './MessageList'
import { MessageInput } from './MessageInput'
import type { ChatRoom as ChatRoomType } from '../../types'
import { PollList } from '../polls/PollList'
import { usePolls } from '../../hooks/usePolls'

interface ChatRoomProps {
  room: ChatRoomType
}

export function ChatRoom({ room }: ChatRoomProps) {
  const { user } = useAuthContext()
  const { messages, loading, sendMessage } = useMessages(room.id)
  const { polls, getVotesForPoll, getUserVote, vote, createPoll } = usePolls(room.id)

  async function handleSend(content: string) {
    if (!user) return { error: 'Not authenticated' }
    return sendMessage(content, user.id)
  }

  return (
    <div className="flex flex-1 overflow-hidden">
      <div className="flex flex-col flex-1 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-700 flex-shrink-0">
          <h2 className="text-white font-semibold"># {room.name}</h2>
          {room.description && <p className="text-xs text-gray-400 mt-0.5">{room.description}</p>}
        </div>
        {loading ? (
          <div className="flex-1 flex items-center justify-center text-gray-500 text-sm">Loading…</div>
        ) : (
          <MessageList messages={messages} currentUserId={user?.id ?? ''} />
        )}
        <MessageInput onSend={handleSend} placeholder={`Message #${room.name}…`} />
      </div>

      <div className="w-64 border-l border-gray-700 overflow-y-auto flex-shrink-0 bg-gray-800">
        <PollList
          polls={polls}
          userId={user?.id ?? ''}
          roomId={room.id}
          getVotesForPoll={getVotesForPoll}
          getUserVote={getUserVote}
          onVote={vote}
          onCreatePoll={createPoll}
        />
      </div>
    </div>
  )
}
