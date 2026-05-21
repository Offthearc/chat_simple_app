import { useEffect, useState } from 'react'
import type { Article } from '../types'
import { fetchAiArticles } from '../lib/articles'
import { ArticleCard } from '../components/articles/ArticleCard'
import { ArticleDiscussion } from '../components/articles/ArticleDiscussion'
import { useAuthContext } from '../contexts/AuthContext'

export function ArticlesPage() {
  const { user } = useAuthContext()
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  async function load() {
    try {
      const data = await fetchAiArticles(30)
      setArticles(data)
    } catch {
      setError('Failed to load articles. Check your connection.')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => { void load() }, [])

  async function refresh() {
    setRefreshing(true)
    await load()
  }

  return (
    <div className="flex-1 overflow-y-auto p-4" data-testid="articles-page">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-white text-xl font-bold">AI Articles</h1>
            <p className="text-gray-500 text-sm">Top stories from Hacker News — AI & ML</p>
          </div>
          <button
            onClick={refresh}
            disabled={refreshing || loading}
            className="text-xs text-indigo-400 hover:text-indigo-300 disabled:opacity-50"
          >
            {refreshing ? 'Refreshing…' : '↻ Refresh'}
          </button>
        </div>

        {loading && (
          <div className="flex flex-col gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-gray-800 rounded-lg h-24 animate-pulse" />
            ))}
          </div>
        )}

        {error && (
          <div className="bg-red-900/20 border border-red-800 rounded-lg px-4 py-3 text-red-400 text-sm">
            {error}
          </div>
        )}

        {!loading && !error && articles.length === 0 && (
          <p className="text-gray-500 text-sm text-center py-8">
            No AI articles found right now. Try refreshing.
          </p>
        )}

        <div className="flex flex-col gap-3">
          {articles.map(article => (
            <ArticleCard
              key={article.id}
              article={article}
              onDiscuss={user ? setSelectedArticle : () => {}}
            />
          ))}
        </div>
      </div>

      {selectedArticle && (
        <ArticleDiscussion
          article={selectedArticle}
          onClose={() => setSelectedArticle(null)}
        />
      )}
    </div>
  )
}
