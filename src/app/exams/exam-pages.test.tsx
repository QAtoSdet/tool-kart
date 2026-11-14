import { describe, it, expect } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ExamPage, { generateStaticParams } from "./[slug]/page";
import ExamsHub from "./page";
import { EXAMS } from "@/lib/exams";

const renderExam = async (slug: string) =>
  render(await ExamPage({ params: Promise.resolve({ slug }) }));

describe("exam pages", () => {
  it("pre-renders one page per exam", () => {
    expect(generateStaticParams()).toEqual(EXAMS.map((e) => ({ slug: e.slug })));
  });

  it("shows the requirements table, check date and official source", async () => {
    await renderExam("upsc-photo-signature-size");
    const table = screen.getByRole("table", { name: /UPSC photo and signature requirements/ });
    expect(within(table).getByRole("row", { name: /Passport-size photograph.*20–200 KB/ })).toBeInTheDocument();
    expect(within(table).getByRole("row", { name: /Live photograph.*captured live/ })).toBeInTheDocument();
    expect(within(table).getByRole("row", { name: /Triple signature.*20–100 KB/ })).toBeInTheDocument();
    expect(screen.getByText(/Checked against the official document on/)).toHaveTextContent("14 November 2026");
    expect(screen.getByRole("link", { name: /Instructions for uploading the photo/ })).toHaveAttribute(
      "href",
      expect.stringMatching(/^https:\/\/upsconline\.nic\.in\//),
    );
  });

  it("presets the resizer to the selected document's limits", async () => {
    const user = userEvent.setup();
    await renderExam("ibps-sbi-photo-signature-size");
    // Live-only items get no button; the four uploads do.
    const group = screen.getByRole("group", { name: /Which document are you preparing/ });
    expect(within(group).getAllByRole("button")).toHaveLength(4);
    expect(screen.getByLabelText("Custom size in KB")).toHaveValue(50); // photo first
    await user.click(within(group).getByRole("button", { name: "Signature" }));
    expect(screen.getByLabelText("Custom size in KB")).toHaveValue(20);
    expect(screen.getByText("Signature:", { selector: "strong" }).closest("p")).toHaveTextContent("10–20 KB");
  });

  it("has no document picker when only one item is uploaded (SSC: signature only)", async () => {
    await renderExam("ssc-cgl-photo-signature-size");
    expect(screen.queryByRole("group", { name: /Which document/ })).not.toBeInTheDocument();
    expect(screen.getByLabelText("Custom size in KB")).toHaveValue(20);
    expect(screen.getByText(/paragraph 9.6 says about 6.0 × 2.0 cm/)).toBeInTheDocument();
  });

  it("links to every other exam", async () => {
    await renderExam("neet-ug-photo-signature-size");
    const others = screen.getByRole("heading", { name: "Other exams" }).parentElement!;
    expect(within(others).getAllByRole("link", { name: /photo and signature size/ })).toHaveLength(EXAMS.length - 1);
  });
});

describe("exams hub", () => {
  it("links to every exam page", () => {
    render(<ExamsHub />);
    for (const e of EXAMS) {
      expect(screen.getByRole("link", { name: new RegExp(e.name.replace(/[&]/g, "\\&")) })).toHaveAttribute(
        "href",
        `/exams/${e.slug}`,
      );
    }
  });
});
