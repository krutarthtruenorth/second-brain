interface ChatHeaderProps {
  onOpenMenu?: () => void;
}

export default function ChatHeader({ onOpenMenu }: ChatHeaderProps) {
  return (
    <header className="relative z-10 flex shrink-0 items-center justify-between border-b border-border bg-cream/80 px-4 py-3 backdrop-blur-sm sm:px-8">
      <div className="flex items-center gap-3">
        {onOpenMenu && (
          <button
            type="button"
            onClick={onOpenMenu}
            className="flex h-9 w-9 items-center justify-center rounded-full text-accent md:hidden"
            aria-label="Menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-5 w-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        )}
        <div className="relative">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-accent text-sm font-bold text-white shadow-bubble">
            SB
          </div>
          <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-cream bg-success" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-primary">Second Brain</h2>
          <p className="flex items-center gap-1.5 text-xs text-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-success" />
            Active Now
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-accent hover:bg-accent/10"
          aria-label="Search"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-4 w-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z" />
          </svg>
        </button>
        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-accent hover:bg-accent/10"
          aria-label="More options"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
            <circle cx="5" cy="12" r="1.5" />
            <circle cx="12" cy="12" r="1.5" />
            <circle cx="19" cy="12" r="1.5" />
          </svg>
        </button>
      </div>
    </header>
  );
}
