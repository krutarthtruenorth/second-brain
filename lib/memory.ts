import type { BrainState, BrainStateV1, Chat, MemoryFact, Message } from "./types";

const STORAGE_KEY = "second-brain-v2";

const DAY = 86_400_000;

function id(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `id-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

function daysAgo(n: number): number {
  return Date.now() - n * DAY;
}

function chatTitleFrom(text: string): string {
  const clean = text.trim().replace(/\s+/g, " ");
  if (!clean) return "New chat";
  return clean.length > 36 ? clean.slice(0, 34) + "…" : clean;
}

function seedMessages(): Message[] {
  const m1: Message = {
    id: id(),
    role: "user",
    content:
      "I'm building a habit tracker — remind me my streak goal is 30 days.",
    createdAt: daysAgo(19),
  };
  const m2: Message = {
    id: id(),
    role: "assistant",
    content:
      "Got it. I'll remember: streak goal = 30 days for your habit tracker.",
    createdAt: daysAgo(19) + 1200,
  };
  const m3: Message = {
    id: id(),
    role: "user",
    content: "My side project codename is Aurora. Stack: React + Supabase.",
    createdAt: daysAgo(14),
  };
  const m4: Message = {
    id: id(),
    role: "assistant",
    content:
      "Saved — project Aurora, React + Supabase. I'll surface this when you ask about the project.",
    createdAt: daysAgo(14) + 900,
  };
  const m5: Message = {
    id: id(),
    role: "user",
    content: "Prefer concise answers, bullet lists when comparing options.",
    createdAt: daysAgo(3),
  };
  const m6: Message = {
    id: id(),
    role: "assistant",
    content: "Style noted: concise replies, bullets for comparisons.",
    createdAt: daysAgo(3) + 600,
  };
  return [m1, m2, m3, m4, m5, m6];
}

function seedFacts(messages: Message[]): MemoryFact[] {
  const [m1, , m3, , m5] = messages;
  return [
    {
      id: id(),
      label: "Habit streak goal",
      value: "30 days",
      sourceMessageId: m1!.id,
      createdAt: m1!.createdAt,
    },
    {
      id: id(),
      label: "Project Aurora",
      value: "React + Supabase",
      sourceMessageId: m3!.id,
      createdAt: m3!.createdAt,
    },
    {
      id: id(),
      label: "Reply style",
      value: "Concise; bullets for comparisons",
      sourceMessageId: m5!.id,
      createdAt: m5!.createdAt,
    },
  ];
}

function seedState(): BrainState {
  const messages = seedMessages();
  const now = Date.now();
  const welcome: Chat = {
    id: id(),
    title: "Habit tracker & Aurora",
    messages,
    createdAt: messages[0]!.createdAt,
    updatedAt: messages[messages.length - 1]!.createdAt,
  };
  const recent: Chat = {
    id: id(),
    title: "Reply preferences",
    messages: messages.slice(-2),
    createdAt: messages[4]!.createdAt,
    updatedAt: now - DAY,
  };
  return {
    version: 2,
    chats: [welcome, recent],
    activeChatId: welcome.id,
    facts: seedFacts(messages),
  };
}

function migrateV1(v1: BrainStateV1): BrainState {
  const chat: Chat = {
    id: id(),
    title: v1.messages[0]
      ? chatTitleFrom(v1.messages[0].content)
      : "Imported chat",
    messages: v1.messages,
    createdAt: v1.messages[0]?.createdAt ?? Date.now(),
    updatedAt: v1.messages[v1.messages.length - 1]?.createdAt ?? Date.now(),
  };
  return {
    version: 2,
    chats: [chat],
    activeChatId: chat.id,
    facts: v1.facts,
  };
}

function normalizeMessage(raw: unknown): Message | null {
  if (!raw || typeof raw !== "object") return null;
  const m = raw as Partial<Message>;
  if (
    typeof m.id !== "string" ||
    (m.role !== "user" && m.role !== "assistant") ||
    typeof m.content !== "string"
  ) {
    return null;
  }
  return {
    id: m.id,
    role: m.role,
    content: m.content,
    createdAt: typeof m.createdAt === "number" ? m.createdAt : Date.now(),
  };
}

function normalizeChat(raw: unknown): Chat | null {
  if (!raw || typeof raw !== "object") return null;
  const c = raw as Partial<Chat>;
  const messages = Array.isArray(c.messages)
    ? c.messages
        .map(normalizeMessage)
        .filter((m): m is Message => m !== null)
    : [];
  const createdAt =
    typeof c.createdAt === "number" ? c.createdAt : Date.now();
  return {
    id: typeof c.id === "string" ? c.id : id(),
    title: typeof c.title === "string" && c.title.trim() ? c.title : "Chat",
    messages,
    createdAt,
    updatedAt:
      typeof c.updatedAt === "number" ? c.updatedAt : createdAt,
  };
}

function normalizeFact(raw: unknown): MemoryFact | null {
  if (!raw || typeof raw !== "object") return null;
  const f = raw as Partial<MemoryFact>;
  if (
    typeof f.id !== "string" ||
    typeof f.label !== "string" ||
    typeof f.value !== "string"
  ) {
    return null;
  }
  return {
    id: f.id,
    label: f.label,
    value: f.value,
    sourceMessageId:
      typeof f.sourceMessageId === "string" ? f.sourceMessageId : "",
    createdAt: typeof f.createdAt === "number" ? f.createdAt : Date.now(),
  };
}

function normalizeBrain(parsed: Partial<BrainState>): BrainState {
  const chats = Array.isArray(parsed.chats)
    ? parsed.chats
        .map(normalizeChat)
        .filter((c): c is Chat => c !== null)
    : [];

  let state: BrainState = {
    version: 2,
    chats,
    activeChatId:
      typeof parsed.activeChatId === "string" ? parsed.activeChatId : "",
    facts: Array.isArray(parsed.facts)
      ? parsed.facts
          .map(normalizeFact)
          .filter((f): f is MemoryFact => f !== null)
      : [],
  };

  if (!state.chats.length) {
    state = createChat({ ...state, chats: [], activeChatId: "" });
  }

  const activeExists = state.chats.some((c) => c.id === state.activeChatId);
  if (!activeExists) {
    state = { ...state, activeChatId: state.chats[0]!.id };
  }

  return state;
}

function freshBrain(): BrainState {
  const seeded = seedState();
  saveBrain(seeded);
  return seeded;
}

export function loadBrain(): BrainState {
  if (typeof window === "undefined") return seedState();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const legacy = localStorage.getItem("second-brain-v1");
    if (!raw) {
      if (legacy) {
        const v1 = JSON.parse(legacy) as BrainStateV1;
        if (v1.version === 1 && Array.isArray(v1.messages)) {
          const migrated = normalizeBrain(migrateV1(v1));
          saveBrain(migrated);
          return migrated;
        }
      }
      return freshBrain();
    }
    const parsed = JSON.parse(raw) as Partial<BrainState>;
    if (parsed.version !== 2 || !Array.isArray(parsed.chats)) {
      return freshBrain();
    }
    return normalizeBrain(parsed);
  } catch {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
    return freshBrain();
  }
}

export function saveBrain(state: BrainState): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* quota or private mode — UI still works for this session */
  }
}

export function getActiveChat(state: BrainState): Chat {
  return (
    state.chats.find((c) => c.id === state.activeChatId) ??
    state.chats[0]!
  );
}

export function createChat(state: BrainState): BrainState {
  const chat: Chat = {
    id: id(),
    title: "New chat",
    messages: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  return {
    ...state,
    chats: [chat, ...state.chats],
    activeChatId: chat.id,
  };
}

export function selectChat(state: BrainState, chatId: string): BrainState {
  if (!state.chats.some((c) => c.id === chatId)) return state;
  return { ...state, activeChatId: chatId };
}

export function deleteChat(state: BrainState, chatId: string): BrainState {
  if (state.chats.length <= 1) return state;
  const chats = state.chats.filter((c) => c.id !== chatId);
  const activeChatId =
    state.activeChatId === chatId
      ? (chats[0]?.id ?? state.activeChatId)
      : state.activeChatId;
  return { ...state, chats, activeChatId };
}

function patchChat(
  state: BrainState,
  chatId: string,
  patch: (chat: Chat) => Chat
): BrainState {
  return {
    ...state,
    chats: state.chats.map((c) => (c.id === chatId ? patch(c) : c)),
  };
}

export function addMessage(
  state: BrainState,
  role: Message["role"],
  content: string
): BrainState {
  const chatId = state.activeChatId;
  const message: Message = {
    id: id(),
    role,
    content: content.trim(),
    createdAt: Date.now(),
  };
  return patchChat(state, chatId, (chat) => {
    const isFirstUser =
      role === "user" && !chat.messages.some((m) => m.role === "user");
    return {
      ...chat,
      title: isFirstUser ? chatTitleFrom(content) : chat.title,
      messages: [...chat.messages, message],
      updatedAt: Date.now(),
    };
  });
}

export function extractFacts(
  content: string
): Omit<MemoryFact, "id" | "createdAt" | "sourceMessageId">[] {
  const facts: Omit<MemoryFact, "id" | "createdAt" | "sourceMessageId">[] = [];
  const remember = content.match(/remember[:\s]+(.+)/i);
  if (remember?.[1]) {
    facts.push({
      label: "You asked to remember",
      value: remember[1].trim().slice(0, 120),
    });
  }
  const goal = content.match(/goal\s+is\s+(\d+\s*\w+)/i);
  if (goal?.[1]) {
    facts.push({ label: "Goal", value: goal[1] });
  }
  const codename = content.match(/codename\s+is\s+(\w+)/i);
  if (codename?.[1]) {
    facts.push({ label: "Project codename", value: codename[1] });
  }
  const prefer = content.match(/prefer\s+(.+)/i);
  if (prefer?.[1]) {
    facts.push({
      label: "Preference",
      value: prefer[1].trim().slice(0, 100),
    });
  }
  return facts;
}

export function attachFacts(
  state: BrainState,
  messageId: string,
  extracted: Omit<MemoryFact, "id" | "createdAt" | "sourceMessageId">[]
): BrainState {
  if (!extracted.length) return state;
  const newFacts: MemoryFact[] = extracted.map((f) => ({
    ...f,
    id: id(),
    sourceMessageId: messageId,
    createdAt: Date.now(),
  }));
  return { ...state, facts: [...state.facts, ...newFacts] };
}

export type MemoryBucket = "today" | "week" | "deep" | "older";

export function bucketFor(ts: number): MemoryBucket {
  const age = Date.now() - ts;
  if (age < DAY) return "today";
  if (age < 7 * DAY) return "week";
  if (age < 21 * DAY) return "deep";
  return "older";
}

export function formatRelative(ts: number): string {
  const age = Date.now() - ts;
  const days = Math.floor(age / DAY);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  if (days < 14) return `${Math.floor(days / 7)}w ago`;
  return `${days}d ago`;
}

export function formatDate(ts: number): string {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
  }).format(new Date(ts));
}

export function chatPreview(chat: Chat): string {
  const last = [...chat.messages].reverse().find((m) => m.role === "user");
  if (last) return last.content;
  const any = chat.messages[chat.messages.length - 1];
  return any?.content ?? "No messages yet";
}

export function allMessages(state: BrainState): Message[] {
  return state.chats.flatMap((c) => c.messages);
}

export function simulateReply(
  userText: string,
  facts: MemoryFact[],
  recentMessages: Message[]
): string {
  const lower = userText.toLowerCase();
  const hits = facts.filter(
    (f) =>
      lower.includes(f.label.toLowerCase().split(" ")[0]) ||
      lower.includes(f.value.toLowerCase().split(" ")[0]) ||
      (lower.includes("aurora") && f.value.toLowerCase().includes("supabase")) ||
      (lower.includes("streak") && f.label.toLowerCase().includes("habit")) ||
      lower.includes("remember") ||
      lower.includes("what did") ||
      lower.includes("recall")
  );

  if (
    lower.includes("what did") ||
    lower.includes("remember") ||
    lower.includes("recall")
  ) {
    if (hits.length) {
      const lines = hits.map(
        (f) => `• ${f.label}: ${f.value} (${formatRelative(f.createdAt)})`
      );
      return `From memory (${hits.length} match${hits.length > 1 ? "es" : ""}):\n${lines.join("\n")}`;
    }
    const old = facts.filter((f) => bucketFor(f.createdAt) === "deep");
    if (old.length) {
      return `Nothing exact — but from ~2–3 weeks back I still have:\n${old.map((f) => `• ${f.label}: ${f.value}`).join("\n")}`;
    }
  }

  if (hits.length) {
    return `Pulling from ${formatRelative(hits[0].createdAt)} memory: ${hits[0].label} → ${hits[0].value}. What else?`;
  }

  const style = facts.find((f) => f.label === "Reply style");
  const brief =
    style && userText.length > 80
      ? recentMessages
          .slice(-2)
          .map((m) => m.content.slice(0, 40))
          .join(" … ")
      : null;

  if (brief) {
    return `Noted. (Keeping it concise per your style.) Anything to store for later weeks?`;
  }

  return "Logged. I'll retain this locally for weeks — try “what did I say about Aurora?”";
}
