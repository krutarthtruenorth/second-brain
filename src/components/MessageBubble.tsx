import SourceCard, { type Source } from "./SourceCard";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  sources?: Source[];
}

interface MessageBubbleProps {
  message: ChatMessage;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <div
      className={`animate-fade-in flex w-full ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-[85%] sm:max-w-[75%] px-4 py-3 rounded-bubble text-sm leading-relaxed ${
          isUser
            ? "bg-accent text-white"
            : "bg-surface border border-border text-primary"
        }`}
      >
        <p className="whitespace-pre-wrap">{message.content}</p>
        {!isUser && message.sources && message.sources.length > 0 && (
          <SourceCard sources={message.sources} />
        )}
      </div>
    </div>
  );
}
