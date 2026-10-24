import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ToolPage } from "./ToolPage";

describe("ToolPage shell", () => {
  const renderShell = () =>
    render(
      <ToolPage
        slug="emi-calculator"
        title="Sample Tool"
        description="A sample description."
        explainer={<p>Explainer content here.</p>}
        faqs={[{ question: "Is it free?", answer: "Yes, totally free." }]}
      >
        <div data-testid="tool-widget">widget</div>
      </ToolPage>,
    );

  it("renders the title as an H1", () => {
    renderShell();
    expect(screen.getByRole("heading", { level: 1, name: "Sample Tool" })).toBeInTheDocument();
  });

  it("renders the tool widget, explainer and FAQ", () => {
    renderShell();
    expect(screen.getByTestId("tool-widget")).toBeInTheDocument();
    expect(screen.getByText("Explainer content here.")).toBeInTheDocument();
    expect(screen.getByText("Is it free?")).toBeInTheDocument();
    expect(screen.getByText("Yes, totally free.")).toBeInTheDocument();
  });

  it("shows the privacy badge", () => {
    renderShell();
    expect(screen.getByText(/Private by design/i)).toBeInTheDocument();
  });

  it("reserves ad slots (dev placeholders)", () => {
    const { container } = renderShell();
    // In the test env (NODE_ENV=test), AdSlot renders its placeholder with data-ad-slot.
    expect(container.querySelector('[data-ad-slot="tool-top"]')).toBeTruthy();
    expect(container.querySelector('[data-ad-slot="tool-bottom"]')).toBeTruthy();
  });

  it("shows a 'more tools' strip excluding the current tool", () => {
    renderShell();
    expect(
      screen.getByRole("heading", { name: /try another free tool/i }),
    ).toBeInTheDocument();
    // The current tool (emi-calculator) should not link to itself here.
    const links = screen.getAllByRole("link");
    expect(links.some((l) => l.getAttribute("href") === "/tools/emi-calculator")).toBe(false);
    // Another tool should be linked.
    expect(links.some((l) => l.getAttribute("href") === "/tools/qr-code-generator")).toBe(true);
  });
});
