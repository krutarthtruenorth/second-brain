# Second Brain

**Second Brain** is a personal AI memory engine with a chat interface. Paste your notes once, then recall them through natural language — like talking to a version of yourself that actually remembers what you wrote.

## The problem

Personal knowledge scatters across apps, docs, and half-finished notes. When you need an idea from last month, you search filenames and hope. Second Brain turns free-form notes into a queryable memory you can converse with.

## How it works

1. **Ingest** — You paste a note; the app sends it to HydraDB via `POST /api/ingest`.
2. **Enrich** — When you ask a question, your configured LLM expands it into search keywords.
3. **Recall** — HydraDB `recall_preferences` finds the most relevant memory chunks.
4. **Synthesize** — The LLM answers using only those chunks, quoting your exact words.
5. **Display** — The answer appears in chat with collapsible source notes underneath.

## Tech stack

- **Frontend:** React, Vite, TailwindCSS, TypeScript
- **Backend:** Vercel serverless API routes (`/api`)
- **Memory:** HydraDB API
- **AI:** OpenAI-compatible Chat Completions (OpenAI Cloud, or **local Gemma via Ollama / Docker** for testing)
- **Deploy:** Vercel (single project)

## Setup

1. Clone the repo
2. Copy `.env.example` to `.env` and fill in your keys
3. `npm install`
4. `vercel login` (once) — required for local API routes
5. `npm start` — runs `vercel dev` on port **3000** (serves `/api` + Vite; do **not** use `npm run dev` — that name is reserved for Vite only)
6. Open **`http://localhost:3000`** in the browser
7. **After first deploy to Vercel:** visit `/api/setup` **once** to provision the HydraDB tenant (may take 1–2 minutes; retry if it times out)

Local dev uses `vercel dev` only — not a separate Node server. `devCommand` in `vercel.json` runs Vite without re-invoking `vercel dev` (avoids recursive command errors).

## Deploy to Vercel

1. Push the repo to GitHub and import the project in [Vercel](https://vercel.com), or run `npx vercel` from this folder.
2. Add environment variables in the Vercel project settings (same as `.env`).
3. Deploy — Vercel runs `npm run build` and hosts `dist` plus `/api` routes.
4. Visit `https://<your-app>.vercel.app/api/setup` once, then use the app URL.

## Environment variables

| Variable | Description |
|----------|-------------|
| `HYDRA_DB_API_KEY` | Bearer token for HydraDB API |
| `OPENAI_API_KEY` | API key (**required** for OpenAI Cloud; use any placeholder such as `ollama` for local OpenAI-compatible servers) |
| `OPENAI_BASE_URL` | Chat Completions base URL ending in `/v1`. Omit for OpenAI Cloud. Examples: local Ollama `http://localhost:11434/v1`, Docker-mapped host `http://127.0.0.1:11434/v1`. |
| `OPENAI_MODEL` | Model id (default: `gpt-4o-mini` on OpenAI Cloud, `gemma2` when `OPENAI_BASE_URL` points elsewhere — set explicitly to match your image, e.g. `gemma2:2b`) |
| `HYDRA_TENANT_ID` | HydraDB tenant ID (default: `second_brain_demo`) |
| `HYDRA_SUB_TENANT_ID` | Sub-tenant for shared demo user (default: `shared_user`) |

### Local Gemma (Docker / Ollama) for testing

If Gemma runs with an **OpenAI-compatible** API (e.g. [Ollama](https://github.com/ollama/ollama/blob/main/docs/openai.md) serving Gemma):

1. Ensure the HTTP API is reachable from your machine (**not** only inside another container unless you expose the port or use `host.docker.internal`).
2. In `.env`, set:

   ```bash
   OPENAI_BASE_URL=http://localhost:12434/v1
   OPENAI_API_KEY=local
   OPENAI_MODEL=docker.io/ai/gemma4:E2B
   ```

   Confirm the model id at `http://localhost:12434/v1/models`.

3. Restart `npm start` after changing `.env`.

For production / full deploy, remove `OPENAI_BASE_URL` (or set it to OpenAI’s endpoint), set `OPENAI_API_KEY` to a real key, and use `OPENAI_MODEL=gpt-4o-mini` (or your chosen model).

**Note:** Vercel-deployed lambdas generally **cannot** call `localhost` on your PC. Local LLM routing is intended for **`vercel dev` on your machine** or a reachable server URL.


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
