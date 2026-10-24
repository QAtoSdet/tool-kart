import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Home from "./page";
import { getAvailableTools } from "@/lib/tools";

describe("Homepage", () => {
  it("renders the hero heading", () => {
    render(<Home />);
    expect(
      screen.getByRole("heading", { level: 1, name: /free online tools/i }),
    ).toBeInTheDocument();
  });

  it("renders a card linking to every available tool", () => {
    const { container } = render(<Home />);
    for (const tool of getAvailableTools()) {
      // Match by href to avoid ambiguity now that several tool names/descriptions
      // share words like "calculator".
      const link = container.querySelector(`a[href="/tools/${tool.slug}"]`);
      expect(link, `missing link for ${tool.slug}`).toBeTruthy();
    }
  });
});
