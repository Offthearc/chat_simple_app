import { useEffect, useRef, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { DirectMessage, Profile } from '../types'

export function useDirectMessages(currentUserId: string, otherUserId: string) {
  const [messages, setMessages] = useState<DirectMessage[]>([])
  const [loading, setLoading] = useState(true)
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null)

  useEffect(() => {
    if (!currentUserId || !otherUserId) return

    setLoading(true)
    supabase
      .from('direct_messages')
      .select('*, sender:profiles!direct_messages_sender_id_fkey(id,username,avatar_url,created_at), receiver:profiles!direct_messages_receiver_id_fkey(id,username,avatar_url,created_at)')
      .or(`and(sender_id.eq.${currentUserId},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${currentUserId})`)
      .order('created_at')
      .then(({ data }) => {
        setMessages((data ?? []) as DirectMessage[])
        setLoading(false)
      })

    const channelName = [currentUserId, otherUserId].sort().join(':')
    const channel = supabase
      .channel(`dm:${channelName}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'direct_messages' },
        async (payload) => {
          const msg = payload.new as DirectMessage
          const isRelevant =
            (msg.sender_id === currentUserId && msg.receiver_id === otherUserId) ||
            (msg.sender_id === otherUserId && msg.receiver_id === currentUserId)
          if (!isRelevant) return
          const { data } = await supabase
            .from('direct_messages')
            .select('*, sender:profiles!direct_messages_sender_id_fkey(id,username,avatar_url,created_at), receiver:profiles!direct_messages_receiver_id_fkey(id,username,avatar_url,created_at)')
            .eq('id', msg.id)
            .single()
          if (data) setMessages(prev => [...prev, data as DirectMessage])
        }
      )
      .subscribe()

    channelRef.current = channel
    return () => {
      if (channelRef.current) supabase.removeChannel(channelRef.current)
    }
  }, [currentUserId, otherUserId])

  async function sendMessage(content: string) {
    const { error } = await supabase
      .from('direct_messages')
      .insert({ sender_id: currentUserId, receiver_id: otherUserId, content })
    return { error: error?.message ?? null }
  }

  return { messages, loading, sendMessage }
}

export function useAllUsers(currentUserId: string) {
  const [users, setUsers] = useState<Profile[]>([])

  useEffect(() => {
    if (!currentUserId) return
    supabase
      .from('profiles')
      .select('*')
      .neq('id', currentUserId)
      .order('username')
      .then(({ data }) => setUsers((data ?? []) as Profile[]))
  }, [currentUserId])

  return users
}
