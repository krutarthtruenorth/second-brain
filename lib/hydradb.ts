import { HydraDBClient } from "@hydradb/sdk";
import {
  INDEXING_DELAY_MS,
  INDEXING_MAX_ATTEMPTS,
  MAX_MEMORY_TAGS,
  RECALL_MAX_RESULTS,
  RECALL_TAG_FILTER_MAX_RESULTS,
} from "@/lib/constants";
import {
  formatIndexedMemoryText,
  memoryMatchesTags,
  parseMemoryContent,
} from "@/lib/memory-content";
import type { MemorySource } from "@/lib/types";

const SUB_TENANT_ID = "mvp_user";

function getConfig() {
  const apiKey = process.env.HYDRADB_API_KEY;
  const tenantId = process.env.HYDRADB_PROJECT_ID;
  const baseUrl = process.env.HYDRADB_URL;

  if (!apiKey) {
    throw new Error("HYDRADB_API_KEY is not configured");
  }
  if (!tenantId) {
    throw new Error("HYDRADB_PROJECT_ID is not configured");
  }

  return { apiKey, tenantId, baseUrl };
}

function createClient() {
  const { apiKey, baseUrl } = getConfig();

  return new HydraDBClient({
    token: apiKey,
    ...(baseUrl ? { baseUrl } : {}),
  });
}

function getTenantId() {
  return getConfig().tenantId;
}

const READY_STATUSES = new Set([
  "completed",
  "graph_creation",
  "success",
]);

async function waitForIndexing(sourceId: string): Promise<string> {
  const client = createClient();
  const tenantId = getTenantId();
  const maxAttempts = INDEXING_MAX_ATTEMPTS;
  const delayMs = INDEXING_DELAY_MS;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const response = await client.upload.verifyProcessing({
      tenant_id: tenantId,
      sub_tenant_id: SUB_TENANT_ID,
      file_ids: [sourceId],
    });

    const status = response.statuses?.[0];
    if (!status) {
      break;
    }

    if (status.indexing_status === "errored") {
      throw new Error(
        status.message || "Memory indexing failed. Please try again.",
      );
    }

    if (READY_STATUSES.has(status.indexing_status)) {
      return status.indexing_status;
    }

    await new Promise((resolve) => setTimeout(resolve, delayMs));
  }

  return "queued";
}

export async function saveMemory(rawContent: string): Promise<{
  sourceId: string;
  status: string;
  tags: string[];
}> {
  const { content, tags } = parseMemoryContent(rawContent, MAX_MEMORY_TAGS);

  if (!content) {
    throw new Error(
      "Memory content cannot be empty after removing hashtags.",
    );
  }

  const client = createClient();
  const tenantId = getTenantId();

  const additional_metadata: Record<string, unknown> = {
    app: "second-brain-mvp",
    created_at: new Date().toISOString(),
  };

  if (tags.length > 0) {
    additional_metadata.tags = tags;
  }

  const indexedText = formatIndexedMemoryText(content, tags);

  const response = await client.upload.addMemory({
    tenant_id: tenantId,
    sub_tenant_id: SUB_TENANT_ID,
    memories: [
      {
        text: indexedText,
        infer: false,
        title: content.slice(0, 80) || "Memory",
        additional_metadata,
      },
    ],
  });

  const result = response.results?.[0];
  if (!result?.source_id) {
    throw new Error(response.message || "Failed to save memory");
  }

  const indexingStatus = await waitForIndexing(result.source_id);

  return {
    sourceId: result.source_id,
    status: indexingStatus,
    tags,
  };
}

export async function searchMemories(
  rawQuestion: string,
): Promise<MemorySource[]> {
  const { content, tags } = parseMemoryContent(rawQuestion, MAX_MEMORY_TAGS);
  const query = [content, ...tags].filter(Boolean).join(" ").trim();

  const client = createClient();
  const tenantId = getTenantId();

  const response = await client.recall.recallPreferences({
    tenant_id: tenantId,
    sub_tenant_id: SUB_TENANT_ID,
    query,
    max_results:
      tags.length > 0 ? RECALL_TAG_FILTER_MAX_RESULTS : RECALL_MAX_RESULTS,
    mode: "fast",
  });

  let chunks = response.chunks ?? [];

  if (tags.length > 0) {
    chunks = chunks.filter((chunk) =>
      memoryMatchesTags(
        chunk.additional_metadata?.tags,
        chunk.chunk_content ?? "",
        tags,
      ),
    );
  }

  return chunks.slice(0, RECALL_MAX_RESULTS).map((chunk) => ({
    sourceId: chunk.source_id ?? "unknown",
    title: chunk.source_title ?? null,
    content: chunk.chunk_content ?? "",
    score:
      typeof chunk.relevancy_score === "number" ? chunk.relevancy_score : null,
  }));
}
