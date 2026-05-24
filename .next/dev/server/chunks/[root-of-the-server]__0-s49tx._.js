module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[externals]/stream [external] (stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}),
"[project]/lib/hydradb.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "saveMemory",
    ()=>saveMemory,
    "searchMemories",
    ()=>searchMemories
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$hydradb$2f$sdk$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@hydradb/sdk/dist/index.js [app-route] (ecmascript)");
;
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
    return {
        apiKey,
        tenantId,
        baseUrl
    };
}
function createClient() {
    const { apiKey, baseUrl } = getConfig();
    return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$hydradb$2f$sdk$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["HydraDBClient"]({
        token: apiKey,
        ...baseUrl ? {
            baseUrl
        } : {}
    });
}
function getTenantId() {
    return getConfig().tenantId;
}
const READY_STATUSES = new Set([
    "completed",
    "graph_creation",
    "success"
]);
async function waitForIndexing(sourceId) {
    const client = createClient();
    const tenantId = getTenantId();
    const maxAttempts = 12;
    const delayMs = 1000;
    for(let attempt = 0; attempt < maxAttempts; attempt++){
        const response = await client.upload.verifyProcessing({
            tenant_id: tenantId,
            sub_tenant_id: SUB_TENANT_ID,
            file_ids: [
                sourceId
            ]
        });
        const status = response.statuses?.[0];
        if (!status) {
            break;
        }
        if (status.indexing_status === "errored") {
            throw new Error(status.message || "Memory indexing failed. Please try again.");
        }
        if (READY_STATUSES.has(status.indexing_status)) {
            return status.indexing_status;
        }
        await new Promise((resolve)=>setTimeout(resolve, delayMs));
    }
    return "queued";
}
async function saveMemory(content) {
    const client = createClient();
    const tenantId = getTenantId();
    const response = await client.upload.addMemory({
        tenant_id: tenantId,
        sub_tenant_id: SUB_TENANT_ID,
        memories: [
            {
                text: content,
                infer: false,
                title: content.slice(0, 80) || "Memory",
                additional_metadata: {
                    app: "second-brain-mvp"
                }
            }
        ]
    });
    const result = response.results?.[0];
    if (!result?.source_id) {
        throw new Error(response.message || "Failed to save memory");
    }
    const indexingStatus = await waitForIndexing(result.source_id);
    return {
        sourceId: result.source_id,
        status: indexingStatus
    };
}
async function searchMemories(question) {
    const client = createClient();
    const tenantId = getTenantId();
    const response = await client.recall.recallPreferences({
        tenant_id: tenantId,
        sub_tenant_id: SUB_TENANT_ID,
        query: question,
        max_results: 6,
        mode: "fast"
    });
    const chunks = response.chunks ?? [];
    return chunks.map((chunk)=>({
            sourceId: chunk.source_id ?? "unknown",
            title: chunk.source_title ?? null,
            content: chunk.chunk_content ?? "",
            score: typeof chunk.relevancy_score === "number" ? chunk.relevancy_score : null
        }));
}
}),
"[project]/lib/validation.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "askQuestionSchema",
    ()=>askQuestionSchema,
    "saveMemorySchema",
    ()=>saveMemorySchema
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/node_modules/zod/v4/classic/external.js [app-route] (ecmascript) <export * as z>");
;
const saveMemorySchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    content: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().trim().min(1, "Memory content cannot be empty").max(5000, "Memory content is too long")
});
const askQuestionSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    question: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().trim().min(1, "Question cannot be empty").max(2000, "Question is too long")
});
}),
"[project]/app/api/memories/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$hydradb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/hydradb.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$validation$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/validation.ts [app-route] (ecmascript)");
;
;
;
async function POST(request) {
    try {
        const body = await request.json();
        const parsed = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$validation$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["saveMemorySchema"].safeParse(body);
        if (!parsed.success) {
            const message = parsed.error.issues[0]?.message ?? "Invalid request";
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: message
            }, {
                status: 400
            });
        }
        const { sourceId, status } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$hydradb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["saveMemory"])(parsed.data.content);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            sourceId,
            status,
            message: "Memory saved successfully"
        });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to save memory";
        console.error("[POST /api/memories]", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: message
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__0-s49tx._.js.map