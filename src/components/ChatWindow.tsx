import { useEffect, useRef } from "react";
import MessageBubble, { type ChatMessage } from "./MessageBubble";

const WELCOME: ChatMessage = {
  role: "assistant",
  content:
    "Hey — I'm your Second Brain. Add your notes and ask me anything.\nTry: 'What startup ideas have I had?' or\n'What was I thinking about after my last trip?'",
};

interface ChatWindowProps {
  messages: ChatMessage[];
}

export default function ChatWindow({ messages }: ChatWindowProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const displayMessages = messages.length === 0 ? [WELCOME] : messages;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto px-3 py-4 sm:px-6">
      <div className="mx-auto flex max-w-3xl flex-col gap-4">
        {displayMessages.map((msg, i) => (
          <MessageBubble
            key={`${msg.role}-${i}-${msg.content.slice(0, 32)}`}
            message={msg}
          />
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
