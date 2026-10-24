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
