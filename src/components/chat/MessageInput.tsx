import { type FormEvent, useState } from 'react'

interface MessageInputProps {
  onSend: (content: string) => Promise<{ error: string | null }>
  placeholder?: string
}

export function MessageInput({ onSend, placeholder = 'Message…' }: MessageInputProps) {
  const [value, setValue] = useState('')
  const [sending, setSending] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const content = value.trim()
    if (!content) return
    setSending(true)
    await onSend(content)
    setValue('')
    setSending(false)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      void handleSubmit(e as unknown as FormEvent)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="px-4 py-3 border-t border-gray-700 flex gap-2" data-testid="message-input-form">
      <textarea
        value={value}
        onChange={e => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        rows={1}
        className="flex-1 bg-gray-700 text-white rounded px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
        data-testid="message-textarea"
      />
      <button
        type="submit"
        disabled={sending || !value.trim()}
        className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white rounded px-4 py-2 text-sm font-semibold transition-colors"
        data-testid="send-btn"
      >
        Send
      </button>
    </form>
  )
}
