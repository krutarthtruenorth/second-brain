"use client";

import dynamic from "next/dynamic";
import { Brain, Loader2, RefreshCw } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import type { BrainGraphResponse } from "@/lib/types";

const ForceGraph2D = dynamic(() => import("react-force-graph-2d"), {
  ssr: false,
});

type ForceGraphNode = BrainGraphResponse["nodes"][number] & {
  x?: number;
  y?: number;
};

export function BrainPanel() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<BrainGraphResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [dimensions, setDimensions] = useState({ width: 640, height: 480 });

  const fetchGraph = useCallback(async (showLoading = false) => {
    if (showLoading) {
      setLoading(true);
    }
    setError(null);

    try {
      const response = await fetch("/api/brain");
      const json = (await response.json()) as BrainGraphResponse & {
        error?: string;
      };

      if (!response.ok) {
        throw new Error(json.error ?? "Failed to load brain graph");
      }

      setData(json);
    } catch (loadError) {
      const message =
        loadError instanceof Error
          ? loadError.message
          : "Failed to load brain graph";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadInitialGraph() {
      try {
        const response = await fetch("/api/brain");
        const json = (await response.json()) as BrainGraphResponse & {
          error?: string;
        };

        if (cancelled) {
          return;
        }

        if (!response.ok) {
          throw new Error(json.error ?? "Failed to load brain graph");
        }

        setData(json);
        setError(null);
      } catch (loadError) {
        if (cancelled) {
          return;
        }

        const message =
          loadError instanceof Error
            ? loadError.message
            : "Failed to load brain graph";
        setError(message);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadInitialGraph();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) {
        return;
      }

      const { width, height } = entry.contentRect;
      setDimensions({
        width: Math.max(Math.floor(width), 320),
        height: Math.max(Math.floor(height), 320),
      });
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  if (loading) {
    return (
      <div
        className="flex min-h-64 items-center justify-center gap-2 text-sm text-muted-foreground"
        aria-live="polite"
        aria-busy="true"
      >
        <Loader2 className="size-4 animate-spin" aria-hidden />
        Loading knowledge graph…
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-3 rounded-xl bg-cream-dark/80 p-6 text-center">
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
        <Button variant="outline" size="sm" onClick={() => void fetchGraph(true)}>
          <RefreshCw className="size-3.5" aria-hidden />
          Retry
        </Button>
      </div>
    );
  }

  if (!data?.nodes.length) {
    return (
      <div className="space-y-3 rounded-xl bg-cream-dark/80 p-6 text-center">
        <Brain className="mx-auto size-8 text-primary" aria-hidden />
        <p className="text-sm text-muted-foreground">
          No graph yet. Save memories with named people, places, and
          relationships, then wait ~30 seconds for HydraDB to build the graph.
        </p>
        <Button variant="outline" size="sm" onClick={() => void fetchGraph(true)}>
          <RefreshCw className="size-3.5" aria-hidden />
          Refresh
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div
        ref={containerRef}
        className="h-[min(60vh,480px)] overflow-hidden rounded-xl bg-black"
      >
        <ForceGraph2D
          width={dimensions.width}
          height={dimensions.height}
          graphData={{ nodes: data.nodes, links: data.links }}
          backgroundColor="#000000"
          nodeLabel="label"
          linkLabel="label"
          linkDirectionalArrowLength={4}
          linkDirectionalArrowRelPos={1}
          linkColor={() => "rgba(224, 122, 79, 0.55)"}
          nodeCanvasObject={(node, ctx, globalScale) => {
            const graphNode = node as ForceGraphNode;
            const radius = graphNode.val ?? 4;
            const label = graphNode.label;
            const fontSize = Math.max(12 / globalScale, 3);

            ctx.beginPath();
            ctx.arc(graphNode.x ?? 0, graphNode.y ?? 0, radius, 0, 2 * Math.PI);
            ctx.fillStyle = "#e07a4f";
            ctx.fill();
            ctx.strokeStyle = "#c45a2f";
            ctx.lineWidth = 1.5 / globalScale;
            ctx.stroke();

            ctx.font = `${fontSize}px sans-serif`;
            ctx.textAlign = "left";
            ctx.textBaseline = "middle";

            const padding = 4 / globalScale;
            const textWidth = ctx.measureText(label).width;
            const boxX = (graphNode.x ?? 0) + radius + 6 / globalScale;
            const boxY = (graphNode.y ?? 0) - fontSize / 2 - padding;
            const boxHeight = fontSize + padding * 2;

            ctx.fillStyle = "rgba(60, 60, 60, 0.75)";
            ctx.fillRect(boxX, boxY, textWidth + padding * 2, boxHeight);

            ctx.fillStyle = "rgba(255, 255, 255, 0.92)";
            ctx.fillText(label, boxX + padding, graphNode.y ?? 0);
          }}
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 px-1">
        <p className="text-xs text-muted-foreground">
          {data.nodes.length} entities · {data.links.length} relationships
          {data.isTruncated ? " · showing first page" : ""}
        </p>
        <Button variant="ghost" size="sm" onClick={() => void fetchGraph(true)}>
          <RefreshCw className="size-3.5" aria-hidden />
          Refresh
        </Button>
      </div>
    </div>
  );
}
