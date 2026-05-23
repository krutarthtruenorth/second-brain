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
    <div className="mt-3 border-t border-accent/10 pt-2">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 text-xs font-medium text-accent hover:text-accent-hover transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-3.5 w-3.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        {open ? "Hide sources" : `View sources (${sources.length})`}
      </button>
      {open && (
        <div className="mt-2 flex flex-col gap-2">
          {sources.map((source, i) => (
            <div
              key={`${source.text.slice(0, 24)}-${i}`}
              className="rounded-input border border-accent/15 bg-cream/80 p-3 text-sm"
            >
              <div className="mb-2 flex items-center gap-2">
                <span
                  className={`h-2 w-2 shrink-0 rounded-full ${relevancyColor(source.relevancy_score)}`}
                />
                <span className="text-xs text-muted">
                  {(source.relevancy_score * 100).toFixed(0)}% match
                </span>
              </div>
              <p className="text-primary/85">{truncate(source.text, 120)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
