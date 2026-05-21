import { useAuthContext } from '../../contexts/AuthContext'
import { useDirectMessages } from '../../hooks/useDirectMessages'
import { MessageList } from '../chat/MessageList'
import { MessageInput } from '../chat/MessageInput'
import type { Profile } from '../../types'
import type { Message } from '../../types'

interface DirectMessageViewProps {
  otherUser: Profile
}

export function DirectMessageView({ otherUser }: DirectMessageViewProps) {
  const { user } = useAuthContext()
  const { messages, loading, sendMessage } = useDirectMessages(user?.id ?? '', otherUser.id)

  const adaptedMessages: Message[] = messages.map(dm => ({
    id: dm.id,
    room_id: '',
    user_id: dm.sender_id,
    content: dm.content,
    created_at: dm.created_at,
    profile: dm.sender,
  }))

  async function handleSend(content: string) {
    return sendMessage(content)
  }

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-700 flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-indigo-700 flex items-center justify-center text-xs font-bold text-white">
          {otherUser.username[0].toUpperCase()}
        </div>
        <div>
          <h2 className="text-white font-semibold text-sm">@{otherUser.username}</h2>
          <p className="text-xs text-gray-500">Direct message</p>
        </div>
      </div>
      {loading ? (
        <div className="flex-1 flex items-center justify-center text-gray-500 text-sm">Loading…</div>
      ) : (
        <MessageList messages={adaptedMessages} currentUserId={user?.id ?? ''} />
      )}
      <MessageInput onSend={handleSend} placeholder={`Message @${otherUser.username}…`} />
    </div>
  )
}
