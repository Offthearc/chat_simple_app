export interface Profile {
  id: string
  username: string
  avatar_url: string | null
  created_at: string
}

export interface ChatRoom {
  id: string
  name: string
  description: string | null
  is_default: boolean
  created_by: string | null
  created_at: string
}

export interface Message {
  id: string
  room_id: string
  user_id: string
  content: string
  created_at: string
  profile?: Profile
}

export interface DirectMessage {
  id: string
  sender_id: string
  receiver_id: string
  content: string
  created_at: string
  sender?: Profile
  receiver?: Profile
}

export interface Article {
  id: number
  title: string
  url: string | null
  by: string
  score: number
  time: number
  descendants: number
  source: 'hackernews'
}

export interface Poll {
  id: string
  room_id: string
  question: string
  options: string[]
  created_by: string
  created_at: string
  ends_at: string | null
  creator?: Profile
}

export interface PollVote {
  id: string
  poll_id: string
  user_id: string
  option_index: number
  created_at: string
}

export interface ArticleComment {
  id: string
  article_id: string
  user_id: string
  content: string
  created_at: string
  profile?: Profile
}
