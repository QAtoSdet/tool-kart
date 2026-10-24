import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Footer } from "@/components/layout/Footer";
import PrivacyPage from "./privacy/page";
import TermsPage from "./terms/page";
import AboutPage from "./about/page";
import ContactPage from "./contact/page";

describe("Legal/info pages", () => {
  it("Privacy page renders and discloses ads + client-side processing", () => {
    render(<PrivacyPage />);
    expect(screen.getByRole("heading", { level: 1, name: /privacy policy/i })).toBeInTheDocument();
    expect(screen.getByText(/never uploaded to or stored on our/i)).toBeInTheDocument();
    expect(screen.getByText(/AdSense/i)).toBeInTheDocument();
  });

  it("Terms page renders", () => {
    render(<TermsPage />);
    expect(screen.getByRole("heading", { level: 1, name: /terms of use/i })).toBeInTheDocument();
  });

  it("About page renders", () => {
    render(<AboutPage />);
    expect(screen.getByRole("heading", { level: 1, name: /about/i })).toBeInTheDocument();
  });

  it("Contact page renders with an email", () => {
    render(<ContactPage />);
    expect(screen.getByRole("heading", { level: 1, name: /contact us/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /@/ })).toBeInTheDocument();
  });

  it("Footer links to all four legal/info pages", () => {
    render(<Footer />);
    const expected = {
      About: "/about",
      Contact: "/contact",
      "Privacy Policy": "/privacy",
      Terms: "/terms",
    };
    for (const [label, href] of Object.entries(expected)) {
      expect(screen.getByRole("link", { name: label })).toHaveAttribute("href", href);
    }
  });
});
