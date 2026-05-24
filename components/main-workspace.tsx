"use client";

import { Lock } from "lucide-react";
import { AppHeader } from "@/components/app-header";
import { FeatureHighlights } from "@/components/feature-highlights";
import { IntroBanner } from "@/components/intro-banner";
import { MemoryInputCard } from "@/components/memory-input-card";

export function MainWorkspace() {
  return (
    <div className="flex min-h-dvh flex-col bg-cream">
      <AppHeader />

      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-6 sm:px-6 sm:py-8">
        <IntroBanner />
        <MemoryInputCard />
        <FeatureHighlights />
      </main>

      <footer className="mx-auto flex w-full max-w-4xl shrink-0 items-center justify-center gap-1.5 px-4 pb-8 text-center text-xs text-muted-foreground sm:px-6">
        <Lock className="size-3.5 shrink-0" aria-hidden />
        <span>
          Single-user demo · Fixed HydraDB sub-tenant · Text, Markdown, and audio
        </span>
      </footer>
    </div>
  );
}
