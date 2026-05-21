import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ArticleCard } from '../components/articles/ArticleCard'
import { fetchAiArticles } from '../lib/articles'
import type { Article } from '../types'

const mockArticle: Article = {
  id: 12345,
  title: 'OpenAI releases GPT-5 with improved reasoning',
  url: 'https://openai.com/blog/gpt-5',
  by: 'testuser',
  score: 500,
  time: Math.floor(Date.now() / 1000) - 3600,
  descendants: 150,
  source: 'hackernews',
}

describe('ArticleCard', () => {
  it('renders article title', () => {
    render(<ArticleCard article={mockArticle} onDiscuss={vi.fn()} />)
    expect(screen.getByText('OpenAI releases GPT-5 with improved reasoning')).toBeInTheDocument()
  })

  it('renders article author', () => {
    render(<ArticleCard article={mockArticle} onDiscuss={vi.fn()} />)
    expect(screen.getByText(/testuser/)).toBeInTheDocument()
  })

  it('renders score', () => {
    render(<ArticleCard article={mockArticle} onDiscuss={vi.fn()} />)
    expect(screen.getByText('500')).toBeInTheDocument()
  })

  it('renders discuss button', () => {
    render(<ArticleCard article={mockArticle} onDiscuss={vi.fn()} />)
    expect(screen.getByTestId('discuss-btn')).toBeInTheDocument()
  })

  it('calls onDiscuss when discuss button clicked', () => {
    const onDiscuss = vi.fn()
    render(<ArticleCard article={mockArticle} onDiscuss={onDiscuss} />)
    screen.getByTestId('discuss-btn').click()
    expect(onDiscuss).toHaveBeenCalledWith(mockArticle)
  })

  it('renders external link when url is provided', () => {
    render(<ArticleCard article={mockArticle} onDiscuss={vi.fn()} />)
    const link = screen.getByText('OpenAI releases GPT-5 with improved reasoning').closest('a')
    expect(link).toHaveAttribute('href', 'https://openai.com/blog/gpt-5')
    expect(link).toHaveAttribute('target', '_blank')
  })

  it('renders article without url gracefully', () => {
    const noUrlArticle = { ...mockArticle, url: null }
    render(<ArticleCard article={noUrlArticle} onDiscuss={vi.fn()} />)
    expect(screen.getByText('OpenAI releases GPT-5 with improved reasoning')).toBeInTheDocument()
  })
})

describe('fetchAiArticles', () => {
  const topStoryIds = [1, 2, 3, 4, 5]
  const aiStory = {
    id: 1,
    type: 'story',
    title: 'New LLM model achieves breakthrough in reasoning',
    url: 'https://example.com',
    by: 'hacker',
    score: 200,
    time: Math.floor(Date.now() / 1000),
    descendants: 50,
  }
  const nonAiStory = {
    id: 2,
    type: 'story',
    title: 'Python 3.13 released with new features',
    url: 'https://python.org',
    by: 'pythondev',
    score: 100,
    time: Math.floor(Date.now() / 1000),
    descendants: 30,
  }

  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn((url: string) => {
      if (url.includes('topstories')) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve(topStoryIds) })
      }
      if (url.includes('/1.json')) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve(aiStory) })
      }
      return Promise.resolve({ ok: true, json: () => Promise.resolve(nonAiStory) })
    }))
  })

  it('filters articles by AI keywords', async () => {
    const articles = await fetchAiArticles(10)
    expect(articles.length).toBeGreaterThan(0)
    articles.forEach(a => {
      const lower = a.title.toLowerCase()
      const isAi = ['ai', 'llm', 'gpt', 'machine learning', 'neural', 'openai', 'anthropic',
        'claude', 'gemini', 'llama', 'deep learning', 'transformer', 'diffusion', 'mistral',
        'groq', 'nvidia', 'agi', 'generative', 'embedding', 'rag', 'langchain', 'hugging face',
        'artificial intelligence'].some(kw => lower.includes(kw))
      expect(isAi).toBe(true)
    })
  })

  it('returns articles with required fields', async () => {
    const articles = await fetchAiArticles(10)
    if (articles.length > 0) {
      const article = articles[0]
      expect(article).toHaveProperty('id')
      expect(article).toHaveProperty('title')
      expect(article).toHaveProperty('by')
      expect(article).toHaveProperty('score')
      expect(article.source).toBe('hackernews')
    }
  })

  it('handles fetch error gracefully', async () => {
    vi.stubGlobal('fetch', vi.fn(() => Promise.resolve({ ok: false, json: () => Promise.resolve([]) })))
    await expect(fetchAiArticles()).rejects.toThrow('Failed to fetch HN top stories')
  })
})
