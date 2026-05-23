interface SidebarProps {
  active: "chat" | "notes";
  onChat: () => void;
  onNotes: () => void;
  onAddNote: () => void;
}

function IconChat() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-5 w-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  );
}

function IconNotes() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-5 w-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
}

function IconBrain() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6 text-accent">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 2a7 7 0 017 7c0 2.5-1.2 4.7-3 6v1a3 3 0 01-6 0v-1c-1.8-1.3-3-3.5-3-6a7 7 0 017-7z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 18h6M10 21h4" />
    </svg>
  );
}

export default function Sidebar({
  active,
  onChat,
  onNotes,
  onAddNote,
}: SidebarProps) {
  return (
    <aside className="hidden md:flex w-[72px] shrink-0 flex-col items-center border-r border-border bg-surface py-5">
      <div className="mb-8 flex h-11 w-11 items-center justify-center rounded-full border border-border-strong bg-accent/10">
        <IconBrain />
      </div>

      <nav className="flex flex-1 flex-col items-center gap-2">
        <button
          type="button"
          onClick={onChat}
          className={`nav-icon-btn ${active === "chat" ? "nav-icon-btn-active" : ""}`}
          aria-label="Chat"
        >
          <IconChat />
        </button>
        <button
          type="button"
          onClick={onNotes}
          className={`nav-icon-btn ${active === "notes" ? "nav-icon-btn-active" : ""}`}
          aria-label="Notes"
        >
          <IconNotes />
        </button>
        <button
          type="button"
          onClick={onAddNote}
          className="nav-icon-btn mt-1"
          aria-label="Add note"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-5 w-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </nav>

      <div className="mt-auto flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-accent/30 to-teal-dark text-xs font-semibold text-accent">
        You
      </div>
    </aside>
  );
}
