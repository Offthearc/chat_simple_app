import type { Poll, PollVote } from '../../types'

interface PollProps {
  poll: Poll
  votes: PollVote[]
  userVote: PollVote | undefined
  userId: string
  onVote: (pollId: string, optionIndex: number, userId: string) => Promise<{ error: string | null }>
}

export function PollComponent({ poll, votes, userVote, userId, onVote }: PollProps) {
  const totalVotes = votes.length
  const hasVoted = !!userVote

  function getCount(index: number) {
    return votes.filter(v => v.option_index === index).length
  }

  function getPct(index: number) {
    if (totalVotes === 0) return 0
    return Math.round((getCount(index) / totalVotes) * 100)
  }

  return (
    <div className="border border-gray-700 rounded-lg p-3 bg-gray-900" data-testid="poll">
      <p className="text-sm font-semibold text-white mb-2">{poll.question}</p>
      <div className="flex flex-col gap-1.5">
        {(poll.options as string[]).map((option, idx) => (
          <button
            key={idx}
            onClick={() => !hasVoted && onVote(poll.id, idx, userId)}
            disabled={hasVoted}
            className={`relative text-left rounded px-3 py-1.5 text-sm overflow-hidden border transition-colors ${
              userVote?.option_index === idx
                ? 'border-indigo-500 text-indigo-300'
                : hasVoted
                ? 'border-gray-700 text-gray-400'
                : 'border-gray-600 text-gray-300 hover:border-indigo-500 hover:text-white'
            }`}
            data-testid={`poll-option-${idx}`}
          >
            {hasVoted && (
              <span
                className="absolute inset-y-0 left-0 bg-indigo-900/40 transition-all"
                style={{ width: `${getPct(idx)}%` }}
              />
            )}
            <span className="relative flex justify-between">
              <span>{option}</span>
              {hasVoted && (
                <span className="text-xs text-gray-400">{getPct(idx)}%</span>
              )}
            </span>
          </button>
        ))}
      </div>
      <p className="text-xs text-gray-500 mt-2">{totalVotes} vote{totalVotes !== 1 ? 's' : ''}</p>
    </div>
  )
}
