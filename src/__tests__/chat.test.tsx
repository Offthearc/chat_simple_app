import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { MessageList } from '../components/chat/MessageList'
import { MessageInput } from '../components/chat/MessageInput'
import { PollComponent } from '../components/polls/Poll'
import { CreatePoll } from '../components/polls/CreatePoll'
import type { Message, Poll, PollVote } from '../types'

const mockMessages: Message[] = [
  {
    id: '1',
    room_id: 'room1',
    user_id: 'user1',
    content: 'Hello world!',
    created_at: new Date().toISOString(),
    profile: { id: 'user1', username: 'alice', avatar_url: null, created_at: new Date().toISOString() },
  },
  {
    id: '2',
    room_id: 'room1',
    user_id: 'user2',
    content: 'Hi there!',
    created_at: new Date().toISOString(),
    profile: { id: 'user2', username: 'bob', avatar_url: null, created_at: new Date().toISOString() },
  },
]

describe('MessageList', () => {
  it('renders messages', () => {
    render(<MessageList messages={mockMessages} currentUserId="user1" />)
    expect(screen.getByText('Hello world!')).toBeInTheDocument()
    expect(screen.getByText('Hi there!')).toBeInTheDocument()
  })

  it('shows empty state when no messages', () => {
    render(<MessageList messages={[]} currentUserId="user1" />)
    expect(screen.getByText(/No messages yet/)).toBeInTheDocument()
  })

  it('renders all message authors', () => {
    render(<MessageList messages={mockMessages} currentUserId="user1" />)
    expect(screen.getByText('alice')).toBeInTheDocument()
    expect(screen.getByText('bob')).toBeInTheDocument()
  })
})

describe('MessageInput', () => {
  it('renders textarea and send button', () => {
    render(<MessageInput onSend={vi.fn()} />)
    expect(screen.getByTestId('message-textarea')).toBeInTheDocument()
    expect(screen.getByTestId('send-btn')).toBeInTheDocument()
  })

  it('send button is disabled when input is empty', () => {
    render(<MessageInput onSend={vi.fn()} />)
    expect(screen.getByTestId('send-btn')).toBeDisabled()
  })

  it('calls onSend with message content', async () => {
    const onSend = vi.fn().mockResolvedValue({ error: null })
    render(<MessageInput onSend={onSend} />)
    fireEvent.change(screen.getByTestId('message-textarea'), { target: { value: 'Test message' } })
    fireEvent.click(screen.getByTestId('send-btn'))
    await waitFor(() => {
      expect(onSend).toHaveBeenCalledWith('Test message')
    })
  })

  it('clears input after sending', async () => {
    const onSend = vi.fn().mockResolvedValue({ error: null })
    render(<MessageInput onSend={onSend} />)
    const textarea = screen.getByTestId('message-textarea')
    fireEvent.change(textarea, { target: { value: 'Test message' } })
    fireEvent.click(screen.getByTestId('send-btn'))
    await waitFor(() => {
      expect(textarea).toHaveValue('')
    })
  })
})

const mockPoll: Poll = {
  id: 'poll1',
  room_id: 'room1',
  question: 'Best AI model?',
  options: ['GPT-4', 'Claude', 'Gemini'],
  created_by: 'user1',
  created_at: new Date().toISOString(),
  ends_at: null,
}

describe('PollComponent', () => {
  it('renders poll question and options', () => {
    render(
      <PollComponent
        poll={mockPoll}
        votes={[]}
        userVote={undefined}
        userId="user1"
        onVote={vi.fn()}
      />
    )
    expect(screen.getByText('Best AI model?')).toBeInTheDocument()
    expect(screen.getByText('GPT-4')).toBeInTheDocument()
    expect(screen.getByText('Claude')).toBeInTheDocument()
    expect(screen.getByText('Gemini')).toBeInTheDocument()
  })

  it('shows 0 votes when no votes cast', () => {
    render(
      <PollComponent
        poll={mockPoll}
        votes={[]}
        userVote={undefined}
        userId="user1"
        onVote={vi.fn()}
      />
    )
    expect(screen.getByText('0 votes')).toBeInTheDocument()
  })

  it('calls onVote when option is clicked', async () => {
    const onVote = vi.fn().mockResolvedValue({ error: null })
    render(
      <PollComponent
        poll={mockPoll}
        votes={[]}
        userVote={undefined}
        userId="user1"
        onVote={onVote}
      />
    )
    fireEvent.click(screen.getByTestId('poll-option-1'))
    await waitFor(() => {
      expect(onVote).toHaveBeenCalledWith('poll1', 1, 'user1')
    })
  })

  it('disables options after user has voted', () => {
    const userVote: PollVote = { id: 'v1', poll_id: 'poll1', user_id: 'user1', option_index: 0, created_at: new Date().toISOString() }
    render(
      <PollComponent
        poll={mockPoll}
        votes={[userVote]}
        userVote={userVote}
        userId="user1"
        onVote={vi.fn()}
      />
    )
    expect(screen.getByTestId('poll-option-0')).toBeDisabled()
    expect(screen.getByTestId('poll-option-1')).toBeDisabled()
  })

  it('shows vote count', () => {
    const votes: PollVote[] = [
      { id: 'v1', poll_id: 'poll1', user_id: 'user1', option_index: 0, created_at: new Date().toISOString() },
      { id: 'v2', poll_id: 'poll1', user_id: 'user2', option_index: 1, created_at: new Date().toISOString() },
    ]
    render(
      <PollComponent
        poll={mockPoll}
        votes={votes}
        userVote={votes[0]}
        userId="user1"
        onVote={vi.fn()}
      />
    )
    expect(screen.getByText('2 votes')).toBeInTheDocument()
  })
})

describe('CreatePoll', () => {
  it('renders form with question and option inputs', () => {
    render(
      <CreatePoll
        userId="user1"
        roomId="room1"
        onCreatePoll={vi.fn()}
        onClose={vi.fn()}
      />
    )
    expect(screen.getByTestId('poll-question-input')).toBeInTheDocument()
    expect(screen.getByTestId('poll-option-input-0')).toBeInTheDocument()
    expect(screen.getByTestId('poll-option-input-1')).toBeInTheDocument()
  })

  it('calls onCreatePoll with question and options', async () => {
    const onCreatePoll = vi.fn().mockResolvedValue({ error: null })
    render(
      <CreatePoll
        userId="user1"
        roomId="room1"
        onCreatePoll={onCreatePoll}
        onClose={vi.fn()}
      />
    )
    fireEvent.change(screen.getByTestId('poll-question-input'), { target: { value: 'Favorite model?' } })
    fireEvent.change(screen.getByTestId('poll-option-input-0'), { target: { value: 'Option A' } })
    fireEvent.change(screen.getByTestId('poll-option-input-1'), { target: { value: 'Option B' } })
    fireEvent.click(screen.getByTestId('create-poll-submit'))
    await waitFor(() => {
      expect(onCreatePoll).toHaveBeenCalledWith('Favorite model?', ['Option A', 'Option B'], 'user1')
    })
  })
})
