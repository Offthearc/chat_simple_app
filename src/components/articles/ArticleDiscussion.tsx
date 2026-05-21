import { type FormEvent, useState } from 'react'
import type { Article } from '../../types'
import { useArticleComments } from '../../hooks/useArticleComments'
import { useAuthContext } from '../../contexts/AuthContext'

interface ArticleDiscussionProps {
  article: Article
  onClose: () => void
}

export function ArticleDiscussion({ article, onClose }: ArticleDiscussionProps) {
  const { user, profile } = useAuthContext()
  const { comments, loading, addComment } = useArticleComments(String(article.id))
  const [content, setContent] = useState('')
  const [sending, setSending] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!user || !content.trim()) return
    setSending(true)
    await addComment(content.trim(), user.id)
    setContent('')
    setSending(false)
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" data-testid="article-discussion">
      <div className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg flex flex-col max-h-[80vh]">
        <div className="px-5 py-4 border-b border-gray-700 flex items-start justify-between gap-3">
          <div>
            <h3 className="text-white font-semibold text-sm leading-snug">{article.title}</h3>
            <p className="text-xs text-gray-500 mt-0.5">by {article.by} · {article.score} points</p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white text-xl leading-none flex-shrink-0">×</button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-3 flex flex-col gap-3">
          {loading && <p className="text-gray-500 text-sm">Loading comments…</p>}
          {!loading && comments.length === 0 && (
            <p className="text-gray-600 text-sm text-center py-4">No discussion yet. Start one!</p>
          )}
          {comments.map(comment => (
            <div key={comment.id} className="flex gap-2">
              <div className="w-7 h-7 rounded-full bg-indigo-700 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                {(comment.profile?.username ?? '?')[0].toUpperCase()}
              </div>
              <div>
                <span className="text-xs font-semibold text-gray-300">{comment.profile?.username ?? 'Unknown'}</span>
                <p className="text-sm text-gray-200 mt-0.5">{comment.content}</p>
              </div>
            </div>
          ))}
        </div>

        {profile && (
          <form onSubmit={handleSubmit} className="px-5 py-3 border-t border-gray-700 flex gap-2">
            <input
              type="text"
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="Add to the discussion…"
              className="flex-1 bg-gray-700 text-white rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              data-testid="article-comment-input"
            />
            <button
              type="submit"
              disabled={sending || !content.trim()}
              className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white rounded px-3 py-2 text-sm font-semibold"
            >
              Post
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
