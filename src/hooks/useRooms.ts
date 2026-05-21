import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { ChatRoom } from '../types'

export function useRooms() {
  const [rooms, setRooms] = useState<ChatRoom[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    supabase
      .from('chat_rooms')
      .select('*')
      .order('is_default', { ascending: false })
      .order('name')
      .then(({ data, error: err }) => {
        if (err) setError(err.message)
        else setRooms((data ?? []) as ChatRoom[])
        setLoading(false)
      })
  }, [])

  async function createRoom(name: string, description: string, userId: string) {
    const { data, error: err } = await supabase
      .from('chat_rooms')
      .insert({ name, description, created_by: userId })
      .select()
      .single()
    if (err) return { error: err.message }
    setRooms(prev => [...prev, data as ChatRoom])
    return { error: null }
  }

  return { rooms, loading, error, createRoom }
}
