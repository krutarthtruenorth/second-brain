import { useCallback, useEffect, useState } from "react";
import ChatWindow from "./components/ChatWindow";
import ChatInput from "./components/ChatInput";
import NoteInput from "./components/NoteInput";
import Sidebar from "./components/Sidebar";
import NotesSidebar, { type NoteItem } from "./components/NotesSidebar";
import type { ChatMessage } from "./components/MessageBubble";
import type { Source } from "./components/SourceCard";

export default function App() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState<NoteItem[]>([]);
  const [notePanelOpen, setNotePanelOpen] = useState(false);
  const [mobileNotesOpen, setMobileNotesOpen] = useState(false);
  const [sidebarActive, setSidebarActive] = useState<"chat" | "notes">("chat");

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

  const openAddNote = () => {
    setNotePanelOpen(true);
    setMobileNotesOpen(false);
  };

  const handleSend = async (question: string) => {
    const userMessage: ChatMessage = {
      role: "user",
      content: question,
      timestamp: new Date().toISOString(),
    };
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

  return (
    <div className="flex h-dvh overflow-hidden bg-background font-sans">
      <Sidebar
        active={sidebarActive}
        onChat={() => {
          setSidebarActive("chat");
          setMobileNotesOpen(false);
        }}
        onNotes={() => {
          setSidebarActive("notes");
          setMobileNotesOpen(true);
        }}
        onAddNote={openAddNote}
      />

      <NotesSidebar notes={notes} onAddNote={openAddNote} />

      {mobileNotesOpen && (
        <div className="fixed inset-0 z-30 flex md:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileNotesOpen(false)}
          />
          <div className="relative z-10 ml-[72px] flex w-[calc(100%-72px)] bg-background">
            <NotesSidebar
              notes={notes}
              onAddNote={openAddNote}
              mobile
              onClose={() => setMobileNotesOpen(false)}
            />
          </div>
        </div>
      )}

      <main className="flex min-w-0 flex-1 flex-col border-l border-border">
        <ChatWindow
          messages={messages}
          onOpenNotes={() => setMobileNotesOpen(true)}
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
