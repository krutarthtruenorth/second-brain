export type Role = "user" | "assistant";

export interface Message {
  id: string;
  role: Role;
  content: string;
  createdAt: number;
}

export interface MemoryFact {
  id: string;
  label: string;
  value: string;
  sourceMessageId: string;
  createdAt: number;
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
}

export interface BrainState {
  version: 2;
  chats: Chat[];
  activeChatId: string;
  facts: MemoryFact[];
}

/** @deprecated v1 shape — used only for migration */
export interface BrainStateV1 {
  messages: Message[];
  facts: MemoryFact[];
  version: 1;
}
