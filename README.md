# chat_simple_app

A real-time chat app with AI article discussions, polls, and direct messaging — built with React, Vite, and Supabase.

## Prerequisites

- Node.js 18+
- npm 9+
- A [Supabase](https://supabase.com) project (free tier works)

## Setup

```bash
git clone git@github.com:Offthearc/chat_simple_app.git
cd chat_simple_app
npm install
cp .env.example .env.local
# Fill in your Supabase credentials in .env.local
```

### Supabase configuration

1. Create a project at supabase.com
2. Run `supabase/schema.sql` in the Supabase SQL editor
3. Run `supabase/seed.sql` to add default chat rooms
4. In Auth → Settings: disable **email confirmation**
5. Copy your project URL and anon key into `.env.local`

## Run

```bash
npm run dev
# Open http://localhost:5173
```

## Test

```bash
npm test
```

## Lint

```bash
npm run lint
```

## Build

```bash
npm run build
```
