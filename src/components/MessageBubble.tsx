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
  if (!iso) {
    return new Date().toLocaleTimeString(undefined, {
      hour: "numeric",
      minute: "2-digit",
    });
  }
  return new Date(iso).toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
}

function Avatar({ label, user }: { label: string; user?: boolean }) {
  return (
    <div
      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
        user
          ? "bg-accent/20 text-accent ring-1 ring-accent/30"
          : "bg-gradient-to-br from-accent/35 to-teal-dark text-primary ring-1 ring-accent/20"
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
      className={`animate-fade-in flex w-full gap-3 ${
        isUser ? "flex-row-reverse" : "flex-row"
      }`}
    >
      <Avatar label={isUser ? "You" : "SB"} user={isUser} />

      <div
        className={`max-w-[88%] sm:max-w-[75%] ${
          isUser ? "items-end" : "items-start"
        } flex flex-col`}
      >
        <div
          className={`rounded-bubble border px-4 py-3 text-sm leading-relaxed ${
            isUser
              ? "border-accent/25 bg-bubble-user text-primary"
              : "border-border-strong bg-bubble-assistant text-primary/95 backdrop-blur-sm"
          }`}
        >
          <p className="whitespace-pre-wrap">{message.content}</p>
          {!isUser && message.sources && message.sources.length > 0 && (
            <SourceCard sources={message.sources} />
          )}

          <div className="mt-3 flex items-center justify-between border-t border-white/5 pt-2">
            <div className="flex items-center gap-2 text-muted/70">
              <button type="button" className="hover:text-accent transition-colors" aria-label="Like">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-3.5 w-3.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
              <button
                type="button"
                className="hover:text-accent transition-colors"
                aria-label="Copy"
                onClick={() => navigator.clipboard.writeText(message.content)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-3.5 w-3.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
            </div>
            <span className="text-[11px] text-muted">
              {formatTime(message.timestamp)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
