import { useEffect, useRef } from 'react'
import type { Message } from '../../types'

interface MessageListProps {
  messages: Message[]
  currentUserId: string
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

export function MessageList({ messages, currentUserId }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500 text-sm">
        No messages yet. Be the first to say something!
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-3" data-testid="message-list">
      {messages.map(msg => {
        const isOwn = msg.user_id === currentUserId
        return (
          <div key={msg.id} className={`flex gap-3 ${isOwn ? 'flex-row-reverse' : ''}`}>
            <div className="w-8 h-8 rounded-full bg-indigo-700 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
              {(msg.profile?.username ?? '?')[0].toUpperCase()}
            </div>
            <div className={`max-w-xs lg:max-w-md ${isOwn ? 'items-end' : 'items-start'} flex flex-col`}>
              <div className={`flex items-baseline gap-2 ${isOwn ? 'flex-row-reverse' : ''}`}>
                <span className="text-xs font-semibold text-gray-300">
                  {msg.profile?.username ?? 'Unknown'}
                </span>
                <span className="text-xs text-gray-600">{formatTime(msg.created_at)}</span>
              </div>
              <div
                className={`rounded-lg px-3 py-2 text-sm mt-0.5 ${
                  isOwn ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-100'
                }`}
              >
                {msg.content}
              </div>
            </div>
          </div>
        )
      })}
      <div ref={bottomRef} />
    </div>
  )
}
