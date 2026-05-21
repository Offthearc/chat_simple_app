import { useState } from 'react'
import type { Poll, PollVote } from '../../types'
import { PollComponent } from './Poll'
import { CreatePoll } from './CreatePoll'

interface PollListProps {
  polls: Poll[]
  userId: string
  roomId: string
  getVotesForPoll: (pollId: string) => PollVote[]
  getUserVote: (pollId: string, userId: string) => PollVote | undefined
  onVote: (pollId: string, optionIndex: number, userId: string) => Promise<{ error: string | null }>
  onCreatePoll: (question: string, options: string[], userId: string) => Promise<{ error: string | null }>
}

export function PollList({ polls, userId, roomId, getVotesForPoll, getUserVote, onVote, onCreatePoll }: PollListProps) {
  const [creating, setCreating] = useState(false)

  return (
    <div className="p-3 flex flex-col gap-3" data-testid="poll-list">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Polls</span>
        {!creating && (
          <button
            onClick={() => setCreating(true)}
            className="text-xs text-indigo-400 hover:text-indigo-300"
            data-testid="new-poll-btn"
          >
            + New
          </button>
        )}
      </div>

      {creating && (
        <CreatePoll
          userId={userId}
          roomId={roomId}
          onCreatePoll={onCreatePoll}
          onClose={() => setCreating(false)}
        />
      )}

      {polls.length === 0 && !creating && (
        <p className="text-xs text-gray-600">No polls yet.</p>
      )}

      {polls.map(poll => (
        <PollComponent
          key={poll.id}
          poll={poll}
          votes={getVotesForPoll(poll.id)}
          userVote={getUserVote(poll.id, userId)}
          userId={userId}
          onVote={onVote}
        />
      ))}
    </div>
  )
}
