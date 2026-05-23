import OpenAI from "openai";
import type { Chunk } from "./hydradb";

export interface Message {
  role: "user" | "assistant";
  content: string;
}

function getClient(): OpenAI {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured");
  }
  return new OpenAI({ apiKey });
}

export async function enrichQuery(question: string): Promise<string> {
  try {
    const client = getClient();
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are a search query optimizer for a personal notes app.
Extract the core search intent from the user's question as 3-5
keywords or short phrases capturing the main topic, any temporal
context (events, trips, time periods), and emotional context.
Return ONLY valid JSON: { "keywords": ["...", "..."] }
No explanation. No markdown. No backticks. Just the JSON object.`,
        },
        { role: "user", content: question },
      ],
      temperature: 0.2,
    });

    const raw = completion.choices[0]?.message?.content?.trim() ?? "";
    const cleaned = raw.replace(/^```json\s*/i, "").replace(/```\s*$/i, "");
    const parsed = JSON.parse(cleaned) as { keywords?: string[] };
    if (Array.isArray(parsed.keywords) && parsed.keywords.length > 0) {
      return parsed.keywords.join(" ");
    }
    return question;
  } catch (err) {
    console.error("enrichQuery error:", err);
    return question;
  }
}

export async function synthesizeAnswer(
  question: string,
  chunks: Chunk[],
  history: Message[]
): Promise<string> {
  try {
    const client = getClient();
    const recentHistory = history.slice(-6);
    const notesBlock =
      chunks.length > 0
        ? chunks
            .map((c, i) => `${i + 1}. ${c.chunk_content}`)
            .join("\n")
        : "(none)";

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are Second Brain — a personal memory assistant that
helps users recall their own notes and thoughts.

Rules:
- Answer using ONLY the retrieved notes provided to you
- Quote the user's exact words in quotation marks when possible
- Mention dates naturally if available
- Be conversational — this is a chat interface
- If multiple notes are relevant, surface all of them
- If the retrieved notes are empty or nothing is relevant say
  exactly this: 'I couldn't find anything about that in your
  notes yet. Try adding more context or rephrasing.'
- Never invent or infer content the user did not write
- Keep answers to 2-4 sentences unless the question needs more`,
        },
        ...recentHistory.map((m) => ({
          role: m.role as "user" | "assistant",
          content: m.content,
        })),
        {
          role: "user",
          content: `Question: ${question}

Retrieved notes:
${notesBlock}

Answer based only on the retrieved notes above.`,
        },
      ],
      temperature: 0.5,
    });

    return (
      completion.choices[0]?.message?.content?.trim() ??
      "Something went wrong. Please try again."
    );
  } catch (err) {
    console.error("synthesizeAnswer error:", err);
    return "Something went wrong. Please try again.";
  }
}
