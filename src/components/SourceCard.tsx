import { useState } from "react";

export interface Source {
  text: string;
  relevancy_score: number;
}

interface SourceCardProps {
  sources: Source[];
}

function relevancyColor(score: number): string {
  if (score > 0.7) return "bg-success";
  if (score > 0.4) return "bg-warning";
  return "bg-error";
}

function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return `${text.slice(0, max)}…`;
}

export default function SourceCard({ sources }: SourceCardProps) {
  const [open, setOpen] = useState(false);

  if (sources.length === 0) return null;

  return (
    <div className="mt-3 border-t border-white/5 pt-2">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="text-xs text-accent/80 hover:text-accent transition-colors"
      >
        {open ? "Hide sources" : `View sources (${sources.length})`}
      </button>
      {open && (
        <div className="mt-2 flex flex-col gap-2">
          {sources.map((source, i) => (
            <div
              key={`${source.text.slice(0, 24)}-${i}`}
              className="rounded-input border border-border bg-black/20 p-3 text-sm"
            >
              <div className="mb-2 flex items-center gap-2">
                <span
                  className={`h-2 w-2 shrink-0 rounded-full ${relevancyColor(source.relevancy_score)}`}
                />
                <span className="text-xs text-muted">
                  {(source.relevancy_score * 100).toFixed(0)}% match
                </span>
              </div>
              <p className="text-primary/80">{truncate(source.text, 120)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
