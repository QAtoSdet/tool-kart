/**
 * Image compression helpers.
 *
 * The dimension math is pure and unit-tested. The actual pixel encoding uses the
 * browser Canvas API and runs only on the client — images are never uploaded.
 */

export interface Dimensions {
  width: number;
  height: number;
}

/**
 * Scale dimensions to fit within a max width/height while preserving aspect ratio.
 * If neither max is given (or the image already fits), the original size is kept.
 * Never upscales.
 */
export function fitWithin(
  original: Dimensions,
  maxWidth?: number,
  maxHeight?: number,
): Dimensions {
  const { width, height } = original;
  if (width <= 0 || height <= 0) return { width: 0, height: 0 };

  let scale = 1;
  if (maxWidth && maxWidth > 0) scale = Math.min(scale, maxWidth / width);
  if (maxHeight && maxHeight > 0) scale = Math.min(scale, maxHeight / height);

  // Never upscale.
  scale = Math.min(scale, 1);

  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale)),
  };
}

/** Human-readable byte size, e.g. 1536 -> "1.5 KB". */
export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(kb < 10 ? 1 : 0)} KB`;
  const mb = kb / 1024;
  return `${mb.toFixed(mb < 10 ? 2 : 1)} MB`;
}

/** Percentage reduction from original to compressed (0 if not smaller). */
export function reductionPercent(originalBytes: number, newBytes: number): number {
  if (originalBytes <= 0) return 0;
  const pct = ((originalBytes - newBytes) / originalBytes) * 100;
  return Math.max(0, Math.round(pct));
}

export type OutputFormat = "image/jpeg" | "image/png" | "image/webp";

export const OUTPUT_FORMAT_LABELS: Record<OutputFormat, string> = {
  "image/jpeg": "JPG",
  "image/png": "PNG",
  "image/webp": "WebP",
};

/** Map a filename + target format to an output filename. */
export function outputFileName(inputName: string, format: OutputFormat): string {
  const base = inputName.replace(/\.[^.]+$/, "") || "image";
  const ext = format === "image/jpeg" ? "jpg" : format === "image/png" ? "png" : "webp";
  return `${base}-compressed.${ext}`;
}

/** Map an input filename to a converted output filename. */
export function convertedFileName(inputName: string, format: OutputFormat): string {
  const base = inputName.replace(/\.[^.]+$/, "") || "image";
  const ext = format === "image/jpeg" ? "jpg" : format === "image/png" ? "png" : "webp";
  return `${base}-converted.${ext}`;
}

/**
 * Quality for lossy output in the format converter. Visually indistinguishable from 1.0 for
 * photos, but in a real-browser test 1.0 made files 2–3× larger (and often larger than the input).
 */
export const CONVERT_QUALITY = 0.92;

// Non-standard but real MIME types some phones, apps and OSes report.
const MIME_FORMATS: Record<string, OutputFormat> = {
  "image/jpeg": "image/jpeg",
  "image/jpg": "image/jpeg",
  "image/pjpeg": "image/jpeg",
  "image/png": "image/png",
  "image/x-png": "image/png",
  "image/webp": "image/webp",
};
const EXTENSION_FORMATS: Record<string, OutputFormat> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  jfif: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
};
/** MIME types that carry no real information, so the extension decides. */
const GENERIC_MIME = new Set(["", "application/octet-stream"]);

/**
 * Work out whether a file is a JPG, PNG or WebP the converter can handle. Trusts a known MIME
 * type; falls back to the extension only when the MIME type is missing or generic. Anything else
 * (HEIC, GIF, PDF…) returns null.
 */
export function detectImageFormat(file: { name: string; type: string }): OutputFormat | null {
  const type = file.type.toLowerCase();
  if (MIME_FORMATS[type]) return MIME_FORMATS[type];
  if (!GENERIC_MIME.has(type)) return null;
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  return file.name.includes(".") ? (EXTENSION_FORMATS[ext] ?? null) : null;
}

export function isHeicFile(file: { name: string; type: string }): boolean {
  const type = file.type.toLowerCase();
  const ext = file.name.split(".").pop()?.toLowerCase();
  return type === "image/heic" || type === "image/heif" || ext === "heic" || ext === "heif";
}

/** A sensible output for an input, so the default isn't a pointless same-format re-save. */
export function defaultConversionTarget(input: OutputFormat): OutputFormat {
  return input === "image/jpeg" ? "image/png" : "image/jpeg";
}

export interface CompressOptions {
  maxWidth?: number;
  maxHeight?: number;
  /** 0..1 quality for lossy formats (jpeg/webp). Ignored for png. */
  quality: number;
  format: OutputFormat;
}

export interface CompressResult {
  blob: Blob;
  width: number;
  height: number;
}

/**
 * Compress/resize an image file entirely in the browser via Canvas.
 * Throws if run outside a browser (no document/canvas).
 */
export async function compressImage(
  file: File | Blob,
  options: CompressOptions,
): Promise<CompressResult> {
  if (typeof document === "undefined") {
    throw new Error("compressImage can only run in the browser");
  }

  const bitmap = await loadBitmap(file);
  const target = fitWithin(
    { width: bitmap.width, height: bitmap.height },
    options.maxWidth,
    options.maxHeight,
  );

  const canvas = document.createElement("canvas");
  canvas.width = target.width;
  canvas.height = target.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not get 2D canvas context");

  // White background for formats without alpha (JPEG) so transparency isn't black.
  if (options.format === "image/jpeg") {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, target.width, target.height);
  }
  ctx.drawImage(bitmap as CanvasImageSource, 0, 0, target.width, target.height);

  if (typeof (bitmap as ImageBitmap).close === "function") {
    (bitmap as ImageBitmap).close();
  }

  const blob = await canvasToBlob(canvas, options.format, options.quality);
  return { blob, width: target.width, height: target.height };
}

async function loadBitmap(file: File | Blob): Promise<ImageBitmap | HTMLImageElement> {
  if (typeof createImageBitmap === "function") {
    try {
      return await createImageBitmap(file);
    } catch {
      // Fall through to the <img> approach.
    }
  }
  const url = URL.createObjectURL(file);
  try {
    const img = new Image();
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error("Could not load image"));
      img.src = url;
    });
    return img;
  } finally {
    URL.revokeObjectURL(url);
  }
}

function canvasToBlob(
  canvas: HTMLCanvasElement,
  format: OutputFormat,
  quality: number,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Canvas could not produce an image blob"));
      },
      format,
      format === "image/png" ? undefined : quality,
    );
  });
}

// ---------------------------------------------------------------------------
// Compress to a target file size (e.g. "under 50 KB" for an exam or job form).
// ---------------------------------------------------------------------------

/**
 * Bytes per KB used for targets. Portals differ on 1000 vs 1024; using 1000 means a file that
 * meets the target is under the limit under either definition (50 KB → ≤ 50,000 bytes).
 */
export const BYTES_PER_KB = 1000;
/**
 * For a *minimum* the stricter definition is the larger one: a file that is at least 10 × 1,024
 * bytes passes a 10 KB minimum whichever way the portal counts.
 */
export const MIN_BYTES_PER_KB = 1024;

/** Encodes the image at the given size and JPEG quality. Injected so the search is testable. */
export type Encoder = (dims: Dimensions, quality: number) => Promise<Blob>;

export interface TargetSizeResult {
  blob: Blob;
  width: number;
  height: number;
  /** JPEG quality used, 0..1. */
  quality: number;
}

/** Keep quality at or above this before shrinking dimensions, so text/faces stay legible. */
export const MIN_QUALITY = 0.4;
const MAX_QUALITY = 0.92;
const QUALITY_STEPS = 6;
const MAX_ROUNDS = 8;
/** Don't shrink the longest side below this. */
export const MIN_SIDE = 64;

/**
 * Find the largest/best-looking encoding whose size is ≤ `targetBytes`.
 *
 * Each round, at the current dimensions:
 *  1. If even MIN_QUALITY is too big, shrink the dimensions (file size scales roughly with pixel
 *     count, so scale by √(target/size)) and try again.
 *  2. Otherwise binary-search the highest quality that still fits.
 * Never upscales. Returns null if the target can't be met without going below MIN_SIDE.
 */
export async function searchTargetSize(
  original: Dimensions,
  targetBytes: number,
  encode: Encoder,
  /**
   * Optional lower limit (some exam portals reject files that are too small, e.g. 10–20 KB).
   * Only matters when the image fits easily: then quality is raised to 100% to reach it. If it
   * still falls short the result is returned anyway and the caller warns the user.
   */
  minBytes = 0,
): Promise<TargetSizeResult | null> {
  if (targetBytes <= 0 || original.width <= 0 || original.height <= 0) return null;
  let dims = { ...original };

  for (let round = 0; round < MAX_ROUNDS; round++) {
    const low = await encode(dims, MIN_QUALITY);
    if (low.size <= targetBytes) {
      const top = await encode(dims, MAX_QUALITY);
      if (top.size <= targetBytes) {
        if (top.size < minBytes) {
          const full = await encode(dims, 1);
          if (full.size <= targetBytes && full.size > top.size) return { blob: full, ...dims, quality: 1 };
        }
        return { blob: top, ...dims, quality: MAX_QUALITY };
      }

      let best: TargetSizeResult = { blob: low, ...dims, quality: MIN_QUALITY };
      let lo = MIN_QUALITY;
      let hi = MAX_QUALITY;
      for (let i = 0; i < QUALITY_STEPS; i++) {
        const mid = (lo + hi) / 2;
        const blob = await encode(dims, mid);
        if (blob.size <= targetBytes) {
          best = { blob, ...dims, quality: mid };
          lo = mid;
        } else {
          hi = mid;
        }
      }
      return best;
    }

    // Too big even at minimum quality: shrink, with a 5% safety margin, by at least 10%.
    const factor = Math.min(0.9, Math.sqrt(targetBytes / low.size) * 0.95);
    const next = {
      width: Math.max(1, Math.round(dims.width * factor)),
      height: Math.max(1, Math.round(dims.height * factor)),
    };
    if (Math.max(next.width, next.height) < MIN_SIDE) return null;
    dims = next;
  }
  return null;
}

/**
 * Browser wrapper: compress `file` to a JPEG of at most `targetKb` KB, optionally capping the
 * width first. Runs entirely on the device via Canvas.
 */
export async function compressToTargetSize(
  file: File | Blob,
  targetKb: number,
  maxWidth?: number,
  /** Optional minimum in KB, measured with the stricter 1 KB = 1,024 bytes. */
  minKb = 0,
): Promise<TargetSizeResult | null> {
  if (typeof document === "undefined") {
    throw new Error("compressToTargetSize can only run in the browser");
  }
  const bitmap = await loadBitmap(file);
  try {
    const start = fitWithin({ width: bitmap.width, height: bitmap.height }, maxWidth);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Could not get 2D canvas context");

    const encode: Encoder = (dims, quality) => {
      canvas.width = dims.width;
      canvas.height = dims.height;
      // White background so transparent PNGs don't turn black in JPEG.
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, dims.width, dims.height);
      ctx.drawImage(bitmap as CanvasImageSource, 0, 0, dims.width, dims.height);
      return canvasToBlob(canvas, "image/jpeg", quality);
    };

    return await searchTargetSize(start, targetKb * BYTES_PER_KB, encode, minKb * MIN_BYTES_PER_KB);
  } finally {
    if (typeof (bitmap as ImageBitmap).close === "function") (bitmap as ImageBitmap).close();
  }
}

/** Output filename for a target-size result, e.g. "photo.png" + 50 → "photo-50kb.jpg". */
export function targetFileName(inputName: string, targetKb: number): string {
  const base = inputName.replace(/\.[^.]+$/, "") || "image";
  return `${base}-${targetKb}kb.jpg`;
}
