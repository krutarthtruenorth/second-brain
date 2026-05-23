interface ChatHeaderProps {
  onOpenNotes?: () => void;
}

export default function ChatHeader({ onOpenNotes }: ChatHeaderProps) {
  return (
    <header className="flex shrink-0 items-center justify-between border-b border-border px-4 py-3 sm:px-6">
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-accent/40 to-teal-dark text-sm font-bold text-primary ring-2 ring-accent/20">
            SB
          </div>
          <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-surface bg-success" />
        </div>
        <div>
          <h1 className="text-base font-semibold text-primary">Second Brain</h1>
          <p className="flex items-center gap-1.5 text-xs text-accent">
            <span className="h-1.5 w-1.5 rounded-full bg-success" />
            Active Now
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1 sm:gap-2">
        {onOpenNotes && (
          <button
            type="button"
            onClick={onOpenNotes}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted transition-colors hover:border-accent/30 hover:text-accent md:hidden"
            aria-label="Open notes"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-4 w-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        )}
        <button type="button" className="hidden h-9 w-9 items-center justify-center rounded-full border border-border text-muted hover:border-accent/30 hover:text-accent sm:flex" aria-label="Search">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-4 w-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z" />
          </svg>
        </button>
      </div>
    </header>
  );
}
