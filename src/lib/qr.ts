/**
 * QR code helpers.
 *
 * Pure, testable utilities for QR options and filenames. The actual rendering
 * uses the `qrcode` library in the browser (data URL for PNG, SVG string),
 * so nothing is sent to a server.
 */

export type ErrorCorrectionLevel = "L" | "M" | "Q" | "H";

export const ERROR_LEVELS: { value: ErrorCorrectionLevel; label: string }[] = [
  { value: "L", label: "Low (~7%)" },
  { value: "M", label: "Medium (~15%)" },
  { value: "Q", label: "Quartile (~25%)" },
  { value: "H", label: "High (~30%)" },
];

export const MAX_QR_INPUT_LENGTH = 2000;

export interface QrOptions {
  /** Pixel size of the PNG (width = height). */
  size: number;
  /** Quiet-zone margin in modules. */
  margin: number;
  /** Foreground (dark) colour, hex. */
  dark: string;
  /** Background (light) colour, hex. */
  light: string;
  errorCorrectionLevel: ErrorCorrectionLevel;
}

export const DEFAULT_QR_OPTIONS: QrOptions = {
  size: 320,
  margin: 2,
  dark: "#000000",
  light: "#ffffff",
  errorCorrectionLevel: "M",
};

/** Whether the input is valid to generate a QR (non-empty, within length). */
export function isValidQrInput(text: string): boolean {
  const trimmed = text.trim();
  return trimmed.length > 0 && trimmed.length <= MAX_QR_INPUT_LENGTH;
}

/** Clamp size to a sensible range. */
export function clampSize(size: number): number {
  if (Number.isNaN(size)) return DEFAULT_QR_OPTIONS.size;
  return Math.min(1024, Math.max(64, Math.round(size)));
}

/** Build a safe download filename for the QR image. */
export function qrFileName(ext: "png" | "svg"): string {
  return `qr-code.${ext}`;
}
