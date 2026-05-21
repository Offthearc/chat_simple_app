import { type FormEvent, useState } from 'react'

interface CreatePollProps {
  userId: string
  roomId: string
  onCreatePoll: (question: string, options: string[], userId: string) => Promise<{ error: string | null }>
  onClose: () => void
}

export function CreatePoll({ userId, onCreatePoll, onClose }: CreatePollProps) {
  const [question, setQuestion] = useState('')
  const [options, setOptions] = useState(['', ''])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  function updateOption(idx: number, value: string) {
    setOptions(prev => prev.map((o, i) => (i === idx ? value : o)))
  }

  function addOption() {
    if (options.length < 5) setOptions(prev => [...prev, ''])
  }

  function removeOption(idx: number) {
    if (options.length > 2) setOptions(prev => prev.filter((_, i) => i !== idx))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const validOptions = options.map(o => o.trim()).filter(Boolean)
    if (validOptions.length < 2) {
      setError('At least 2 options required')
      return
    }
    setLoading(true)
    const { error: err } = await onCreatePoll(question.trim(), validOptions, userId)
    setLoading(false)
    if (err) setError(err)
    else onClose()
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3" data-testid="create-poll-form">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-white">New Poll</span>
        <button type="button" onClick={onClose} className="text-gray-500 hover:text-white text-lg leading-none">×</button>
      </div>
      {error && <p className="text-red-400 text-xs">{error}</p>}
      <div>
        <label className="block text-xs text-gray-400 mb-1">Question</label>
        <input
          type="text"
          value={question}
          onChange={e => setQuestion(e.target.value)}
          placeholder="Ask something…"
          required
          className="w-full bg-gray-700 text-white rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
          data-testid="poll-question-input"
        />
      </div>
      <div>
        <label className="block text-xs text-gray-400 mb-1">Options</label>
        <div className="flex flex-col gap-1">
          {options.map((opt, idx) => (
            <div key={idx} className="flex gap-1">
              <input
                type="text"
                value={opt}
                onChange={e => updateOption(idx, e.target.value)}
                placeholder={`Option ${idx + 1}`}
                className="flex-1 bg-gray-700 text-white rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                data-testid={`poll-option-input-${idx}`}
              />
              {options.length > 2 && (
                <button
                  type="button"
                  onClick={() => removeOption(idx)}
                  className="text-gray-500 hover:text-red-400 text-xs px-1"
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>
        {options.length < 5 && (
          <button
            type="button"
            onClick={addOption}
            className="text-xs text-indigo-400 hover:text-indigo-300 mt-1"
          >
            + Add option
          </button>
        )}
      </div>
      <button
        type="submit"
        disabled={loading || !question.trim()}
        className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white rounded px-3 py-1.5 text-sm font-semibold transition-colors"
        data-testid="create-poll-submit"
      >
        {loading ? 'Creating…' : 'Create poll'}
      </button>
    </form>
  )
}
