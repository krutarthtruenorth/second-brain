import type { VercelRequest, VercelResponse } from "@vercel/node";
import { recallMemories } from "./_lib/hydradb";
import {
  enrichQuery,
  synthesizeAnswer,
  type Message,
} from "./_lib/openai";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const body = req.body as {
    question?: string;
    history?: Message[];
  };

  const question =
    typeof body?.question === "string" ? body.question.trim() : "";

  if (!question) {
    return res.status(400).json({ error: "question is required" });
  }

  const history = Array.isArray(body.history) ? body.history : [];

  try {
    const enriched = await enrichQuery(question);
    const chunks = await recallMemories(enriched);
    const answer = await synthesizeAnswer(question, chunks, history);

    return res.status(200).json({
      answer,
      sources: chunks.map((c) => ({
        text: c.chunk_content,
        relevancy_score: c.relevancy_score,
      })),
    });
  } catch (err) {
    console.error("query error:", err);
    return res.status(200).json({
      answer: "Something went wrong. Please try again.",
      sources: [],
    });
  }
}
