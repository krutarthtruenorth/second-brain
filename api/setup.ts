import type { VercelRequest, VercelResponse } from "@vercel/node";
import { ensureTenant, pollUntilReady } from "./_lib/hydradb";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    await ensureTenant();
    const ready = await pollUntilReady();

    if (ready) {
      return res.status(200).json({
        status: "ready",
        message: "Tenant provisioned",
      });
    }

    return res.status(200).json({
      status: "timeout",
      message: "Still provisioning, try again in 30s",
    });
  } catch (err) {
    console.error("setup error:", err);
    return res.status(500).json({
      status: "error",
      message: "Setup failed",
    });
  }
}
