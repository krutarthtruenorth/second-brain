# Second Brain

Vibrant Next.js AI chat UI with **multiple chats** and **long-term local memory** — every thread and fact persists in the browser across sessions (demo includes entries from 2–3 weeks ago).

## Stack

- **Next.js 15** (App Router)
- **React 19**
- Client-side `localStorage` for durable memory

## Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Try it

- **New chat** starts a fresh thread; switch back anytime — prior messages stay in the sidebar
- Click a memory card or quick prompt: *“What did I say about Aurora?”* (memory works across chats)
- Say `remember: your fact here` to store new memories
- Data lives in `localStorage` under `second-brain-v2` (auto-migrates from `second-brain-v1`)

Memory buckets: **Today** → **This week** → **2–3 weeks ago** (deep) → **Older**.
