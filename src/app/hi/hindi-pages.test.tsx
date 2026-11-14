import { describe, it, expect } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import HindiAgePage, { metadata as ageHiMeta } from "./tools/age-calculator/page";
import { metadata as ageEnMeta } from "../tools/age-calculator/page";
import userEvent from "@testing-library/user-event";
import HindiPercentagePage, { metadata as hiMeta } from "./tools/percentage-calculator/page";
import { metadata as enMeta } from "../tools/percentage-calculator/page";
import sitemap from "../sitemap";
import { languageAlternates, getHindiRoutes, findHindiPage } from "@/lib/hindi";

const BASE = /^https:\/\/www\.tool-kart\.com/;

describe("Hindi percentage calculator", () => {
  it("renders in Hindi, marked lang=hi, with a link back to English", () => {
    const { container } = render(<HindiPercentagePage />);
    expect(screen.getByRole("heading", { level: 1, name: "प्रतिशत कैलकुलेटर" })).toBeInTheDocument();
    expect(container.querySelector("article")).toHaveAttribute("lang", "hi");
    expect(screen.getByRole("heading", { name: "अक्सर पूछे जाने वाले सवाल" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "This page in English" })).toHaveAttribute(
      "href",
      "/tools/percentage-calculator",
    );
  });

  it("calculates with the Hindi labels (marks percentage)", async () => {
    const user = userEvent.setup();
    render(<HindiPercentagePage />);
    const got = screen.getByLabelText("प्राप्त (X)");
    const total = screen.getByLabelText("कुल (Y)");
    await user.clear(got);
    await user.type(got, "435");
    await user.clear(total);
    await user.type(total, "500");
    expect(screen.getByText("87%")).toBeInTheDocument();
    // The default "15% of 200" example still works.
    expect(screen.getByLabelText("प्रतिशत")).toHaveValue(15);
    expect(screen.getByText("30")).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: "नतीजा कॉपी करें" })).toHaveLength(3);
  });

  it("emits Hindi FAQ structured data", () => {
    const { container } = render(<HindiPercentagePage />);
    const graphs = [...container.querySelectorAll('script[type="application/ld+json"]')].map((s) =>
      JSON.parse(s.textContent!),
    );
    const faq = graphs.flatMap((g) => g["@graph"] ?? []).find((n) => n["@type"] === "FAQPage");
    expect(faq.inLanguage).toBe("hi");
    expect(faq.mainEntity[0].name).toBe("प्रतिशत निकालने का सूत्र क्या है?");
  });
});

describe("Hindi age calculator", () => {
  it("gives the page's worked example (15 Aug 2001 → 1 Jan 2027 = 25 साल, 4 महीने, 17 दिन)", () => {
    const { container } = render(<HindiAgePage />);
    expect(container.querySelector("article")).toHaveAttribute("lang", "hi");
    fireEvent.change(screen.getByLabelText("जन्म तिथि"), { target: { value: "2001-08-15" } });
    fireEvent.change(screen.getByLabelText("इस तारीख़ को उम्र"), { target: { value: "2027-01-01" } });
    const panel = screen.getByRole("region", { name: "उम्र कैलकुलेटर" });
    expect(within(panel).getByText("25 साल, 4 महीने और 17 दिन")).toBeInTheDocument();
    // Weekday is shown in Hindi, not English.
    const weekday = screen.getByText("जन्म का दिन").previousElementSibling!;
    expect(weekday.textContent).toMatch(/^[\u0900-\u097F]+वार$/);
  });

  it("shows Hindi errors and the Hindi days-between sentence", () => {
    render(<HindiAgePage />);
    fireEvent.change(screen.getByLabelText("जन्म तिथि"), { target: { value: "2030-01-01" } });
    fireEvent.change(screen.getByLabelText("इस तारीख़ को उम्र"), { target: { value: "2024-01-01" } });
    expect(screen.getByRole("alert")).toHaveTextContent("जन्म तिथि चुनी गई तारीख़ के बाद की नहीं हो सकती।");
    fireEvent.change(screen.getByLabelText("शुरू की तारीख़"), { target: { value: "2024-01-01" } });
    fireEvent.change(screen.getByLabelText("आख़िरी तारीख़"), { target: { value: "2024-01-11" } });
    expect(screen.getByText("10 दिन")).toBeInTheDocument();
  });

  it("links both language versions with hreflang", () => {
    expect(ageHiMeta.alternates?.languages).toMatchObject({
      hi: expect.stringMatching(/\/hi\/tools\/age-calculator$/),
      en: expect.stringMatching(/\/tools\/age-calculator$/),
    });
    expect(ageEnMeta.alternates?.languages).toEqual(ageHiMeta.alternates?.languages);
  });
});

describe("hreflang between English and Hindi", () => {
  const expected = {
    en: expect.stringMatching(/\/tools\/percentage-calculator$/),
    hi: expect.stringMatching(/\/hi\/tools\/percentage-calculator$/),
    "x-default": expect.stringMatching(/\/tools\/percentage-calculator$/),
  };

  it("adds the same language alternates to both pages, each with a self canonical", () => {
    expect(hiMeta.alternates?.languages).toEqual(expected);
    expect(enMeta.alternates?.languages).toEqual(expected);
    expect(String(hiMeta.alternates?.canonical)).toMatch(/\/hi\/tools\/percentage-calculator$/);
    expect(String(enMeta.alternates?.canonical)).toMatch(/[^i]\/tools\/percentage-calculator$/);
    for (const url of Object.values(hiMeta.alternates!.languages!)) expect(String(url)).toMatch(BASE);
    expect(hiMeta.openGraph).toMatchObject({ locale: "hi_IN" });
  });

  it("gives pages without a Hindi version no alternates", () => {
    expect(languageAlternates("/tools/emi-calculator")).toBeUndefined();
  });

  it("puts both language versions in the sitemap with matching alternates", () => {
    const entries = sitemap();
    for (const route of getHindiRoutes()) {
      const hi = entries.find((e) => e.url.endsWith(route))!;
      const en = entries.find((e) => e.url.endsWith(findHindiPage(route)!.enPath) && !e.url.includes("/hi/"))!;
      expect(hi.lastModified).toBe(findHindiPage(route)!.lastModified);
      expect(hi.alternates?.languages).toEqual(en.alternates?.languages);
      expect(hi.alternates?.languages).toMatchObject({ hi: expect.stringMatching(BASE) });
    }
  });
});
