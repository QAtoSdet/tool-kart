"use client";

import { useCallback, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Field, Input } from "@/components/ui/Input";
import { formatBytes, reductionPercent } from "@/lib/image-compression";
// Type-only import: pdf-lib (≈170 kB) is loaded on demand when the user presses the button.
import type { PdfMode, PdfResult } from "@/lib/pdf-tools";

const MODES: { value: PdfMode; label: string; hint: string; action: string }[] = [
  {
    value: "merge",
    label: "Merge PDFs",
    hint: "Choose two or more PDFs. They're joined in the order listed below.",
    action: "Merge PDFs",
  },
  {
    value: "split",
    label: "Split PDF",
    hint: "Choose one PDF, then the pages to extract. Each page becomes its own PDF.",
    action: "Split PDF",
  },
  {
    value: "optimize",
    label: "Optimize PDF",
    hint: "Re-saves the PDF more compactly. Best for text PDFs; scanned pages barely shrink.",
    action: "Optimize PDF",
  },
];

interface ShownResult extends PdfResult {
  mode: PdfMode;
  inputBytes: number;
}

export function PdfTools() {
  const [mode, setMode] = useState<PdfMode>("merge");
  const [files, setFiles] = useState<File[]>([]);
  const [splitRange, setSplitRange] = useState("1-3, 5");
  const [result, setResult] = useState<ShownResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  // Bumped on every mode or file change, so a slow run can't show its result in the wrong place.
  const runIdRef = useRef(0);

  const current = MODES.find((m) => m.value === mode)!;

  const reset = useCallback(() => {
    runIdRef.current++;
    setResult(null);
    setError(null);
  }, []);

  const onFiles = useCallback(
    (input: HTMLInputElement) => {
      reset();
      setFiles(input.files ? Array.from(input.files) : []);
      // Clear the input so choosing the same file again still fires a change event.
      input.value = "";
    },
    [reset],
  );

  const run = useCallback(async () => {
    const runId = ++runIdRef.current;
    setBusy(true);
    setError(null);
    setResult(null);
    try {
      const pdf = await import("@/lib/pdf-tools");
      let r: PdfResult;
      if (mode === "merge") r = await pdf.mergePdfFiles(files);
      else if (mode === "split") r = await pdf.splitPdfFile(files[0], splitRange);
      else r = await pdf.optimizePdfFile(files[0]);
      if (runId !== runIdRef.current) return;
      setResult({ ...r, mode, inputBytes: files.reduce((s, f) => s + f.size, 0) });
    } catch (e) {
      if (runId !== runIdRef.current) return;
      // Only show messages written for users; anything else is an unexpected failure.
      setError(
        e instanceof Error && e.name === "PdfToolError"
          ? e.message
          : "Something went wrong while processing this PDF. Please try a different file.",
      );
    } finally {
      if (runId === runIdRef.current) setBusy(false);
    }
  }, [files, mode, splitRange]);

  const download = useCallback((blob: Blob, fileName: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 3000);
  }, []);

  const needFiles = mode === "merge" ? 2 : 1;
  const ready = mode === "merge" ? files.length >= 2 : files.length === 1;
  const outputBytes = result?.outputs.reduce((s, o) => s + o.blob.size, 0) ?? 0;

  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-3" role="group" aria-label="PDF action">
        {MODES.map((m) => (
          <button
            key={m.value}
            type="button"
            aria-pressed={mode === m.value}
            onClick={() => {
              reset();
              setBusy(false);
              setMode(m.value);
              setFiles([]);
              if (inputRef.current) inputRef.current.value = "";
            }}
            className={
              "rounded-lg border px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 " +
              (mode === m.value
                ? "border-blue-600 bg-blue-50 text-blue-700 dark:border-blue-400 dark:bg-blue-950/50 dark:text-blue-200"
                : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700")
            }
          >
            {m.label}
          </button>
        ))}
      </div>

      <div className="rounded-xl border border-dashed border-slate-300 p-6 text-center dark:border-slate-600">
        <p className="text-sm text-slate-600 dark:text-slate-300">{current.hint}</p>
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,application/pdf"
          multiple={mode === "merge"}
          className="hidden"
          aria-label="Choose PDF file"
          onChange={(e) => onFiles(e.target)}
        />
        <Button type="button" variant="secondary" className="mt-4" onClick={() => inputRef.current?.click()}>
          {mode === "merge" ? "Choose PDFs" : "Choose PDF"}
        </Button>
        {files.length > 0 ? (
          <ol className="mx-auto mt-4 max-w-md space-y-1 text-left text-xs text-slate-500 dark:text-slate-400">
            {files.map((f, i) => (
              <li key={`${f.name}-${i}`}>
                {mode === "merge" ? `${i + 1}. ` : ""}
                {f.name} — {formatBytes(f.size)}
              </li>
            ))}
          </ol>
        ) : null}
        {mode === "merge" && files.length === 1 ? (
          <p className="mt-2 text-xs text-amber-700 dark:text-amber-400">
            Choose at least {needFiles} PDFs (select them together in the file picker).
          </p>
        ) : null}
      </div>

      {mode === "split" ? (
        <Field label="Pages to extract" htmlFor="split-range" hint="For example 1-3, 5, 8-10 — or type all.">
          <Input
            id="split-range"
            value={splitRange}
            onChange={(e) => {
              reset();
              setSplitRange(e.target.value);
            }}
            placeholder="1-3, 5, 8-10"
          />
        </Field>
      ) : null}

      {error ? (
        <p role="alert" className="text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      ) : null}

      <Button type="button" onClick={run} disabled={busy || !ready}>
        {busy ? "Processing…" : current.action}
      </Button>

      {result ? (
        <div className="space-y-4 rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/60">
          <p role="status" className="text-sm text-slate-700 dark:text-slate-200">
            {result.mode === "merge" ? (
              <>Merged {files.length} files into one {result.outputs[0].pageCount}-page PDF.</>
            ) : result.mode === "split" ? (
              <>Extracted {result.outputs.length} page{result.outputs.length === 1 ? "" : "s"}, one PDF each.</>
            ) : outputBytes < result.inputBytes * 0.99 ? (
              <>
                Optimized: <strong className="text-green-700 dark:text-green-400">{reductionPercent(result.inputBytes, outputBytes)}% smaller</strong>{" "}
                ({formatBytes(result.inputBytes)} → {formatBytes(outputBytes)}).
              </>
            ) : (
              <>
                This PDF couldn&apos;t be made noticeably smaller ({formatBytes(result.inputBytes)} →{" "}
                {formatBytes(outputBytes)}). It&apos;s probably scanned pages or already compact, so keep
                the original.
              </>
            )}
          </p>

          {result.warnings.length > 0 ? (
            <ul className="space-y-1 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-200">
              {result.warnings.map((w) => (
                <li key={w}>⚠ {w}</li>
              ))}
            </ul>
          ) : null}

          <ul className="max-h-80 space-y-2 overflow-auto">
            {result.outputs.map((o) => (
              <li
                key={o.fileName}
                className="flex items-center justify-between gap-3 rounded-lg bg-white p-3 dark:bg-slate-900"
              >
                <span className="min-w-0 break-all text-sm text-slate-700 dark:text-slate-200">
                  {o.fileName}{" "}
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    ({o.pageCount} page{o.pageCount === 1 ? "" : "s"}, {formatBytes(o.blob.size)})
                  </span>
                </span>
                <Button type="button" size="sm" variant="secondary" onClick={() => download(o.blob, o.fileName)}>
                  Download
                </Button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
