"use client";

import type { LucideIcon } from "lucide-react";
import { BookOpen, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { MemorySource } from "@/lib/types";

type ResultPanelProps = {
  mode: "save" | "ask";
  isLoading: boolean;
  answer: string | null;
  sources: MemorySource[];
};

function PanelHeader({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3 border-b border-border/60 px-4 pt-5 pb-4 sm:px-6">
      <div
        className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary"
        aria-hidden
      >
        <Icon className="size-4" />
      </div>
      <div className="min-w-0 space-y-0.5">
        <h3 className="text-base font-semibold text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

export function ResultPanel({
  mode,
  isLoading,
  answer,
  sources,
}: ResultPanelProps) {
  if (mode !== "ask") {
    return null;
  }

  const hasAnswer = Boolean(answer);
  const hasSources = sources.length > 0;

  return (
    <div className="flex flex-col gap-6">
      <Card className="gap-0 overflow-hidden rounded-2xl border-border/60 bg-card py-0 shadow-card">
        <PanelHeader
          icon={Sparkles}
          title="Answer"
          description="Grounded response from your saved memories."
        />
        <CardContent className="px-4 pt-4 pb-6 sm:px-6">
          {isLoading ? (
            <div
              className="space-y-2 rounded-xl bg-cream-dark/80 p-4"
              aria-live="polite"
              aria-busy="true"
            >
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          ) : hasAnswer ? (
            <div className="rounded-xl bg-cream-dark/80 p-4">
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
                {answer}
              </p>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Ask a question to see an answer here.
            </p>
          )}
        </CardContent>
      </Card>

      <Card className="gap-0 overflow-hidden rounded-2xl border-border/60 bg-card py-0 shadow-card">
        <PanelHeader
          icon={BookOpen}
          title="Retrieved Sources"
          description="Memory chunks used to generate the answer."
        />
        <CardContent className="space-y-3 px-4 pt-4 pb-6 sm:px-6">
          {isLoading ? (
            <div className="space-y-3" aria-live="polite" aria-busy="true">
              <Skeleton className="h-20 w-full rounded-xl" />
              <Skeleton className="h-20 w-full rounded-xl" />
            </div>
          ) : hasSources ? (
            sources.map((source, index) => (
              <article
                key={`${source.sourceId}-${index}`}
                className="rounded-xl border border-border/60 bg-cream-dark/50 p-4"
              >
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <Badge
                    variant="secondary"
                    className="bg-primary/10 text-primary hover:bg-primary/10"
                  >
                    Source {index + 1}
                  </Badge>
                  {source.title ? (
                    <span className="text-xs font-medium text-foreground">
                      {source.title}
                    </span>
                  ) : null}
                  {source.score != null ? (
                    <Badge variant="outline" className="text-xs">
                      {Math.round(source.score * 100)}% match
                    </Badge>
                  ) : null}
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {source.content || "No content available for this chunk."}
                </p>
                <p className="mt-2 font-mono text-[10px] text-muted-foreground/80">
                  ID: {source.sourceId}
                </p>
              </article>
            ))
          ) : hasAnswer ? (
            <p className="text-sm text-muted-foreground">
              No matching memory chunks were retrieved for this question.
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">
              Sources from HydraDB will appear here after you ask a question.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
