"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { BrainState, Chat, MemoryFact, Message } from "@/lib/types";
import {
  addMessage,
  attachFacts,
  bucketFor,
  chatPreview,
  createChat,
  deleteChat,
  extractFacts,
  formatDate,
  formatRelative,
  getActiveChat,
  loadBrain,
  saveBrain,
  selectChat,
  simulateReply,
} from "@/lib/memory";
import styles from "./SecondBrain.module.css";

const BUCKET_LABELS: Record<string, string> = {
  today: "Today",
  week: "This week",
  deep: "2–3 weeks ago",
  older: "Older",
};

function groupFacts(facts: MemoryFact[]) {
  const order = ["today", "week", "deep", "older"] as const;
  const groups: Record<string, MemoryFact[]> = {};
  for (const f of facts) {
    const b = bucketFor(f.createdAt);
    (groups[b] ??= []).push(f);
  }
  for (const key of Object.keys(groups)) {
    groups[key].sort((a, b) => b.createdAt - a.createdAt);
  }
  return order
    .filter((k) => groups[k]?.length)
    .map((k) => ({ bucket: k, items: groups[k]! }));
}

function sortChats(chats: Chat[]) {
  return [...chats].sort((a, b) => b.updatedAt - a.updatedAt);
}

export function SecondBrain() {
  const [brain, setBrain] = useState<BrainState | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      setBrain(loadBrain());
      setLoadError(null);
    } catch (err) {
      console.error("Second Brain failed to load:", err);
      setLoadError(
        err instanceof Error ? err.message : "Could not load saved data"
      );
    }
  }, []);

  const activeChat = brain ? getActiveChat(brain) : null;
  const sortedChats = useMemo(
    () => (brain ? sortChats(brain.chats) : []),
    [brain]
  );
  const groupedFacts = useMemo(
    () => (brain ? groupFacts(brain.facts) : []),
    [brain]
  );
  const deepCount = brain
    ? brain.facts.filter((f) => bucketFor(f.createdAt) === "deep").length
    : 0;

  useEffect(() => {
    if (brain) saveBrain(brain);
  }, [brain]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeChat?.messages, thinking]);

  const send = useCallback(
    (text: string) => {
      if (!brain) return;
      const trimmed = text.trim();
      if (!trimmed || thinking) return;

      let next = addMessage(brain, "user", trimmed);
      const chat = getActiveChat(next);
      const userMsg = chat.messages[chat.messages.length - 1]!;
      const extracted = extractFacts(trimmed);
      next = attachFacts(next, userMsg.id, extracted);

      setBrain(next);
      setInput("");
      setThinking(true);

      window.setTimeout(() => {
        const allInChat = getActiveChat(next).messages;
        const reply = simulateReply(trimmed, next.facts, allInChat);
        const withReply = addMessage(next, "assistant", reply);
        setBrain(withReply);
        setThinking(false);
        inputRef.current?.focus();
      }, 420);
    },
    [brain, thinking]
  );

  const onNewChat = () => {
    if (!brain || thinking) return;
    setBrain(createChat(brain));
    setInput("");
    inputRef.current?.focus();
  };

  const onSelectChat = (chatId: string) => {
    if (!brain || thinking) return;
    setBrain(selectChat(brain, chatId));
    setInput("");
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    send(input);
  };

  if (loadError) {
    return (
      <div className={styles.shell}>
        <div className={styles.errorPanel}>
          <p>Could not start Second Brain.</p>
          <p className={styles.errorDetail}>{loadError}</p>
          <button
            type="button"
            onClick={() => {
              try {
                localStorage.removeItem("second-brain-v2");
                localStorage.removeItem("second-brain-v1");
              } catch {
                /* ignore */
              }
              setLoadError(null);
              setBrain(loadBrain());
            }}
          >
            Reset storage & retry
          </button>
        </div>
      </div>
    );
  }

  if (!brain || !activeChat) {
    return (
      <div className={styles.shell}>
        <div className={styles.loader} aria-label="Loading memory" />
      </div>
    );
  }

  const messages = activeChat.messages;

  return (
    <div className={styles.shell}>
      <div className={styles.app}>
        <header className={styles.header}>
          <div className={styles.brand}>
            <div className={styles.logo} aria-hidden>
              <span className={styles.logoInner}>◈</span>
            </div>
            <div>
              <h1>Second Brain</h1>
              <p>Chats & memory stay on this device</p>
            </div>
          </div>
          <div
            className={styles.retentionPill}
            title="All chats and facts saved in your browser"
          >
            <span className={styles.dot} />
            {brain.chats.length} chat{brain.chats.length !== 1 ? "s" : ""}
            {deepCount > 0 ? ` · ${deepCount} deep` : ""}
          </div>
        </header>

        <nav className={styles.chatNav} aria-label="Chat history">
          <button
            type="button"
            className={styles.newChatBtn}
            onClick={onNewChat}
            disabled={thinking}
          >
            <span className={styles.plus} aria-hidden>
              +
            </span>
            New chat
          </button>
          <ul className={styles.chatList}>
            {sortedChats.map((chat) => (
              <li key={chat.id}>
                <ChatListItem
                  chat={chat}
                  active={chat.id === brain.activeChatId}
                  onSelect={() => onSelectChat(chat.id)}
                  onDelete={() => setBrain(deleteChat(brain, chat.id))}
                  canDelete={brain.chats.length > 1}
                />
              </li>
            ))}
          </ul>
        </nav>

        <section className={styles.chatPanel} aria-label="Chat">
          <div className={styles.chatToolbar}>
            <h2 className={styles.chatTitle}>{activeChat.title}</h2>
            <span className={styles.chatMeta}>
              {messages.length} msg · {formatRelative(activeChat.updatedAt)}
            </span>
          </div>
          <div className={styles.messages}>
            {messages.length === 0 ? (
              <p className={styles.emptyHint}>
                Fresh thread — memory from other chats still applies. Try{" "}
                <button
                  type="button"
                  className={styles.inlineLink}
                  onClick={() => send("What did I say about Aurora?")}
                >
                  what did I say about Aurora?
                </button>
              </p>
            ) : (
              messages.map((m) => <MessageBubble key={m.id} message={m} />)
            )}
            {thinking && (
              <div
                className={`${styles.msg} ${styles.assistant}`}
                aria-live="polite"
              >
                <span className={styles.typing}>
                  <span />
                  <span />
                  <span />
                </span>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <form className={styles.composer} onSubmit={onSubmit}>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder='Message — "remember: …" stores across chats'
              autoComplete="off"
              disabled={thinking}
            />
            <button type="submit" disabled={!input.trim() || thinking}>
              Send
            </button>
          </form>
        </section>

        <aside className={styles.memoryPanel} aria-label="Retained memory">
          <div className={styles.memoryHead}>
            <h2>Memory</h2>
            <span className={styles.factCount}>{brain.facts.length}</span>
          </div>
          <p className={styles.memoryNote}>
            Facts persist across new chats and sessions.
          </p>
          <div className={styles.memoryScroll}>
            {groupedFacts.map(({ bucket, items }) => (
              <div key={bucket} className={styles.memoryGroup}>
                <div
                  className={`${styles.memoryGroupLabel} ${
                    bucket === "deep" ? styles.deepLabel : ""
                  }`}
                >
                  {BUCKET_LABELS[bucket]}
                  {bucket === "deep" && (
                    <span className={styles.badge}>long-term</span>
                  )}
                </div>
                {items.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    className={`${styles.factCard} ${
                      bucket === "deep" ? styles.deepCard : ""
                    }`}
                    onClick={() =>
                      send(`What did I tell you about ${f.label}?`)
                    }
                  >
                    <div className={styles.factLabel}>{f.label}</div>
                    <div className={styles.factValue}>{f.value}</div>
                    <div className={styles.factWhen}>
                      {formatRelative(f.createdAt)} ·{" "}
                      {formatDate(f.createdAt)}
                    </div>
                  </button>
                ))}
              </div>
            ))}
          </div>
          <div className={styles.quickPrompts}>
            {[
              "What did I say about Aurora?",
              "Recall my streak goal",
              "remember: coffee at 7am",
            ].map((q) => (
              <button key={q} type="button" onClick={() => send(q)}>
                {q.length > 26 ? q.slice(0, 24) + "…" : q}
              </button>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}

function ChatListItem({
  chat,
  active,
  onSelect,
  onDelete,
  canDelete,
}: {
  chat: Chat;
  active: boolean;
  onSelect: () => void;
  onDelete: () => void;
  canDelete: boolean;
}) {
  const preview = chatPreview(chat);
  return (
    <div className={`${styles.chatItem} ${active ? styles.chatItemActive : ""}`}>
      <button
        type="button"
        className={styles.chatItemMain}
        onClick={onSelect}
        aria-current={active ? "true" : undefined}
      >
        <span className={styles.chatItemTitle}>{chat.title}</span>
        <span className={styles.chatItemPreview}>
          {preview.length > 42 ? preview.slice(0, 40) + "…" : preview}
        </span>
        <span className={styles.chatItemWhen}>
          {formatRelative(chat.updatedAt)}
        </span>
      </button>
      {canDelete && (
        <button
          type="button"
          className={styles.chatItemDelete}
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          aria-label={`Delete ${chat.title}`}
          title="Delete chat"
        >
          ×
        </button>
      )}
    </div>
  );
}

function MessageBubble({ message }: { message: Message }) {
  const isDeep =
    bucketFor(message.createdAt) === "deep" ||
    bucketFor(message.createdAt) === "older";
  return (
    <div
      className={`${styles.msg} ${styles[message.role]} ${
        isDeep && message.role === "user" ? styles.deepMemory : ""
      }`}
    >
      {message.content}
      <span className={styles.msgMeta}>
        {formatRelative(message.createdAt)} · {formatDate(message.createdAt)}
      </span>
    </div>
  );
}
