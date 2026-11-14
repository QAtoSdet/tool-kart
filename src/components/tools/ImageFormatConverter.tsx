"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Input";
import {
  compressImage,
  convertedFileName,
  CONVERT_QUALITY,
  defaultConversionTarget,
  detectImageFormat,
  formatBytes,
  isHeicFile,
  OUTPUT_FORMAT_LABELS,
  reductionPercent,
  type OutputFormat,
} from "@/lib/image-compression";

interface ConversionResult {
  url: string;
  blob: Blob;
  width: number;
  height: number;
  /** Format the result was encoded in (the selector may have changed since). */
  format: OutputFormat;
}

const FORMATS: OutputFormat[] = ["image/jpeg", "image/png", "image/webp"];

export function ImageFormatConverter() {
  const [file, setFile] = useState<File | null>(null);
  const [inputFormat, setInputFormat] = useState<OutputFormat | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [format, setFormat] = useState<OutputFormat>("image/jpeg");
  const [result, setResult] = useState<ConversionResult | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  // Bumped whenever the file or target format changes, so a conversion that finishes late
  // for an earlier file/format is discarded instead of shown under the new one.
  const runIdRef = useRef(0);

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

  const onSelectFile = useCallback((selected: File | undefined) => {
    runIdRef.current++;
    setError(null);
    setResult(null);
    if (!selected) return;
    const detected = detectImageFormat(selected);
    if (!detected) {
      setFile(null);
      setInputFormat(null);
      setOriginalUrl(null);
      setError(
        isHeicFile(selected)
          ? "HEIC/HEIF files are not supported. Please convert the image to JPG, PNG or WebP first."
          : "Please choose a JPG, PNG or WebP image.",
      );
      return;
    }

    setFile(selected);
    setInputFormat(detected);
    // Don't default to re-saving in the same format; keep the user's choice otherwise.
    setFormat((current) => (current === detected ? defaultConversionTarget(detected) : current));
    setOriginalUrl(URL.createObjectURL(selected));
  }, []);

  const convert = useCallback(async () => {
    if (!file) return;
    const runId = ++runIdRef.current;
    setBusy(true);
    setError(null);
    try {
      const converted = await compressImage(file, { format, quality: CONVERT_QUALITY });
      if (runId !== runIdRef.current) return; // file or format changed meanwhile
      setResult({
        url: URL.createObjectURL(converted.blob),
        blob: converted.blob,
        width: converted.width,
        height: converted.height,
        format,
      });
    } catch (e) {
      if (runId !== runIdRef.current) return;
      setError(e instanceof Error ? e.message : "Conversion failed. Try a different image.");
    } finally {
      setBusy(false);
    }
  }, [file, format]);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      setDragOver(false);
      onSelectFile(event.dataTransfer.files?.[0]);
    },
    [onSelectFile],
  );

  const download = useCallback(() => {
    if (!result || !file) return;
    const anchor = document.createElement("a");
    anchor.href = result.url;
    anchor.download = convertedFileName(file.name, result.format);
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
  }, [file, result]);

  return (
    <div className="space-y-6">
      <div
        onDragOver={(event) => {
          event.preventDefault();
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
          Drag &amp; drop a JPG, PNG or WebP image here, or
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
          accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
          className="hidden"
          aria-label="Choose image"
          onChange={(event) => onSelectFile(event.target.files?.[0])}
        />
        {file ? (
          <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
            {file.name} — {formatBytes(file.size)}
          </p>
        ) : null}
      </div>

      {error ? (
        <p role="alert" className="text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      ) : null}

      {file ? (
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-end">
          <label htmlFor="image-output-format" className="flex w-full max-w-xs flex-col gap-1.5">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
              Convert to
            </span>
            <Select
              id="image-output-format"
              value={format}
              onChange={(event) => {
                const selectedFormat = FORMATS.find((candidate) => candidate === event.target.value);
                if (selectedFormat) {
                  runIdRef.current++;
                  setFormat(selectedFormat);
                  setResult(null);
                }
              }}
            >
              {FORMATS.map((outputFormat) => (
                <option key={outputFormat} value={outputFormat}>
                  {OUTPUT_FORMAT_LABELS[outputFormat]}
                  {outputFormat === inputFormat ? " (same as original)" : ""}
                </option>
              ))}
            </Select>
          </label>
          <Button type="button" onClick={convert} disabled={busy}>
            {busy ? "Converting…" : "Convert image"}
          </Button>
        </div>
      ) : null}

      {originalUrl && result ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <figure className="rounded-lg border border-slate-200 p-3 dark:border-slate-700">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={originalUrl} alt="Original" className="mx-auto max-h-64 w-auto" />
            <figcaption className="mt-2 text-center text-xs text-slate-500 dark:text-slate-400">
              Original — {formatBytes(file?.size ?? 0)}
            </figcaption>
          </figure>
          <figure className="rounded-lg border border-slate-200 p-3 dark:border-slate-700">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={result.url} alt={`Converted to ${OUTPUT_FORMAT_LABELS[result.format]}`} className="mx-auto max-h-64 w-auto" />
            <figcaption className="mt-2 text-center text-xs text-slate-500 dark:text-slate-400">
              {OUTPUT_FORMAT_LABELS[result.format]} — {formatBytes(result.blob.size)} ({result.width}×
              {result.height})
            </figcaption>
          </figure>
        </div>
      ) : null}

      {result && file ? (
        <div className="flex flex-col items-start gap-3 rounded-lg bg-slate-50 p-4 dark:bg-slate-800/60">
          <p className="text-sm text-slate-700 dark:text-slate-200">
            Converted to {OUTPUT_FORMAT_LABELS[result.format]} without changing the image dimensions.
          </p>
          <p role="status" className="text-sm text-slate-700 dark:text-slate-200">
            {Math.abs(result.blob.size - file.size) <= file.size * 0.01 ? (
              <>The new file is about the same size as the original ({formatBytes(result.blob.size)}).</>
            ) : result.blob.size < file.size ? (
              <>
                The new file is{" "}
                <strong className="text-green-700 dark:text-green-400">
                  {reductionPercent(file.size, result.blob.size)}% smaller
                </strong>{" "}
                ({formatBytes(file.size)} → {formatBytes(result.blob.size)}).
              </>
            ) : (
              <>
                The new file is larger than the original ({formatBytes(file.size)} →{" "}
                {formatBytes(result.blob.size)}). That&apos;s normal for some conversions, such as a
                screenshot to JPG or a photo to PNG. To make it smaller, try WebP or the{" "}
                <a href="/tools/image-compressor" className="text-blue-600 underline">
                  image compressor
                </a>
                .
              </>
            )}
          </p>
          <Button type="button" onClick={download}>
            Download converted image
          </Button>
        </div>
      ) : null}
    </div>
  );
}
