/**
 * Browser-side PDF merge / split / optimize, built on pdf-lib.
 *
 * This module is loaded on demand (dynamic import) by the PDF tool, so pdf-lib isn't part of the
 * page's first-load JavaScript.
 *
 * Known pdf-lib limits, surfaced to users as warnings rather than silent loss:
 * - Copying pages into a new document (merge, split) doesn't carry fillable form fields across.
 * - Any rewrite of a PDF invalidates a digital signature.
 * - Optimizing re-saves the structure; it does not recompress images, so scans barely shrink.
 */
import { PDFArray, PDFDict, PDFDocument, PDFName } from "pdf-lib";

export type PdfMode = "merge" | "split" | "optimize";

export interface PdfOutput {
  fileName: string;
  blob: Blob;
  pageCount: number;
}

export interface PdfResult {
  outputs: PdfOutput[];
  /** Plain-language notes about things the output can't keep (forms, signatures). */
  warnings: string[];
}

/** Errors with messages written for users. Anything else is an unexpected bug. */
export class PdfToolError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PdfToolError";
  }
}

export function toPdfFileName(inputName: string, suffix: string): string {
  const base = inputName.replace(/\.pdf$/i, "") || "document";
  return `${base}-${suffix}.pdf`;
}

/**
 * Parse "1-3, 5, 8-10" (or "all") into sorted, unique 1-based page numbers, validated against the
 * document's page count *before* expanding ranges — so a typo like "1-1000000000" fails instantly
 * instead of freezing the tab.
 */
export function parsePageRanges(input: string, totalPages: number): number[] {
  const raw = input.trim().toLowerCase();
  if (!raw) throw new PdfToolError("Enter the pages you want, such as 1-3, 5 — or type all.");
  if (raw === "all") return Array.from({ length: totalPages }, (_, i) => i + 1);

  const pages = new Set<number>();
  for (const segment of raw.split(",")) {
    const part = segment.trim();
    if (!part) continue;
    const match = /^(\d+)(?:\s*-\s*(\d+))?$/.exec(part);
    if (!match) {
      throw new PdfToolError(`"${part}" isn't a page or range. Use whole numbers like 1-3, 5 or 8-10.`);
    }
    const a = Number(match[1]);
    const b = match[2] === undefined ? a : Number(match[2]);
    if (a < 1 || b < 1) throw new PdfToolError("Page numbers start at 1.");
    const lo = Math.min(a, b);
    const hi = Math.max(a, b);
    if (hi > totalPages) {
      throw new PdfToolError(
        `This PDF has ${totalPages} page${totalPages === 1 ? "" : "s"}, so page ${hi} doesn't exist.`,
      );
    }
    for (let p = lo; p <= hi; p++) pages.add(p);
  }
  if (pages.size === 0) throw new PdfToolError("Enter the pages you want, such as 1-3, 5 — or type all.");
  return [...pages].sort((x, y) => x - y);
}

/** Read and parse a PDF, turning pdf-lib's developer-facing errors into user-facing ones. */
async function loadPdf(file: File): Promise<PDFDocument> {
  const bytes = new Uint8Array(await file.arrayBuffer());
  // The "%PDF-" header must appear near the start; checking first gives a clear message for
  // renamed images, Word files and so on.
  const head = new TextDecoder("latin1").decode(bytes.subarray(0, 1024));
  if (!head.includes("%PDF-")) {
    throw new PdfToolError(
      `"${file.name}" isn't a real PDF. It may be a different kind of file that was renamed. Open it and save or export it as PDF, then try again.`,
    );
  }
  let doc: PDFDocument;
  try {
    // ignoreEncryption lets us inspect doc.isEncrypted ourselves. Catching pdf-lib's
    // EncryptedPDFError doesn't work: its ES5-compiled error classes fail `instanceof`.
    doc = await PDFDocument.load(bytes, { updateMetadata: false, ignoreEncryption: true });
  } catch {
    throw new PdfToolError(`"${file.name}" couldn't be read. The file may be damaged or incomplete.`);
  }
  if (doc.isEncrypted) {
    throw new PdfToolError(
      `"${file.name}" is password-protected. Open it in your PDF reader, remove the password (or "Print to PDF"), then try again.`,
    );
  }
  return doc;
}

function acroForm(doc: PDFDocument): PDFDict | undefined {
  // Look up directly rather than doc.getForm(), which would create an empty form as a side effect.
  return doc.catalog.lookupMaybe(PDFName.of("AcroForm"), PDFDict);
}

function hasFormFields(doc: PDFDocument): boolean {
  return (acroForm(doc)?.lookupMaybe(PDFName.of("Fields"), PDFArray)?.size() ?? 0) > 0;
}

function isSigned(doc: PDFDocument): boolean {
  return !!acroForm(doc)?.get(PDFName.of("SigFlags"));
}

function signatureWarning(name: string) {
  return `"${name}" is digitally signed. The signature won't be valid in the new file, so keep the original wherever a signed copy is needed.`;
}

async function toOutput(doc: PDFDocument, fileName: string): Promise<PdfOutput> {
  const bytes = await doc.save({ useObjectStreams: true, updateFieldAppearances: false });
  return {
    fileName,
    blob: new Blob([new Uint8Array(bytes)], { type: "application/pdf" }),
    pageCount: doc.getPageCount(),
  };
}

export async function mergePdfFiles(files: File[]): Promise<PdfResult> {
  if (files.length < 2) throw new PdfToolError("Choose at least two PDF files to merge.");
  const merged = await PDFDocument.create();
  const warnings: string[] = [];
  for (const file of files) {
    const source = await loadPdf(file);
    if (hasFormFields(source)) {
      warnings.push(
        `"${file.name}" has fillable form fields. They won't stay fillable in the merged PDF, so fill the form in first and save it with your PDF reader's "Print to PDF".`,
      );
    }
    if (isSigned(source)) warnings.push(signatureWarning(file.name));
    const pages = await merged.copyPages(source, source.getPageIndices());
    pages.forEach((page) => merged.addPage(page));
  }
  return { outputs: [await toOutput(merged, "merged.pdf")], warnings };
}

/** Extract the requested pages, one single-page PDF per page. */
export async function splitPdfFile(file: File, range: string): Promise<PdfResult> {
  const source = await loadPdf(file);
  const pages = parsePageRanges(range, source.getPageCount());
  const warnings: string[] = [];
  if (hasFormFields(source)) {
    warnings.push(`"${file.name}" has fillable form fields. They won't stay fillable in the extracted pages.`);
  }
  if (isSigned(source)) warnings.push(signatureWarning(file.name));

  const outputs: PdfOutput[] = [];
  for (const pageNumber of pages) {
    const doc = await PDFDocument.create();
    const [page] = await doc.copyPages(source, [pageNumber - 1]);
    doc.addPage(page);
    outputs.push(await toOutput(doc, toPdfFileName(file.name, `page-${pageNumber}`)));
  }
  return { outputs, warnings };
}

/**
 * Re-save the PDF itself (not a copy of its pages), so form fields, bookmarks and the title all
 * survive. Gains come from compact object streams: large for many text PDFs, near zero for scans.
 */
export async function optimizePdfFile(file: File): Promise<PdfResult> {
  const doc = await loadPdf(file);
  const warnings = isSigned(doc) ? [signatureWarning(file.name)] : [];
  return { outputs: [await toOutput(doc, toPdfFileName(file.name, "optimized"))], warnings };
}
