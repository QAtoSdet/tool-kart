"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Field, Input, Select } from "@/components/ui/Input";
import {
  compressImage,
  formatBytes,
  outputFileName,
  reductionPercent,
  OUTPUT_FORMAT_LABELS,
  type OutputFormat,
} from "@/lib/image-compression";

interface ResultState {
  url: string;
  blob: Blob;
  width: number;
  height: number;
}

const FORMATS: OutputFormat[] = ["image/jpeg", "image/webp", "image/png"];

export function ImageCompressor() {
  const [file, setFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [originalDims, setOriginalDims] = useState<{ width: number; height: number } | null>(null);
  const [format, setFormat] = useState<OutputFormat>("image/jpeg");
  const [quality, setQuality] = useState(0.7);
  const [maxWidth, setMaxWidth] = useState<string>("");
  const [result, setResult] = useState<ResultState | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Revoke object URLs when they change/unmount to avoid memory leaks.
  useEffect(() => {
    return () => {
      if (originalUrl) URL.revokeObjectURL(originalUrl);
    };
  }, [originalUrl]);
  useEffect(() => {
    return () => {
      if (result) URL.revokeObjectURL(result.url);
    };
  }, [result]);

  const onSelectFile = useCallback((f: File | undefined) => {
    setError(null);
    setResult(null);
    if (!f) return;
    if (!f.type.startsWith("image/")) {
      setError("Please choose an image file (JPG, PNG or WebP).");
      return;
    }
    setFile(f);
    const url = URL.createObjectURL(f);
    setOriginalUrl(url);
    const img = new Image();
    img.onload = () => setOriginalDims({ width: img.naturalWidth, height: img.naturalHeight });
    img.src = url;
  }, []);

  const runCompression = useCallback(async () => {
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      const parsedMax = maxWidth.trim() ? Number(maxWidth) : undefined;
      const res = await compressImage(file, {
        quality,
        format,
        maxWidth: parsedMax && parsedMax > 0 ? parsedMax : undefined,
      });
      const url = URL.createObjectURL(res.blob);
      setResult({ url, blob: res.blob, width: res.width, height: res.height });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Compression failed. Try a different image.");
    } finally {
      setBusy(false);
    }
  }, [file, quality, format, maxWidth]);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      onSelectFile(e.dataTransfer.files?.[0]);
    },
    [onSelectFile],
  );

  const download = useCallback(() => {
    if (!result || !file) return;
    const a = document.createElement("a");
    a.href = result.url;
    a.download = outputFileName(file.name, format);
    document.body.appendChild(a);
    a.click();
    a.remove();
  }, [result, file, format]);

  const isLossy = format !== "image/png";

  return (
    <div className="space-y-6">
      {/* Drop zone / file picker */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        className={
          "flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 text-center transition-colors " +
          (dragOver
            ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30"
            : "border-slate-300 dark:border-slate-600")
        }
      >
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Drag &amp; drop an image here, or
        </p>
        <Button
          type="button"
          variant="secondary"
          className="mt-3"
          onClick={() => inputRef.current?.click()}
        >
          Choose image
        </Button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          aria-label="Choose image"
          onChange={(e) => onSelectFile(e.target.files?.[0])}
        />
        {file ? (
          <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
            {file.name} — {formatBytes(file.size)}
            {originalDims ? ` (${originalDims.width}×${originalDims.height})` : ""}
          </p>
        ) : null}
      </div>

      {error ? (
        <p role="alert" className="text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      ) : null}

      {file ? (
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Output format" htmlFor="format">
            <Select
              id="format"
              value={format}
              onChange={(e) => setFormat(e.target.value as OutputFormat)}
            >
              {FORMATS.map((f) => (
                <option key={f} value={f}>
                  {OUTPUT_FORMAT_LABELS[f]}
                </option>
              ))}
            </Select>
          </Field>

          <Field
            label={`Quality: ${Math.round(quality * 100)}%`}
            htmlFor="quality"
            hint={isLossy ? undefined : "PNG is lossless; quality is ignored."}
          >
            <input
              id="quality"
              type="range"
              min={0.1}
              max={1}
              step={0.05}
              value={quality}
              disabled={!isLossy}
              onChange={(e) => setQuality(Number(e.target.value))}
              className="w-full accent-blue-600 disabled:opacity-40"
            />
          </Field>

          <Field label="Max width (px)" htmlFor="maxWidth" hint="Leave blank to keep original.">
            <Input
              id="maxWidth"
              type="number"
              min={1}
              inputMode="numeric"
              placeholder="e.g. 1280"
              value={maxWidth}
              onChange={(e) => setMaxWidth(e.target.value)}
            />
          </Field>
        </div>
      ) : null}

      {file ? (
        <Button type="button" onClick={runCompression} disabled={busy}>
          {busy ? "Compressing…" : "Compress image"}
        </Button>
      ) : null}

      {/* Before / after preview */}
      {originalUrl && result ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <figure className="rounded-lg border border-slate-200 p-3 dark:border-slate-700">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={originalUrl} alt="Original" className="mx-auto max-h-64 w-auto" />
            <figcaption className="mt-2 text-center text-xs text-slate-500 dark:text-slate-400">
              Original — {file ? formatBytes(file.size) : ""}
            </figcaption>
          </figure>
          <figure className="rounded-lg border border-slate-200 p-3 dark:border-slate-700">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={result.url} alt="Compressed" className="mx-auto max-h-64 w-auto" />
            <figcaption className="mt-2 text-center text-xs text-slate-500 dark:text-slate-400">
              Compressed — {formatBytes(result.blob.size)} ({result.width}×{result.height})
            </figcaption>
          </figure>
        </div>
      ) : null}

      {result && file ? (
        <div className="flex flex-col items-start gap-3 rounded-lg bg-slate-50 p-4 dark:bg-slate-800/60">
          <p className="text-sm text-slate-700 dark:text-slate-200">
            {result.blob.size < file.size ? (
              <>
                Reduced by{" "}
                <span className="font-semibold text-green-600 dark:text-green-400">
                  {reductionPercent(file.size, result.blob.size)}%
                </span>{" "}
                — from {formatBytes(file.size)} to {formatBytes(result.blob.size)}.
              </>
            ) : (
              <>
                The output ({formatBytes(result.blob.size)}) isn&apos;t smaller. Try lower quality,
                a smaller max width, or a different format.
              </>
            )}
          </p>
          <Button type="button" onClick={download}>
            Download
          </Button>
        </div>
      ) : null}
    </div>
  );
}
