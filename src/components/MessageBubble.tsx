import SourceCard, { type Source } from "./SourceCard";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  sources?: Source[];
  timestamp?: string;
}

interface MessageBubbleProps {
  message: ChatMessage;
}

function formatTime(iso?: string): string {
  const d = iso ? new Date(iso) : new Date();
  return d.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
}

function Avatar({ label, user }: { label: string; user?: boolean }) {
  return (
    <div
      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
        user ? "bg-accent text-white" : "bg-accent/15 text-accent ring-2 ring-accent/25"
      }`}
    >
      {label}
    </div>
  );
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <div
      className={`animate-fade-in relative z-10 flex w-full gap-3 ${
        isUser ? "flex-row-reverse" : "flex-row"
      }`}
    >
      <Avatar label={isUser ? "You" : "SB"} user={isUser} />

      <div
        className={`max-w-[88%] sm:max-w-[78%] flex flex-col ${
          isUser ? "items-end" : "items-start"
        }`}
      >
        <div
          className={`rounded-bubble px-4 py-3 text-sm leading-relaxed shadow-bubble ${
            isUser
              ? "bg-accent text-white"
              : "border border-accent/25 bg-white text-primary"
          }`}
        >
          <p className="whitespace-pre-wrap">{message.content}</p>
          {!isUser && message.sources && message.sources.length > 0 && (
            <SourceCard sources={message.sources} />
          )}

          <div
            className={`mt-3 flex items-center justify-between border-t pt-2 ${
              isUser ? "border-white/20" : "border-accent/10"
            }`}
          >
            <div
              className={`flex items-center gap-2 ${
                isUser ? "text-white/70" : "text-muted"
              }`}
            >
              <button
                type="button"
                className="hover:opacity-80 transition-opacity"
                aria-label="Like"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-3.5 w-3.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
              <button
                type="button"
                className="hover:opacity-80 transition-opacity"
                aria-label="Regenerate"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-3.5 w-3.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>
            <span
              className={`text-[11px] ${isUser ? "text-white/80" : "text-muted"}`}
            >
              {formatTime(message.timestamp)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
