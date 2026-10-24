"use client";

import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { Button } from "@/components/ui/Button";
import { Field, Input, Select } from "@/components/ui/Input";
import {
  clampSize,
  DEFAULT_QR_OPTIONS,
  ERROR_LEVELS,
  isValidQrInput,
  MAX_QR_INPUT_LENGTH,
  qrFileName,
  type ErrorCorrectionLevel,
  type QrOptions,
} from "@/lib/qr";

export function QrCodeGenerator() {
  const [text, setText] = useState("https://");
  const [options, setOptions] = useState<QrOptions>(DEFAULT_QR_OPTIONS);
  const [pngDataUrl, setPngDataUrl] = useState<string | null>(null);
  const [svgMarkup, setSvgMarkup] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  // Guards against out-of-order async updates when typing fast.
  const runIdRef = useRef(0);

  useEffect(() => {
    const valid = isValidQrInput(text);
    if (!valid) {
      setPngDataUrl(null);
      setSvgMarkup(null);
      setError(
        text.trim().length > MAX_QR_INPUT_LENGTH
          ? `Text is too long (max ${MAX_QR_INPUT_LENGTH} characters).`
          : null,
      );
      return;
    }

    const runId = ++runIdRef.current;
    const common = {
      margin: options.margin,
      color: { dark: options.dark, light: options.light },
      errorCorrectionLevel: options.errorCorrectionLevel,
    } as const;

    Promise.all([
      QRCode.toDataURL(text, { ...common, width: options.size }),
      QRCode.toString(text, { ...common, type: "svg", width: options.size }),
    ])
      .then(([dataUrl, svg]) => {
        // Ignore if a newer run has started.
        if (runId !== runIdRef.current) return;
        setPngDataUrl(dataUrl);
        setSvgMarkup(svg);
        setError(null);
      })
      .catch(() => {
        if (runId !== runIdRef.current) return;
        setError("Could not generate a QR code for this input.");
      });
  }, [text, options]);

  const update = <K extends keyof QrOptions>(key: K, value: QrOptions[K]) =>
    setOptions((o) => ({ ...o, [key]: value }));

  const downloadPng = () => {
    if (!pngDataUrl) return;
    triggerDownload(pngDataUrl, qrFileName("png"));
  };

  const downloadSvg = () => {
    if (!svgMarkup) return;
    const blob = new Blob([svgMarkup], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    triggerDownload(url, qrFileName("svg"));
    URL.revokeObjectURL(url);
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="space-y-4">
        <Field label="Text or URL" htmlFor="qr-text" hint="Links, text, UPI IDs, Wi-Fi details…">
          <textarea
            id="qr-text"
            rows={3}
            value={text}
            maxLength={MAX_QR_INPUT_LENGTH + 1}
            onChange={(e) => setText(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
          />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label={`Size: ${options.size}px`} htmlFor="qr-size">
            <input
              id="qr-size"
              type="range"
              min={64}
              max={1024}
              step={16}
              value={options.size}
              onChange={(e) => update("size", clampSize(Number(e.target.value)))}
              className="w-full accent-blue-600"
            />
          </Field>

          <Field label="Error correction" htmlFor="qr-ec">
            <Select
              id="qr-ec"
              value={options.errorCorrectionLevel}
              onChange={(e) =>
                update("errorCorrectionLevel", e.target.value as ErrorCorrectionLevel)
              }
            >
              {ERROR_LEVELS.map((lvl) => (
                <option key={lvl.value} value={lvl.value}>
                  {lvl.label}
                </option>
              ))}
            </Select>
          </Field>

          <Field label="Foreground" htmlFor="qr-dark">
            <Input
              id="qr-dark"
              type="color"
              value={options.dark}
              onChange={(e) => update("dark", e.target.value)}
              className="h-10 p-1"
            />
          </Field>

          <Field label="Background" htmlFor="qr-light">
            <Input
              id="qr-light"
              type="color"
              value={options.light}
              onChange={(e) => update("light", e.target.value)}
              className="h-10 p-1"
            />
          </Field>
        </div>
      </div>

      {/* Preview + downloads */}
      <div className="flex flex-col items-center justify-center gap-4">
        {error ? (
          <p role="alert" className="text-sm text-red-600 dark:text-red-400">
            {error}
          </p>
        ) : null}

        {pngDataUrl ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={pngDataUrl}
              alt="Generated QR code"
              className="h-auto w-full max-w-[280px] rounded-lg border border-slate-200 bg-white p-2 dark:border-slate-700"
            />
            <div className="flex gap-3">
              <Button type="button" onClick={downloadPng}>
                Download PNG
              </Button>
              <Button type="button" variant="secondary" onClick={downloadSvg}>
                Download SVG
              </Button>
            </div>
          </>
        ) : (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Enter some text or a URL to generate a QR code.
          </p>
        )}
      </div>
    </div>
  );
}

function triggerDownload(href: string, filename: string) {
  const a = document.createElement("a");
  a.href = href;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
}
