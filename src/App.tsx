import { useCallback, useEffect, useState } from "react";
import ChatWindow from "./components/ChatWindow";
import ChatInput from "./components/ChatInput";
import NoteInput from "./components/NoteInput";
import type { ChatMessage } from "./components/MessageBubble";
import type { Source } from "./components/SourceCard";

export default function App() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [noteCount, setNoteCount] = useState(0);
  const [notePanelOpen, setNotePanelOpen] = useState(false);

  const refreshNoteCount = useCallback(async () => {
    try {
      const res = await fetch("/api/notes");
      if (res.ok) {
        const data = (await res.json()) as { count?: number };
        setNoteCount(data.count ?? 0);
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    void refreshNoteCount();
  }, [refreshNoteCount]);

  const handleSend = async (question: string) => {
    const userMessage: ChatMessage = { role: "user", content: question };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    const history = [...messages, userMessage].map((m) => ({
      role: m.role,
      content: m.content,
    }));

    try {
      const res = await fetch("/api/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, history }),
      });

      const data = (await res.json()) as {
        answer?: string;
        sources?: Source[];
      };

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.answer ?? "Something went wrong. Please try again.",
          sources: data.sources ?? [],
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Something went wrong. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-dvh flex-col bg-background text-primary font-sans">
      <header className="flex shrink-0 items-center justify-between border-b border-border px-4 py-3 sm:px-6">
        <h1 className="text-lg font-semibold tracking-tight">Second Brain</h1>
        <span className="rounded-full border border-border bg-surface px-3 py-1 text-xs text-muted">
          {noteCount} {noteCount === 1 ? "note" : "notes"}
        </span>
        <button
          type="button"
          onClick={() => setNotePanelOpen(true)}
          className="rounded-input bg-accent px-4 py-2 text-sm font-medium text-white hover:opacity-90"
        >
          Add Note
        </button>
      </header>

      <main className="flex min-h-0 flex-1 flex-col">
        <ChatWindow messages={messages} />
        <ChatInput onSend={handleSend} loading={loading} />
      </main>

      <NoteInput
        open={notePanelOpen}
        onClose={() => setNotePanelOpen(false)}
        onSaved={refreshNoteCount}
      />
    </div>
  );
}
