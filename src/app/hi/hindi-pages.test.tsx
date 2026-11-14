import { describe, it, expect } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import HindiAgePage, { metadata as ageHiMeta } from "./tools/age-calculator/page";
import { metadata as ageEnMeta } from "../tools/age-calculator/page";
import userEvent from "@testing-library/user-event";
import HindiPercentagePage, { metadata as hiMeta } from "./tools/percentage-calculator/page";
import { metadata as enMeta } from "../tools/percentage-calculator/page";
import sitemap from "../sitemap";
import { languageAlternates, getHindiRoutes, findHindiPage, HINDI_PAGES } from "@/lib/hindi";
import HindiCompressPage from "./tools/compress-image-to-kb/page";
import HindiEmiPage from "./tools/emi-calculator/page";
import HindiGstPage from "./tools/gst-calculator/page";
import { calculateEmi, formatINR } from "@/lib/emi";

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
    expect(languageAlternates("/tools/sip-calculator")).toBeUndefined();
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

describe("Hindi compress-to-KB tool", () => {
  it("renders the widget in Hindi with the photo-specific privacy note", () => {
    const { container } = render(<HindiCompressPage />);
    expect(container.querySelector("article")).toHaveAttribute("lang", "hi");
    expect(screen.getByRole("button", { name: "फ़ोटो चुनें" })).toBeInTheDocument();
    expect(screen.getByText("ज़्यादा से ज़्यादा फ़ाइल साइज़")).toBeInTheDocument();
    expect(screen.getByText(/आपकी फ़ोटो या हस्ताक्षर हमारे सर्वर पर/)).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("अपना साइज़ KB में"), { target: { value: "2" } });
    expect(screen.getByRole("alert")).toHaveTextContent("5 से 5000 KB के बीच का साइज़ डालें।");
  });
});

describe("Hindi EMI calculator", () => {
  it("shows the default EMI with Hindi labels and a Hindi chart summary", () => {
    render(<HindiEmiPage />);
    const panel = screen.getByRole("region", { name: "EMI कैलकुलेटर" });
    expect(within(panel).getByText("मासिक EMI").previousElementSibling).toHaveTextContent("₹12,399");
    expect(within(panel).getByRole("img", { name: /10 साल के भुगतान का चार्ट/ })).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("लोन की रकम (₹)"), { target: { value: "0" } });
    expect(screen.getByRole("alert")).toHaveTextContent("लोन की रकम 0 से ज़्यादा डालें।");
  });

  it("uses worked-example figures that match the calculator", () => {
    const ten = calculateEmi({ principal: 10_00_000, annualRatePercent: 8.5, months: 120 });
    const twenty = calculateEmi({ principal: 10_00_000, annualRatePercent: 8.5, months: 240 });
    const { container } = render(<HindiEmiPage />);
    const text = container.querySelector("article")!.textContent!;
    for (const v of [ten.emi, ten.totalPayment, ten.totalInterest, twenty.emi, twenty.totalInterest]) {
      expect(text).toContain(formatINR(v));
    }
  });
});

describe("Hindi GST calculator", () => {
  it("adds and removes GST with Hindi labels", () => {
    render(<HindiGstPage />);
    const panel = screen.getByRole("region", { name: "GST कैलकुलेटर" });
    expect(within(panel).getByText("कुल रकम").nextElementSibling).toHaveTextContent("₹1,180");
    fireEvent.change(screen.getByLabelText("रकम (₹)"), { target: { value: "1180" } });
    fireEvent.change(screen.getByLabelText("क्या करना है"), { target: { value: "remove" } });
    expect(within(panel).getByText("मूल रकम").nextElementSibling).toHaveTextContent("₹1,000");
  });

  it("lists the current slabs first and the abolished ones separately", () => {
    render(<HindiGstPage />);
    const groups = [...screen.getByLabelText("GST दर").querySelectorAll("optgroup")];
    expect(groups.map((g) => [...g.querySelectorAll("option")].map((o) => o.value))).toEqual([
      ["0", "3", "5", "18", "40"],
      ["12", "28"],
    ]);
    expect(groups[1].label).toMatch(/22 सितंबर 2025 से पहले/);
  });
});

describe("every Hindi page", () => {
  it.each(HINDI_PAGES.map((p) => p.enPath))("has hreflang on both %s and its Hindi version", async (enPath) => {
    const hi = (await import(`./tools/${enPath.split("/").pop()}/page`)).metadata;
    const en = (await import(`../tools/${enPath.split("/").pop()}/page`)).metadata;
    expect(hi.alternates.languages).toEqual(en.alternates.languages);
    expect(hi.alternates.languages.hi).toMatch(new RegExp(`/hi${enPath}$`));
    expect(String(hi.alternates.canonical)).toMatch(new RegExp(`/hi${enPath}$`));
  });
});
