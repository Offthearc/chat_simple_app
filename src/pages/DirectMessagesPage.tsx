import { useState } from 'react'
import { useAuthContext } from '../contexts/AuthContext'
import { useAllUsers } from '../hooks/useDirectMessages'
import { ConversationList } from '../components/dm/ConversationList'
import { DirectMessageView } from '../components/dm/DirectMessageView'

export function DirectMessagesPage() {
  const { user } = useAuthContext()
  const users = useAllUsers(user?.id ?? '')
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)

  const selectedUser = users.find(u => u.id === selectedUserId)

  return (
    <div className="flex flex-1 overflow-hidden">
      <ConversationList
        users={users}
        selectedUserId={selectedUserId}
        onSelect={setSelectedUserId}
      />
      <div className="flex flex-col flex-1 overflow-hidden">
        {selectedUser ? (
          <DirectMessageView otherUser={selectedUser} />
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500 text-sm">
            Select a user to start a conversation
          </div>
        )}
      </div>
    </div>
  )
}
