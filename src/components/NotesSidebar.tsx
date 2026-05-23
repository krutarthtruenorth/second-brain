import { useMemo, useState } from "react";

export interface NoteItem {
  text: string;
  source_id: string;
  created_at: string;
  preview: string;
}

interface NotesSidebarProps {
  notes: NoteItem[];
  onAddNote: () => void;
  mobile?: boolean;
  onClose?: () => void;
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });
  } catch {
    return "";
  }
}

export default function NotesSidebar({
  notes,
  onAddNote,
  mobile,
  onClose,
}: NotesSidebarProps) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return notes;
    return notes.filter(
      (n) =>
        n.text.toLowerCase().includes(q) ||
        n.preview.toLowerCase().includes(q)
    );
  }, [notes, search]);

  return (
    <aside
      className={`flex w-full shrink-0 flex-col gap-3 p-3 md:w-[300px] lg:w-[320px] ${
        mobile ? "h-full" : "hidden md:flex"
      }`}
    >
      <div className="glass-panel flex min-h-0 flex-1 flex-col rounded-card shadow-panel">
        <div className="flex items-center justify-between px-4 pt-4 pb-2">
          <h2 className="text-base font-semibold text-primary">Notes</h2>
          <div className="flex items-center gap-1">
            {mobile && onClose && (
              <button
                type="button"
                onClick={onClose}
                className="rounded-full px-2 py-1 text-sm text-muted hover:text-primary md:hidden"
              >
                ✕
              </button>
            )}
            <button
              type="button"
              onClick={onAddNote}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-border-strong text-accent transition-colors hover:bg-accent/10"
              aria-label="Add note"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
        </div>

        <div className="px-4 pb-3">
          <div className="relative">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z" />
            </svg>
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search notes..."
              className="glass-input w-full rounded-input py-2.5 pl-10 pr-3 text-sm text-primary"
            />
          </div>
        </div>

        <div className="scrollbar-thin flex-1 overflow-y-auto px-2 pb-3">
          {filtered.length === 0 ? (
            <p className="px-3 py-6 text-center text-sm text-muted">
              {notes.length === 0
                ? "No notes yet. Add your first memory."
                : "No matching notes."}
            </p>
          ) : (
            filtered.map((note) => (
              <div
                key={note.source_id}
                className="mb-1 rounded-input px-3 py-3 transition-colors hover:bg-accent/5"
              >
                <div className="mb-1 flex items-center gap-2">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/15 text-xs font-medium text-accent">
                    {formatDate(note.created_at).slice(0, 1) || "N"}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-primary">
                      {formatDate(note.created_at) || "Note"}
                    </p>
                    <p className="truncate text-xs text-muted">
                      {note.preview}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="glass-panel rounded-card px-4 py-3 shadow-panel">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-primary">Memory</p>
            <p className="text-xs text-muted">
              {notes.length} saved {notes.length === 1 ? "note" : "notes"}
            </p>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/15">
            <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
          </div>
        </div>
      </div>
    </aside>
  );
}
