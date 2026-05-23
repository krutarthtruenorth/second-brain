import { useState, type KeyboardEvent } from "react";

interface ChatInputProps {
  onSend: (text: string) => void;
  loading: boolean;
  onAddNote?: () => void;
  activeQuick?: string;
}

const QUICK_ACTIONS = [
  { label: "Note", icon: "note" },
  { label: "Idea", icon: "idea" },
  { label: "Recall", icon: "recall" },
  { label: "Search", icon: "search" },
] as const;

function QuickIcon({ type }: { type: string }) {
  const cls = "h-4 w-4";
  if (type === "note")
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className={cls}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    );
  if (type === "idea")
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className={cls}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    );
  if (type === "recall")
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className={cls}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    );
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className={cls}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z" />
    </svg>
  );
}

export default function ChatInput({
  onSend,
  loading,
  onAddNote,
  activeQuick = "Idea",
}: ChatInputProps) {
  const [value, setValue] = useState("");
  const [selectedQuick, setSelectedQuick] = useState(activeQuick);

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed || loading) return;
    onSend(trimmed);
    setValue("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleQuick = (label: string) => {
    setSelectedQuick(label);
    if (label === "Note" && onAddNote) {
      onAddNote();
      return;
    }
    const prompts: Record<string, string> = {
      Idea: "What ideas have I written down?",
      Recall: "What was I thinking about recently?",
      Search: "Search my notes for ",
    };
    if (label === "Search") {
      setValue(prompts.Search);
    } else if (prompts[label]) {
      setValue(prompts[label]);
    }
  };

  return (
    <div className="relative z-10 shrink-0 border-t border-border bg-cream/90 px-4 py-4 backdrop-blur-sm sm:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-3 flex flex-wrap gap-2">
          {QUICK_ACTIONS.map(({ label, icon }) => (
            <button
              key={label}
              type="button"
              onClick={() => handleQuick(label)}
              className={
                selectedQuick === label ? "quick-pill quick-pill-active" : "quick-pill"
              }
            >
              <QuickIcon type={icon} />
              {label}
            </button>
          ))}
        </div>

        <div className="flex items-end gap-3">
          <textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message here..."
            disabled={loading}
            rows={2}
            className="input-dark min-h-[52px] max-h-36 flex-1 resize-none px-4 py-3.5 text-sm"
          />
          <button
            type="button"
            onClick={handleSend}
            disabled={loading || !value.trim()}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent text-white shadow-bubble transition-all hover:bg-accent-hover disabled:opacity-40"
            aria-label="Send message"
          >
            {loading ? (
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-5 w-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
