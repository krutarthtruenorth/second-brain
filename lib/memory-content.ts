const HASHTAG_PATTERN = /#([\p{L}\p{N}_-]+)/gu;

export type ParsedMemoryContent = {
  content: string;
  tags: string[];
};

export function parseMemoryContent(
  raw: string,
  maxTags = 20,
): ParsedMemoryContent {
  const tags: string[] = [];
  const seen = new Set<string>();

  for (const match of raw.matchAll(HASHTAG_PATTERN)) {
    const tag = match[1].toLowerCase();
    if (!seen.has(tag)) {
      seen.add(tag);
      tags.push(tag);
    }
  }

  const content = raw
    .replace(HASHTAG_PATTERN, "")
    .replace(/\s{2,}/g, " ")
    .trim();

  return {
    content,
    tags: tags.slice(0, maxTags),
  };
}
