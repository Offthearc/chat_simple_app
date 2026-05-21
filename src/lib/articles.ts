import type { Article } from '../types'

const HN_BASE = 'https://hacker-news.firebaseio.com/v0'

const AI_KEYWORDS = [
  'ai', 'artificial intelligence', 'llm', 'gpt', 'chatgpt', 'openai',
  'anthropic', 'claude', 'gemini', 'llama', 'machine learning', 'neural',
  'deep learning', 'transformer', 'diffusion', 'mistral', 'groq', 'nvidia',
  'agi', 'generative', 'embedding', 'rag', 'langchain', 'hugging face',
]

function isAiRelated(title: string): boolean {
  const lower = title.toLowerCase()
  return AI_KEYWORDS.some(kw => lower.includes(kw))
}

interface HNItem {
  id: number
  title?: string
  url?: string
  by?: string
  score?: number
  time?: number
  descendants?: number
  type?: string
}

async function fetchItem(id: number): Promise<HNItem | null> {
  try {
    const res = await fetch(`${HN_BASE}/item/${id}.json`)
    return res.ok ? (await res.json() as HNItem) : null
  } catch {
    return null
  }
}

export async function fetchAiArticles(limit = 30): Promise<Article[]> {
  const res = await fetch(`${HN_BASE}/topstories.json`)
  if (!res.ok) throw new Error('Failed to fetch HN top stories')
  const ids = (await res.json() as number[]).slice(0, 200)

  const items = await Promise.all(ids.map(id => fetchItem(id)))
  const articles: Article[] = []

  for (const item of items) {
    if (!item || item.type !== 'story' || !item.title) continue
    if (!isAiRelated(item.title)) continue
    articles.push({
      id: item.id,
      title: item.title,
      url: item.url ?? null,
      by: item.by ?? 'unknown',
      score: item.score ?? 0,
      time: item.time ?? 0,
      descendants: item.descendants ?? 0,
      source: 'hackernews',
    })
    if (articles.length >= limit) break
  }

  return articles
}
