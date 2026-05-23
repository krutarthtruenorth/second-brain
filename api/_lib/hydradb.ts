const HYDRA_BASE = "https://api.hydradb.com";

export interface Chunk {
  chunk_content: string;
  relevancy_score: number;
}

function getAuthHeaders(): HeadersInit {
  const key = process.env.HYDRA_DB_API_KEY;
  if (!key) {
    throw new Error("HYDRA_DB_API_KEY is not configured");
  }
  return {
    Authorization: `Bearer ${key}`,
    "Content-Type": "application/json",
  };
}

function tenantId(): string {
  return process.env.HYDRA_TENANT_ID || "second_brain_demo";
}

function subTenantId(): string {
  return process.env.HYDRA_SUB_TENANT_ID || "shared_user";
}

export async function ensureTenant(): Promise<void> {
  try {
    const res = await fetch(`${HYDRA_BASE}/tenants/create`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ tenant_id: tenantId() }),
    });

    if (res.status === 409) {
      return;
    }

    const text = await res.text();
    if (
      !res.ok &&
      !text.toLowerCase().includes("already exists")
    ) {
      console.error("ensureTenant failed:", res.status, text);
    }
  } catch (err) {
    console.error("ensureTenant error:", err);
  }
}

function isInfraReady(data: {
  infra?: {
    graph_status?: boolean;
    vectorstore_status?: boolean[];
  };
}): boolean {
  const infra = data.infra;
  if (!infra) return false;
  return (
    infra.graph_status === true &&
    infra.vectorstore_status?.[0] === true &&
    infra.vectorstore_status?.[1] === true
  );
}

export async function pollUntilReady(): Promise<boolean> {
  const maxAttempts = 8;
  const intervalMs = 3000;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      const res = await fetch(
        `${HYDRA_BASE}/tenants/infra/status?tenant_id=${encodeURIComponent(tenantId())}`,
        {
          method: "GET",
          headers: getAuthHeaders(),
        }
      );

      if (res.ok) {
        const data = (await res.json()) as {
          infra?: {
            graph_status?: boolean;
            vectorstore_status?: boolean[];
          };
        };
        if (isInfraReady(data)) {
          return true;
        }
      }
    } catch (err) {
      console.error("pollUntilReady error:", err);
    }

    if (attempt < maxAttempts - 1) {
      await new Promise((resolve) => setTimeout(resolve, intervalMs));
    }
  }

  return false;
}

export async function addMemory(text: string): Promise<string> {
  const res = await fetch(`${HYDRA_BASE}/memories/add_memory`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({
      tenant_id: tenantId(),
      sub_tenant_id: subTenantId(),
      memories: [{ text, infer: true }],
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`addMemory failed (${res.status}): ${body}`);
  }

  const data = (await res.json()) as {
    results?: Array<{ source_id?: string; status?: string }>;
  };

  const sourceId = data.results?.[0]?.source_id;
  if (!sourceId) {
    throw new Error("addMemory returned no source_id");
  }

  return sourceId;
}

export async function recallMemories(query: string): Promise<Chunk[]> {
  try {
    const res = await fetch(`${HYDRA_BASE}/recall/recall_preferences`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({
        tenant_id: tenantId(),
        sub_tenant_id: subTenantId(),
        query,
        mode: "fast",
        max_results: 5,
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      console.error("recallMemories failed:", res.status, body);
      return [];
    }

    const data = (await res.json()) as {
      chunks?: Array<{
        chunk_content?: string;
        relevancy_score?: number;
      }>;
    };

    return (data.chunks ?? [])
      .filter(
        (c): c is { chunk_content: string; relevancy_score: number } =>
          typeof c.chunk_content === "string" &&
          typeof c.relevancy_score === "number" &&
          c.relevancy_score > 0.3
      )
      .map((c) => ({
        chunk_content: c.chunk_content,
        relevancy_score: c.relevancy_score,
      }));
  } catch (err) {
    console.error("recallMemories error:", err);
    return [];
  }
}
