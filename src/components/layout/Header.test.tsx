import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Header } from "./Header";
import { SITE } from "@/lib/site";

describe("Header", () => {
  it("shows the site name", () => {
    render(<Header />);
    expect(screen.getByText(SITE.name)).toBeInTheDocument();
  });

  it("has a Tools menu button and key links", () => {
    render(<Header />);
    // Compact header: a Tools dropdown trigger plus About/Contact.
    expect(screen.getByRole("button", { name: /tools/i })).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: "About" }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("link", { name: "Contact" }).length).toBeGreaterThan(0);
  });
});
