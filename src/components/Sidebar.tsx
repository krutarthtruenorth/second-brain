import { useMemo, useState } from "react";
import type { NoteItem } from "./NotesSidebar";

export type NavSection = "chat" | "notes" | "saved" | "recall";

interface SidebarProps {
  active: NavSection;
  noteCount: number;
  notes: NoteItem[];
  onNavigate: (section: NavSection) => void;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

function IconLightbulb() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 text-accent">
      <path d="M9 21h6v-1H9v1zm3-19a7 7 0 00-4 12.74V17h8v-2.26A7 7 0 0012 2z" />
    </svg>
  );
}

const NAV: { id: NavSection; label: string; icon: React.ReactNode }[] = [
  {
    id: "chat",
    label: "Chat",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-5 w-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
  },
  {
    id: "notes",
    label: "Notes",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-5 w-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    id: "saved",
    label: "Saved",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-5 w-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
      </svg>
    ),
  },
  {
    id: "recall",
    label: "Recall",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-5 w-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
];

export default function Sidebar({
  active,
  noteCount,
  notes,
  onNavigate,
  mobileOpen,
  onMobileClose,
}: SidebarProps) {
  const [search, setSearch] = useState("");

  const filteredNotes = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return notes;
    return notes.filter(
      (n) =>
        n.text.toLowerCase().includes(q) ||
        n.preview.toLowerCase().includes(q)
    );
  }, [notes, search]);

  const content = (
    <aside className="flex h-full w-[280px] shrink-0 flex-col bg-surface px-5 py-6 lg:w-[300px]">
      <div className="mb-6 flex items-center gap-2">
        <IconLightbulb />
        <h1 className="font-display text-2xl font-bold text-accent">Second Brain</h1>
      </div>

      <input
        type="search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search memories..."
        className="sidebar-search mb-6"
      />

      <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted">
        Navigation
      </p>
      <nav className="mb-6 flex flex-col gap-1">
        {NAV.map(({ id, label, icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => {
              onNavigate(id);
              onMobileClose?.();
            }}
            className={`nav-item ${active === id ? "nav-item-active" : "nav-item-inactive"}`}
          >
            {icon}
            {label}
          </button>
        ))}
      </nav>

      {active === "notes" && filteredNotes.length > 0 && (
        <div className="scrollbar-thin mb-4 max-h-32 flex-1 overflow-y-auto rounded-input border border-border bg-cream/50 p-2">
          {filteredNotes.slice(0, 8).map((n) => (
            <p key={n.source_id} className="truncate px-2 py-1.5 text-xs text-muted">
              {n.preview}
            </p>
          ))}
        </div>
      )}

      <div className="mt-auto rounded-card border border-border bg-cream px-4 py-3 shadow-card">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">
          Memory
        </p>
        <p className="mt-1 text-sm font-medium text-primary">
          {noteCount} saved {noteCount === 1 ? "note" : "notes"}
        </p>
      </div>

      <div className="mt-4 flex items-center gap-3 border-t border-border pt-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-sm font-semibold text-white">
          You
        </div>
        <span className="text-sm font-medium text-primary">User</span>
      </div>
    </aside>
  );

  return (
    <>
      <div className="hidden md:flex">{content}</div>
      {mobileOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <div className="absolute inset-0 bg-charcoal/40" onClick={onMobileClose} />
          <div className="relative z-10 shadow-card">{content}</div>
        </div>
      )}
    </>
  );
}
