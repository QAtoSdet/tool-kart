"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Field, Input } from "@/components/ui/Input";
import {
  BYTES_PER_KB,
  MIN_BYTES_PER_KB,
  compressToTargetSize,
  targetFileName,
  type TargetSizeResult,
} from "@/lib/image-compression";
import { fill } from "@/lib/i18n";

/** Common limits on Indian exam, job and government forms. */
const PRESETS = [20, 50, 100, 200, 500];

/**
 * Size in the same 1000-byte KB as the target. Rounds DOWN (one decimal under 100 KB) so a file
 * just under the limit reads "49.5 KB", never "50 KB" — which would look like it's at the limit.
 */
export function formatKb(bytes: number): string {
  const v = bytes / BYTES_PER_KB;
  return v < 100 ? `${Math.floor(v * 10) / 10} KB` : `${Math.floor(v)} KB`;
}
const kb = formatKb;

/** Every visible string, so the Hindi page can reuse the widget. Templates use {placeholders}. */
export interface ImageToKbLabels {
  errNotImage: string;
  /** {kb} */
  errTooBig: string;
  errGeneric: string;
  dropPrompt: string;
  choose: string;
  maxSize: string;
  customSize: string;
  errRange: string;
  maxWidth: string;
  maxWidthHint: string;
  maxWidthPlaceholder: string;
  working: string;
  /** {kb} */
  makeUnder: string;
  resultAlt: string;
  /** "⚠ This file is" + <strong>size</strong> + belowMinAfter */
  belowMinBefore: string;
  /** {min} */
  belowMinAfter: string;
  done: string;
  /** {min}, {max} */
  allowed: string;
  /** {max} */
  limit: string;
  /** {w}, {h}, {q} */
  dims: string;
  /** {size} */
  original: string;
  alreadyUnder: string;
  download: string;
  footnote: string;
}

export const ENGLISH_IMAGE_TO_KB_LABELS: ImageToKbLabels = {
  errNotImage: "Please choose an image file (JPG, PNG or WebP).",
  errTooBig: "Couldn't get this image under {kb} KB without making it too small. Try a larger size limit.",
  errGeneric: "Something went wrong. Try a different image.",
  dropPrompt: "Drag & drop a photo here, or",
  choose: "Choose image",
  maxSize: "Maximum file size",
  customSize: "Custom size in KB",
  errRange: "Enter a size between 5 and 5000 KB.",
  maxWidth: "Max width in pixels (optional)",
  maxWidthHint: "Only if your form also limits the pixel size.",
  maxWidthPlaceholder: "e.g. 600",
  working: "Working…",
  makeUnder: "Make it under {kb} KB",
  resultAlt: "Resized result",
  belowMinBefore: "⚠ This file is",
  belowMinAfter:
    ", below the {min} KB minimum, so the portal may reject it. The image is too small to reach it: use a larger photo or scan at a higher resolution (at least 200 dpi), then try again.",
  done: "Done:",
  allowed: "(allowed {min}–{max} KB)",
  limit: "(limit {max} KB)",
  dims: "{w} × {h} px · JPG quality {q}%",
  original: "Original: {size}",
  alreadyUnder: " — it was already under the limit.",
  download: "Download JPG",
  footnote:
    "The result is always a JPG, the format almost every form accepts. Sizes use 1 KB = 1,000 bytes, so the file fits even portals that count 1 KB as 1,024 bytes.",
};

export function ImageToKb({
  defaultKb = 50,
  minKb = 0,
  presets = PRESETS,
  labels: t = ENGLISH_IMAGE_TO_KB_LABELS,
}: {
  defaultKb?: number;
  /** Lower size limit some portals enforce (e.g. 10–20 KB). 0 = none. */
  minKb?: number;
  /** Size buttons to show; pass [] to show only the custom box. */
  presets?: number[];
  labels?: ImageToKbLabels;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [targetKb, setTargetKb] = useState(String(defaultKb));
  const [maxWidth, setMaxWidth] = useState("");
  const [result, setResult] = useState<(TargetSizeResult & { url: string; forKb: number }) | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  // Bumped on every new file so a slow run for the previous file can't show its result.
  const runIdRef = useRef(0);

  useEffect(() => () => void (result && URL.revokeObjectURL(result.url)), [result]);

  const onSelectFile = useCallback((f: File | undefined) => {
    runIdRef.current++;
    setError(null);
    setResult(null);
    if (!f) return;
    if (!f.type.startsWith("image/")) {
      setError(t.errNotImage);
      return;
    }
    setFile(f);
  }, [t]);

  const target = Number(targetKb);
  const targetValid = Number.isFinite(target) && target >= 5 && target <= 5000;

  const run = useCallback(async () => {
    if (!file || !targetValid) return;
    const runId = ++runIdRef.current;
    setBusy(true);
    setError(null);
    setResult(null);
    try {
      const mw = Number(maxWidth);
      const res = await compressToTargetSize(file, target, maxWidth.trim() && mw > 0 ? mw : undefined, minKb);
      if (runId !== runIdRef.current) return; // a different file was chosen meanwhile
      if (!res) {
        setError(fill(t.errTooBig, { kb: target }));
        return;
      }
      setResult({ ...res, url: URL.createObjectURL(res.blob), forKb: target });
    } catch {
      if (runId !== runIdRef.current) return;
      // Browser decode errors are technical and English-only; show our own message instead.
      setError(t.errGeneric);
    } finally {
      setBusy(false);
    }
  }, [file, target, targetValid, maxWidth, minKb, t]);

  const belowMin = !!result && minKb > 0 && result.blob.size < minKb * MIN_BYTES_PER_KB;

  const download = useCallback(() => {
    if (!result || !file) return;
    const a = document.createElement("a");
    a.href = result.url;
    a.download = targetFileName(file.name, result.forKb);
    document.body.appendChild(a);
    a.click();
    a.remove();
  }, [result, file]);

  return (
    <div className="space-y-6">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          onSelectFile(e.dataTransfer.files?.[0]);
        }}
        className={
          "flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 text-center transition-colors " +
          (dragOver ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30" : "border-slate-300 dark:border-slate-600")
        }
      >
        <p className="text-sm text-slate-600 dark:text-slate-300">{t.dropPrompt}</p>
        <Button type="button" variant="secondary" className="mt-3" onClick={() => inputRef.current?.click()}>
          {t.choose}
        </Button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          aria-label={t.choose}
          onChange={(e) => onSelectFile(e.target.files?.[0])}
        />
        {file ? (
          <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
            {file.name} — {kb(file.size)}
          </p>
        ) : null}
      </div>

      <fieldset>
        <legend className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-200">
          {t.maxSize}
        </legend>
        <div className="flex flex-wrap items-center gap-2">
          {presets.map((p) => (
            <button
              key={p}
              type="button"
              aria-pressed={String(p) === targetKb}
              onClick={() => setTargetKb(String(p))}
              className={
                "rounded-full border px-3 py-1.5 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 " +
                (String(p) === targetKb
                  ? "border-blue-600 bg-blue-600 text-white"
                  : "border-slate-300 text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800")
              }
            >
              {p} KB
            </button>
          ))}
          <label htmlFor="target-kb" className="sr-only">
            {t.customSize}
          </label>
          <div className="flex items-center gap-1.5">
            <Input
              id="target-kb"
              type="number"
              min={5}
              max={5000}
              inputMode="numeric"
              className="w-24"
              value={targetKb}
              onChange={(e) => setTargetKb(e.target.value)}
            />
            <span className="text-sm text-slate-500 dark:text-slate-400">KB</span>
          </div>
        </div>
        {!targetValid && targetKb !== "" ? (
          <p role="alert" className="mt-2 text-sm text-red-600 dark:text-red-400">
            {t.errRange}
          </p>
        ) : null}
      </fieldset>

      <Field label={t.maxWidth} htmlFor="kb-max-width" hint={t.maxWidthHint}>
        <Input
          id="kb-max-width"
          type="number"
          min={1}
          inputMode="numeric"
          placeholder={t.maxWidthPlaceholder}
          className="sm:w-48"
          value={maxWidth}
          onChange={(e) => setMaxWidth(e.target.value)}
        />
      </Field>

      {file ? (
        <Button type="button" onClick={run} disabled={busy || !targetValid}>
          {busy ? t.working : fill(t.makeUnder, { kb: targetValid ? target : "…" })}
        </Button>
      ) : null}

      {error ? (
        <p role="alert" className="text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      ) : null}

      {result && file ? (
        <div className="grid gap-4 rounded-lg bg-slate-50 p-4 sm:grid-cols-[auto_1fr] dark:bg-slate-800/60">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={result.url}
            alt={t.resultAlt}
            className="mx-auto max-h-56 w-auto rounded border border-slate-200 bg-white dark:border-slate-700"
          />
          <div className="space-y-2 text-sm text-slate-700 dark:text-slate-200">
            {belowMin ? (
              <p role="status" className="rounded-md border border-amber-200 bg-amber-50 p-2 text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-200">
                {t.belowMinBefore} <strong>{kb(result.blob.size)}</strong>
                {fill(t.belowMinAfter, { min: minKb })}
              </p>
            ) : (
              <p role="status" className="text-base">
                {t.done} <strong className="text-green-700 dark:text-green-400">{kb(result.blob.size)}</strong>{" "}
                {minKb > 0 ? fill(t.allowed, { min: minKb, max: result.forKb }) : fill(t.limit, { max: result.forKb })}
              </p>
            )}
            <p>{fill(t.dims, { w: result.width, h: result.height, q: Math.round(result.quality * 100) })}</p>
            <p className="text-slate-500 dark:text-slate-400">
              {fill(t.original, { size: kb(file.size) })}
              {file.size <= result.forKb * BYTES_PER_KB ? t.alreadyUnder : ""}
            </p>
            <Button type="button" onClick={download}>
              {t.download}
            </Button>
          </div>
        </div>
      ) : null}

      <p className="text-xs text-slate-500 dark:text-slate-400">
        {t.footnote}
      </p>
    </div>
  );
}
