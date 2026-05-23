import { useEffect, useRef } from "react";
import MessageBubble, { type ChatMessage } from "./MessageBubble";
import ChatHeader from "./ChatHeader";
import BrainBackground from "./BrainBackground";

const WELCOME: ChatMessage = {
  role: "assistant",
  content:
    "Hey — I'm your Second Brain. Add your notes and ask me anything.\n\nTry:\n1. What startup ideas have I had?\n2. What was I thinking about after my last trip?",
  timestamp: new Date().toISOString(),
};

interface ChatWindowProps {
  messages: ChatMessage[];
  onOpenMenu?: () => void;
}

export default function ChatWindow({ messages, onOpenMenu }: ChatWindowProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const displayMessages = messages.length === 0 ? [WELCOME] : messages;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="relative flex min-h-0 flex-1 flex-col bg-cream">
      <BrainBackground />
      <ChatHeader onOpenMenu={onOpenMenu} />

      <div className="scrollbar-thin relative z-10 flex-1 overflow-y-auto px-4 py-5 sm:px-8">
        <div className="mx-auto flex max-w-3xl flex-col gap-5">
          {displayMessages.map((msg, i) => (
            <MessageBubble
              key={`${msg.role}-${i}-${msg.content.slice(0, 32)}`}
              message={msg}
            />
          ))}
          <div ref={bottomRef} />
        </div>
      </div>
    </div>
  );
}
