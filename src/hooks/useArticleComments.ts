import { useEffect, useRef, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { ArticleComment } from '../types'

export function useArticleComments(articleId: string) {
  const [comments, setComments] = useState<ArticleComment[]>([])
  const [loading, setLoading] = useState(true)
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null)

  useEffect(() => {
    if (!articleId) return

    setLoading(true)
    supabase
      .from('article_comments')
      .select('*, profile:profiles(id,username,avatar_url,created_at)')
      .eq('article_id', articleId)
      .order('created_at')
      .then(({ data }) => {
        setComments((data ?? []) as ArticleComment[])
        setLoading(false)
      })

    const channel = supabase
      .channel(`article:${articleId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'article_comments', filter: `article_id=eq.${articleId}` },
        async (payload) => {
          const { data } = await supabase
            .from('article_comments')
            .select('*, profile:profiles(id,username,avatar_url,created_at)')
            .eq('id', (payload.new as { id: string }).id)
            .single()
          if (data) setComments(prev => [...prev, data as ArticleComment])
        }
      )
      .subscribe()

    channelRef.current = channel
    return () => {
      if (channelRef.current) supabase.removeChannel(channelRef.current)
    }
  }, [articleId])

  async function addComment(content: string, userId: string) {
    const { error } = await supabase
      .from('article_comments')
      .insert({ article_id: articleId, user_id: userId, content })
    return { error: error?.message ?? null }
  }

  return { comments, loading, addComment }
}
