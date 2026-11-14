import { describe, expect, it } from "vitest";
import { PDFDict, PDFDocument, PDFName, PDFNumber, StandardFonts } from "pdf-lib";
import {
  mergePdfFiles,
  optimizePdfFile,
  parsePageRanges,
  PdfToolError,
  splitPdfFile,
  toPdfFileName,
} from "./pdf-tools";

// ---------- fixtures: real PDFs built with pdf-lib ----------

const asFile = (bytes: Uint8Array, name: string) => new File([bytes], name, { type: "application/pdf" });

/** n pages; page i is (300 + 10·i + offset) points wide, so page order is checkable afterwards. */
async function pdf(n: number, name: string, opts: { offset?: number; title?: string; objectStreams?: boolean } = {}) {
  const doc = await PDFDocument.create();
  if (opts.title) doc.setTitle(opts.title);
  const font = await doc.embedFont(StandardFonts.Helvetica);
  for (let i = 0; i < n; i++) {
    const page = doc.addPage([300 + 10 * i + (opts.offset ?? 0), 842]);
    for (let line = 0; line < 30; line++) {
      page.drawText(`Page ${i + 1}, line ${line}: invoice details`, { x: 20, y: 800 - line * 20, size: 10, font });
    }
  }
  return asFile(await doc.save({ useObjectStreams: opts.objectStreams ?? true }), name);
}

async function formPdf(name = "form.pdf") {
  const doc = await PDFDocument.create();
  doc.setTitle("Application form");
  const page = doc.addPage([595, 842]);
  const field = doc.getForm().createTextField("applicant.name");
  field.setText("Asha Rao");
  field.addToPage(page, { x: 50, y: 700, width: 300, height: 24 });
  return asFile(await doc.save(), name);
}

async function signedPdf(name = "signed.pdf") {
  const doc = await PDFDocument.create();
  doc.addPage();
  doc.getForm(); // creates the AcroForm
  doc.catalog.lookup(PDFName.of("AcroForm"), PDFDict).set(PDFName.of("SigFlags"), PDFNumber.of(3));
  return asFile(await doc.save(), name);
}

async function encryptedPdf(name = "statement.pdf") {
  const doc = await PDFDocument.create();
  doc.addPage();
  doc.context.trailerInfo.Encrypt = doc.context.obj({ Filter: "Standard", V: 2 });
  return asFile(await doc.save({ useObjectStreams: false }), name);
}

const open = async (blob: Blob) => PDFDocument.load(new Uint8Array(await blob.arrayBuffer()));
const widths = (doc: PDFDocument) => doc.getPages().map((p) => Math.round(p.getWidth()));
const message = async (fn: () => Promise<unknown>) => {
  try {
    await fn();
  } catch (e) {
    return e;
  }
  throw new Error("expected an error");
};

// ---------- page ranges ----------

describe("parsePageRanges", () => {
  it("parses ranges and single pages, sorted and unique", () => {
    expect(parsePageRanges("8-10, 1-3, 5, 2", 10)).toEqual([1, 2, 3, 5, 8, 9, 10]);
    expect(parsePageRanges(" 4 ", 10)).toEqual([4]);
    expect(parsePageRanges("3-1", 10)).toEqual([1, 2, 3]); // reversed range is fine
    expect(parsePageRanges("1 - 2", 10)).toEqual([1, 2]);
  });

  it("accepts 'all'", () => {
    expect(parsePageRanges("ALL", 3)).toEqual([1, 2, 3]);
  });

  it.each([
    ["", /type all/],
    [" , ", /type all/],
    ["1.5", /isn't a page or range/],
    ["1-3-5", /isn't a page or range/],
    ["-3", /isn't a page or range/],
    ["abc", /isn't a page or range/],
    ["0", /start at 1/],
    ["0-2", /start at 1/],
    ["11", /has 10 pages, so page 11 doesn't exist/],
  ])("rejects %j with a clear message", (input, msg) => {
    expect(() => parsePageRanges(input, 10)).toThrow(PdfToolError);
    expect(() => parsePageRanges(input, 10)).toThrow(msg);
  });

  it("rejects a huge range instantly instead of expanding it", () => {
    const t0 = performance.now();
    expect(() => parsePageRanges("1-1000000000", 10)).toThrow(/page 1000000000 doesn't exist/);
    expect(performance.now() - t0).toBeLessThan(50);
  });

  it("uses singular 'page' for a one-page PDF", () => {
    expect(() => parsePageRanges("2", 1)).toThrow("This PDF has 1 page, so page 2 doesn't exist.");
  });
});

describe("toPdfFileName", () => {
  it("adds a suffix and keeps one .pdf", () => {
    expect(toPdfFileName("Bank Statement.PDF", "page-2")).toBe("Bank Statement-page-2.pdf");
    expect(toPdfFileName(".pdf", "optimized")).toBe("document-optimized.pdf");
  });
});

// ---------- merge ----------

describe("mergePdfFiles", () => {
  it("joins every page in file order", async () => {
    const r = await mergePdfFiles([await pdf(2, "a.pdf"), await pdf(3, "b.pdf", { offset: 100 })]);
    const doc = await open(r.outputs[0].blob);
    expect(r.outputs[0].pageCount).toBe(5);
    expect(widths(doc)).toEqual([300, 310, 400, 410, 420]);
    expect(r.outputs[0].fileName).toBe("merged.pdf");
    expect(r.warnings).toEqual([]);
  });

  it("warns about form fields instead of dropping them silently", async () => {
    const r = await mergePdfFiles([await pdf(1, "a.pdf"), await formPdf()]);
    expect(r.warnings.join(" ")).toMatch(/"form\.pdf" has fillable form fields/);
  });

  it("warns that a digital signature won't survive", async () => {
    const r = await mergePdfFiles([await pdf(1, "a.pdf"), await signedPdf()]);
    expect(r.warnings.join(" ")).toMatch(/"signed\.pdf" is digitally signed/);
  });

  it("needs at least two files", async () => {
    expect(await message(() => mergePdfFiles([]))).toBeInstanceOf(PdfToolError);
  });
});

// ---------- split ----------

describe("splitPdfFile", () => {
  it("makes one single-page PDF per requested page", async () => {
    const r = await splitPdfFile(await pdf(5, "report.pdf"), "1-2, 5");
    expect(r.outputs.map((o) => o.fileName)).toEqual([
      "report-page-1.pdf",
      "report-page-2.pdf",
      "report-page-5.pdf",
    ]);
    expect(r.outputs.every((o) => o.pageCount === 1)).toBe(true);
    expect(widths(await open(r.outputs[2].blob))).toEqual([340]); // really page 5
  });

  it("validates pages against the real page count", async () => {
    const three = await pdf(3, "x.pdf");
    const e = await message(() => splitPdfFile(three, "4"));
    expect((e as Error).message).toBe("This PDF has 3 pages, so page 4 doesn't exist.");
  });

  it("warns about form fields", async () => {
    const r = await splitPdfFile(await formPdf(), "1");
    expect(r.warnings.join(" ")).toMatch(/form fields/);
  });
});

// ---------- optimize ----------

describe("optimizePdfFile", () => {
  it("shrinks a PDF saved without object streams", async () => {
    const original = await pdf(40, "big.pdf", { objectStreams: false });
    const r = await optimizePdfFile(original);
    expect(r.outputs[0].blob.size).toBeLessThan(original.size);
    expect(r.outputs[0].pageCount).toBe(40);
  });

  it("keeps form fields, their values and the title", async () => {
    const r = await optimizePdfFile(await formPdf());
    const doc = await open(r.outputs[0].blob);
    expect(doc.getForm().getTextField("applicant.name").getText()).toBe("Asha Rao");
    expect(doc.getTitle()).toBe("Application form");
    expect(r.warnings).toEqual([]);
  });

  it("warns about a signature", async () => {
    const r = await optimizePdfFile(await signedPdf());
    expect(r.warnings.join(" ")).toMatch(/digitally signed/);
  });
});

// ---------- user-facing errors ----------

describe("errors are written for users", () => {
  it("password-protected PDF", async () => {
    const e = await message(async () => optimizePdfFile(await encryptedPdf()));
    expect(e).toBeInstanceOf(PdfToolError);
    expect((e as Error).message).toMatch(/"statement\.pdf" is password-protected/);
    expect((e as Error).message).not.toMatch(/ignoreEncryption|PDFDocument/);
  });

  it("a file that isn't a PDF", async () => {
    const e = await message(() => optimizePdfFile(new File(["hello"], "notes.pdf")));
    expect((e as Error).message).toMatch(/^"notes\.pdf" isn't a real PDF\. It may be a different kind of file that was renamed/);
  });

  it("a damaged PDF", async () => {
    const good = new Uint8Array(await (await pdf(2, "x.pdf")).arrayBuffer());
    const truncated = asFile(good.subarray(0, 60), "broken.pdf");
    const e = await message(() => optimizePdfFile(truncated));
    expect(e).toBeInstanceOf(PdfToolError);
    expect((e as Error).message).toMatch(/"broken\.pdf" couldn't be read/);
  });
});
