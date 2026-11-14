"use client";

import { useState } from "react";
import { ImageToKb } from "@/components/tools/ImageToKb";
import type { ExamUpload } from "@/lib/exams";

/**
 * Lets the user pick which document they're preparing (photo, signature…) and presets the
 * compress-to-KB tool to that document's official limits. Switching document remounts the tool,
 * since each document is a different file.
 */
export function ExamResizer({ uploads }: { uploads: ExamUpload[] }) {
  const items = uploads.filter((u) => u.uploadable && u.maxKb !== undefined);
  const [selectedId, setSelectedId] = useState(items[0]?.id);
  const selected = items.find((u) => u.id === selectedId) ?? items[0];
  if (!selected) return null;

  return (
    <div className="space-y-5">
      {items.length > 1 ? (
        <div role="group" aria-label="Which document are you preparing?" className="flex flex-wrap gap-2">
          {items.map((u) => (
            <button
              key={u.id}
              type="button"
              aria-pressed={u.id === selected.id}
              onClick={() => setSelectedId(u.id)}
              className={
                "rounded-full border px-3 py-1.5 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 " +
                (u.id === selected.id
                  ? "border-blue-600 bg-blue-600 text-white"
                  : "border-slate-300 text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800")
              }
            >
              {u.label}
            </button>
          ))}
        </div>
      ) : null}

      <p className="rounded-lg bg-blue-50 px-3 py-2 text-sm text-blue-900 dark:bg-blue-950/40 dark:text-blue-200">
        <strong>{selected.label}:</strong> {selected.minKb ? `${selected.minKb}–` : "up to "}
        {selected.maxKb} KB{selected.format ? `, ${selected.format}` : ""}
        {selected.dimensions ? ` · ${selected.dimensions}` : ""}
      </p>

      <ImageToKb key={selected.id} defaultKb={selected.maxKb} minKb={selected.minKb ?? 0} presets={[]} />
    </div>
  );
}
