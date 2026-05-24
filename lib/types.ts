export type MemorySource = {
  sourceId: string;
  title: string | null;
  content: string;
  score: number | null;
};

export type SaveMemoryResponse = {
  sourceId: string;
  status: string;
  message: string;
  tags: string[];
};

export type AskResponse = {
  answer: string;
  sources: MemorySource[];
};

export type ApiErrorResponse = {
  error: string;
};

export type WorkspaceMode = "save" | "ask" | "brain";

export type BrainGraphNode = {
  id: string;
  label: string;
  type: string;
  val: number;
};

export type BrainGraphLink = {
  id: string;
  source: string;
  target: string;
  label: string;
};

export type BrainGraphResponse = {
  nodes: BrainGraphNode[];
  links: BrainGraphLink[];
  nextCursor: number | null;
  isTruncated: boolean;
};
