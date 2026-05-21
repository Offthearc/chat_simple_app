import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { Poll, PollVote } from '../types'

export function usePolls(roomId: string) {
  const [polls, setPolls] = useState<Poll[]>([])
  const [votes, setVotes] = useState<PollVote[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!roomId) return

    Promise.all([
      supabase
        .from('polls')
        .select('*, creator:profiles(id,username,avatar_url,created_at)')
        .eq('room_id', roomId)
        .order('created_at', { ascending: false }),
      supabase
        .from('poll_votes')
        .select('*'),
    ]).then(([{ data: pollData }, { data: voteData }]) => {
      setPolls((pollData ?? []) as Poll[])
      setVotes((voteData ?? []) as PollVote[])
      setLoading(false)
    })

    const channel = supabase
      .channel(`polls:${roomId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'poll_votes' }, (payload) => {
        setVotes(prev => [...prev, payload.new as PollVote])
      })
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'polls', filter: `room_id=eq.${roomId}` }, (payload) => {
        setPolls(prev => [payload.new as Poll, ...prev])
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [roomId])

  async function createPoll(question: string, options: string[], userId: string, endsAt?: string) {
    const { error } = await supabase
      .from('polls')
      .insert({ room_id: roomId, created_by: userId, question, options, ends_at: endsAt ?? null })
    return { error: error?.message ?? null }
  }

  async function vote(pollId: string, optionIndex: number, userId: string) {
    const { error } = await supabase
      .from('poll_votes')
      .insert({ poll_id: pollId, user_id: userId, option_index: optionIndex })
    return { error: error?.message ?? null }
  }

  function getVotesForPoll(pollId: string) {
    return votes.filter(v => v.poll_id === pollId)
  }

  function getUserVote(pollId: string, userId: string) {
    return votes.find(v => v.poll_id === pollId && v.user_id === userId)
  }

  return { polls, loading, createPoll, vote, getVotesForPoll, getUserVote }
}
