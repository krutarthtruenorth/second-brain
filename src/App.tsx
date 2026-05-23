import { useCallback, useEffect, useState } from "react";
import ChatWindow from "./components/ChatWindow";
import ChatInput from "./components/ChatInput";
import NoteInput from "./components/NoteInput";
import Sidebar, { type NavSection } from "./components/Sidebar";
import type { NoteItem } from "./components/NotesSidebar";
import type { ChatMessage } from "./components/MessageBubble";
import type { Source } from "./components/SourceCard";

export default function App() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState<NoteItem[]>([]);
  const [notePanelOpen, setNotePanelOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [navActive, setNavActive] = useState<NavSection>("chat");

  const refreshNotes = useCallback(async () => {
    try {
      const res = await fetch("/api/notes");
      if (res.ok) {
        const data = (await res.json()) as { notes?: NoteItem[] };
        setNotes(data.notes ?? []);
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    void refreshNotes();
  }, [refreshNotes]);

  const openAddNote = () => setNotePanelOpen(true);

  const handleSend = async (question: string) => {
    const userMessage: ChatMessage = {
      role: "user",
      content: question,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);
    setNavActive("chat");

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
          timestamp: new Date().toISOString(),
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Something went wrong. Please try again.",
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleNavigate = (section: NavSection) => {
    setNavActive(section);
    if (section === "recall") {
      void handleSend("What was I thinking about recently?");
    }
    if (section === "notes") {
      openAddNote();
    }
  };

  const displayMessages =
    navActive === "saved"
      ? messages.filter((m) => m.sources && m.sources.length > 0)
      : messages;

  return (
    <div className="flex h-dvh overflow-hidden bg-background font-sans">
      <Sidebar
        active={navActive}
        noteCount={notes.length}
        notes={notes}
        onNavigate={handleNavigate}
        mobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />

      <main className="flex min-w-0 flex-1 flex-col">
        <ChatWindow
          messages={displayMessages}
          onOpenMenu={() => setMobileSidebarOpen(true)}
        />
        <ChatInput
          onSend={handleSend}
          loading={loading}
          onAddNote={openAddNote}
        />
      </main>

      <NoteInput
        open={notePanelOpen}
        onClose={() => setNotePanelOpen(false)}
        onSaved={refreshNotes}
      />
    </div>
  );
}
