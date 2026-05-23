import { useState } from "react";

interface NoteInputProps {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
}

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export default function NoteInput({ open, onClose, onSaved }: NoteInputProps) {
  const [text, setText] = useState("");
  const [date, setDate] = useState(todayISO);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const handleSubmit = async () => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    setLoading(true);
    setToast(null);

    try {
      const created_at = new Date(`${date}T12:00:00`).toISOString();
      const res = await fetch("/api/ingest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: trimmed, created_at }),
      });

      if (!res.ok) {
        throw new Error("Ingest failed");
      }

      setToast({
        type: "success",
        message: "Saved to your Second Brain ✓",
      });
      setText("");
      onSaved();

      setTimeout(() => {
        onClose();
        setToast(null);
      }, 1000);
    } catch {
      setToast({ type: "error", message: "Failed to save, try again" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
        aria-hidden={!open}
      />
      <aside
        className={`fixed top-0 right-0 z-50 flex h-full w-full max-w-md flex-col border-l border-border bg-surface transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        aria-hidden={!open}
      >
        <div className="flex items-center justify-between border-b border-border px-4 py-4">
          <h2 className="text-lg font-medium text-primary">Add Note</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-input px-3 py-1 text-muted hover:text-primary"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="flex flex-1 flex-col gap-4 p-4">
          <div>
            <label
              htmlFor="note-date"
              className="mb-1 block text-xs text-muted"
            >
              Date
            </label>
            <input
              id="note-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-input border border-border bg-background px-3 py-2 text-sm text-primary focus:border-accent focus:outline-none"
            />
          </div>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste your note here..."
            className="min-h-[200px] flex-1 resize-none rounded-input border border-border bg-background px-4 py-3 text-sm text-primary placeholder:text-muted focus:border-accent focus:outline-none"
          />

          {toast && (
            <p
              className={`text-sm ${
                toast.type === "success" ? "text-success" : "text-error"
              }`}
            >
              {toast.message}
            </p>
          )}

          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading || !text.trim()}
            className="rounded-input bg-accent py-3 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-40"
          >
            {loading ? "Saving…" : "Remember This"}
          </button>
        </div>
      </aside>
    </>
  );
}
