import { useState, type KeyboardEvent } from "react";

interface ChatInputProps {
  onSend: (text: string) => void;
  loading: boolean;
}

export default function ChatInput({ onSend, loading }: ChatInputProps) {
  const [value, setValue] = useState("");

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

  return (
    <div className="border-t border-border bg-background p-3 sm:p-4">
      <div className="mx-auto flex max-w-3xl items-end gap-2">
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything about your notes..."
          disabled={loading}
          rows={1}
          className="min-h-[44px] max-h-32 flex-1 resize-none rounded-input border border-border bg-surface px-4 py-3 text-sm text-primary placeholder:text-muted focus:border-accent focus:outline-none disabled:opacity-50"
        />
        <button
          type="button"
          onClick={handleSend}
          disabled={loading || !value.trim()}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-input bg-accent text-white transition-opacity hover:opacity-90 disabled:opacity-40"
          aria-label="Send message"
        >
          {loading ? (
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-5 w-5"
            >
              <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-.528 60.516 60.516 0 0 0-18.445-8.986Z" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
