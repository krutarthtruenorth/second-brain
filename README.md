# Second Brain

**Second Brain** is a personal AI memory engine with a chat interface. Paste your notes once, then recall them through natural language — like talking to a version of yourself that actually remembers what you wrote.

## The problem

Personal knowledge scatters across apps, docs, and half-finished notes. When you need an idea from last month, you search filenames and hope. Second Brain turns free-form notes into a queryable memory you can converse with.

## How it works

1. **Ingest** — You paste a note; the app sends it to HydraDB via `POST /api/ingest`.
2. **Enrich** — When you ask a question, gpt-4o-mini expands it into search keywords.
3. **Recall** — HydraDB `recall_preferences` finds the most relevant memory chunks.
4. **Synthesize** — gpt-4o-mini answers using only those chunks, quoting your exact words.
5. **Display** — The answer appears in chat with collapsible source notes underneath.

## Tech stack

- **Frontend:** React, Vite, TailwindCSS, TypeScript
- **Backend:** Vercel serverless API routes (`/api`)
- **Memory:** HydraDB API
- **AI:** OpenAI gpt-4o-mini
- **Deploy:** Vercel (single project)

## Setup

1. Clone the repo
2. Copy `.env.example` to `.env` and fill in your keys
3. `npm install`
4. `npm run dev` — runs `vercel dev` (API on port 3000) and Vite together
5. Open the app in the browser (Vite’s URL, usually `http://localhost:5173`)
6. **After first deploy to Vercel:** visit `/api/setup` **once** in the browser to provision the HydraDB tenant (provisioning can take 1–2 minutes; the route polls up to ~24s and may ask you to retry)

Local dev uses `vercel dev` for API routes — not a separate Node server. Vite proxies `/api` to `localhost:3000`.

## Environment variables

| Variable | Description |
|----------|-------------|
| `HYDRA_DB_API_KEY` | Bearer token for HydraDB API |
| `OPENAI_API_KEY` | OpenAI API key for gpt-4o-mini |
| `HYDRA_TENANT_ID` | HydraDB tenant ID (default: `second_brain_demo`) |
| `HYDRA_SUB_TENANT_ID` | Sub-tenant for shared demo user (default: `shared_user`) |

## Why HydraDB instead of DIY RAG?

Building retrieval yourself means chunking, embedding, vector storage, graph links, and re-ranking — all before you write a single UI feature. HydraDB provides managed memory with inference on ingest and preference-aware recall, so this hackathon app stays a thin Vercel layer: ingest, query, chat. You focus on the experience; HydraDB handles the memory substrate.

## Screenshots

<!-- Add screenshots here after deploy -->

- Chat with welcome message and sample question
- Add Note panel
- Assistant reply with expanded sources

## Project structure

```
api/           Serverless routes (ingest, query, setup, notes, health)
api/_lib/      HydraDB, OpenAI, in-memory note store
src/           React UI
```

## API reference

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/setup` | GET | One-time tenant provisioning + readiness poll |
| `/api/ingest` | POST | Save a note to HydraDB + local store |
| `/api/query` | POST | Ask a question, get answer + sources |
| `/api/notes` | GET | List in-memory notes (resets on cold start) |
| `/api/health` | GET | Health check |
