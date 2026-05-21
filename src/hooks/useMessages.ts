import { useEffect, useRef, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { Message } from '../types'

export function useMessages(roomId: string) {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null)

  useEffect(() => {
    if (!roomId) return

    setLoading(true)
    supabase
      .from('messages')
      .select('*, profile:profiles(id,username,avatar_url,created_at)')
      .eq('room_id', roomId)
      .order('created_at')
      .then(({ data }) => {
        setMessages((data ?? []) as Message[])
        setLoading(false)
      })

    const channel = supabase
      .channel(`room:${roomId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `room_id=eq.${roomId}` },
        async (payload) => {
          const { data } = await supabase
            .from('messages')
            .select('*, profile:profiles(id,username,avatar_url,created_at)')
            .eq('id', (payload.new as { id: string }).id)
            .single()
          if (data) setMessages(prev => [...prev, data as Message])
        }
      )
      .subscribe()

    channelRef.current = channel

    return () => {
      if (channelRef.current) supabase.removeChannel(channelRef.current)
    }
  }, [roomId])

  async function sendMessage(content: string, userId: string) {
    const { error } = await supabase
      .from('messages')
      .insert({ room_id: roomId, user_id: userId, content })
    return { error: error?.message ?? null }
  }

  return { messages, loading, sendMessage }
}
