import type { Article } from '../../types'

interface ArticleCardProps {
  article: Article
  onDiscuss: (article: Article) => void
}

function timeAgo(timestamp: number) {
  const seconds = Math.floor(Date.now() / 1000 - timestamp)
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  return `${Math.floor(seconds / 86400)}d ago`
}

export function ArticleCard({ article, onDiscuss }: ArticleCardProps) {
  const domain = article.url ? new URL(article.url).hostname.replace('www.', '') : null

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 flex flex-col gap-2" data-testid="article-card">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-white text-sm font-semibold leading-snug">
            {article.url ? (
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-indigo-300 transition-colors"
              >
                {article.title}
              </a>
            ) : (
              article.title
            )}
          </h3>
          <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
            {domain && <span>{domain}</span>}
            <span>·</span>
            <span>by {article.by}</span>
            <span>·</span>
            <span>{timeAgo(article.time)}</span>
          </div>
        </div>
        <div className="flex flex-col items-center text-xs text-gray-400 flex-shrink-0">
          <span className="font-bold text-indigo-400">{article.score}</span>
          <span>pts</span>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={() => onDiscuss(article)}
          className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
          data-testid="discuss-btn"
        >
          💬 Discuss ({article.descendants})
        </button>
        {article.url && (
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
          >
            Read →
          </a>
        )}
      </div>
    </div>
  )
}
