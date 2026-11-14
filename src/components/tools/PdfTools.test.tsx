import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// The component loads this module with a dynamic import; vi.mock covers that too.
vi.mock("@/lib/pdf-tools", () => ({
  mergePdfFiles: vi.fn(),
  splitPdfFile: vi.fn(),
  optimizePdfFile: vi.fn(),
}));

import { PdfTools } from "./PdfTools";
import { mergePdfFiles, optimizePdfFile, splitPdfFile } from "@/lib/pdf-tools";

const pdfFile = (name: string, size = 1000) =>
  new File([new Uint8Array(size)], name, { type: "application/pdf" });
const output = (fileName: string, size: number, pageCount = 1) => ({
  fileName,
  blob: new Blob([new Uint8Array(size)]),
  pageCount,
});
const userError = (message: string) => Object.assign(new Error(message), { name: "PdfToolError" });

beforeEach(() => vi.clearAllMocks());

async function setup(mode: "Merge PDFs" | "Split PDF" | "Optimize PDF") {
  const user = userEvent.setup();
  render(<PdfTools />);
  await user.click(screen.getByRole("button", { name: mode, pressed: mode === "Merge PDFs" }));
  return user;
}
const input = () => screen.getByLabelText("Choose PDF file") as HTMLInputElement;
const actionButton = (name: string) =>
  screen.getAllByRole("button", { name }).find((b) => !b.hasAttribute("aria-pressed"))!;

describe("PdfTools", () => {
  it("marks the selected mode for screen readers", async () => {
    const user = await setup("Merge PDFs");
    expect(screen.getByRole("button", { name: "Merge PDFs", pressed: true })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Split PDF", pressed: false }));
    expect(screen.getByRole("button", { name: "Split PDF", pressed: true })).toBeInTheDocument();
  });

  it("clears the file input so the same file can be chosen again", async () => {
    const user = await setup("Optimize PDF");
    await user.upload(input(), pdfFile("report.pdf"));
    expect(screen.getByText(/report\.pdf/)).toBeInTheDocument();
    expect(input().value).toBe("");
  });

  it("needs two files to merge, and lists them in merge order", async () => {
    const user = await setup("Merge PDFs");
    await user.upload(input(), pdfFile("one.pdf"));
    expect(actionButton("Merge PDFs")).toBeDisabled();
    await user.upload(input(), [pdfFile("a.pdf"), pdfFile("b.pdf")]);
    expect(actionButton("Merge PDFs")).toBeEnabled();
    expect(screen.getByText(/1\. a\.pdf/)).toBeInTheDocument();
    expect(screen.getByText(/2\. b\.pdf/)).toBeInTheDocument();
  });

  it("shows warnings returned by the library", async () => {
    vi.mocked(mergePdfFiles).mockResolvedValue({
      outputs: [output("merged.pdf", 900, 3)],
      warnings: ['"form.pdf" has fillable form fields.'],
    });
    const user = await setup("Merge PDFs");
    await user.upload(input(), [pdfFile("a.pdf"), pdfFile("form.pdf")]);
    await user.click(actionButton("Merge PDFs"));
    expect(await screen.findByRole("status")).toHaveTextContent("Merged 2 files into one 3-page PDF.");
    expect(screen.getByText(/has fillable form fields/)).toBeInTheDocument();
  });

  it("reports the saving when optimizing helps", async () => {
    vi.mocked(optimizePdfFile).mockResolvedValue({ outputs: [output("r-optimized.pdf", 250)], warnings: [] });
    const user = await setup("Optimize PDF");
    await user.upload(input(), pdfFile("r.pdf", 1000));
    await user.click(actionButton("Optimize PDF"));
    expect(await screen.findByRole("status")).toHaveTextContent("75% smaller");
  });

  it("says so honestly when optimizing doesn't help", async () => {
    vi.mocked(optimizePdfFile).mockResolvedValue({ outputs: [output("scan-optimized.pdf", 998)], warnings: [] });
    const user = await setup("Optimize PDF");
    await user.upload(input(), pdfFile("scan.pdf", 1000));
    await user.click(actionButton("Optimize PDF"));
    expect(await screen.findByRole("status")).toHaveTextContent(/couldn.t be made noticeably smaller/);
  });

  it("passes the page range to split", async () => {
    vi.mocked(splitPdfFile).mockResolvedValue({ outputs: [output("x-page-2.pdf", 10)], warnings: [] });
    const user = await setup("Split PDF");
    await user.upload(input(), pdfFile("x.pdf"));
    const range = screen.getByLabelText("Pages to extract");
    await user.clear(range);
    await user.type(range, "2");
    await user.click(actionButton("Split PDF"));
    await waitFor(() => expect(splitPdfFile).toHaveBeenCalledWith(expect.any(File), "2"));
    expect(await screen.findByRole("status")).toHaveTextContent("Extracted 1 page, one PDF each.");
  });

  it("shows user-facing errors but hides internal ones", async () => {
    vi.mocked(optimizePdfFile).mockRejectedValueOnce(userError('"s.pdf" is password-protected.'));
    const user = await setup("Optimize PDF");
    await user.upload(input(), pdfFile("s.pdf"));
    await user.click(actionButton("Optimize PDF"));
    expect(await screen.findByRole("alert")).toHaveTextContent('"s.pdf" is password-protected.');

    vi.mocked(optimizePdfFile).mockRejectedValueOnce(new TypeError("Cannot read properties of undefined"));
    await user.click(actionButton("Optimize PDF"));
    await waitFor(() => expect(screen.getByRole("alert")).toHaveTextContent(/Something went wrong/));
    expect(screen.getByRole("alert")).not.toHaveTextContent(/undefined/);
  });

  it("discards a result that finishes after switching mode", async () => {
    let finish!: (v: Awaited<ReturnType<typeof optimizePdfFile>>) => void;
    vi.mocked(optimizePdfFile).mockImplementationOnce(() => new Promise((r) => (finish = r)));
    const user = await setup("Optimize PDF");
    await user.upload(input(), pdfFile("scan.pdf"));
    await user.click(actionButton("Optimize PDF"));
    await user.click(screen.getByRole("button", { name: "Split PDF", pressed: false }));
    finish({ outputs: [output("scan-optimized.pdf", 10)], warnings: [] });
    await new Promise((r) => setTimeout(r, 20));
    expect(screen.queryByText("scan-optimized.pdf")).not.toBeInTheDocument();
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });
});
