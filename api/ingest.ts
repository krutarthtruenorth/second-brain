import type { VercelRequest, VercelResponse } from "@vercel/node";
import { ensureTenant, addMemory } from "./_lib/hydradb";
import { addNote } from "./_lib/store";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  void ensureTenant();

  const body = req.body as { text?: string; created_at?: string };
  const text = typeof body?.text === "string" ? body.text.trim() : "";

  if (!text) {
    return res.status(400).json({ error: "text is required" });
  }

  try {
    const source_id = await addMemory(text);
    const created_at = body.created_at || new Date().toISOString();
    const preview = text.slice(0, 80);

    addNote({ text, source_id, created_at, preview });

    return res.status(200).json({
      source_id,
      status: "queued",
      preview,
    });
  } catch (err) {
    console.error("ingest error:", err);
    const message =
      err instanceof Error ? err.message : "Failed to ingest note";
    return res.status(500).json({ error: message });
  }
}
