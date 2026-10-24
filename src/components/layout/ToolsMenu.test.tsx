import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ToolsMenu } from "./ToolsMenu";
import { getAvailableTools } from "@/lib/tools";

describe("ToolsMenu", () => {
  it("is collapsed by default and expands on click", async () => {
    const user = userEvent.setup();
    render(<ToolsMenu tools={getAvailableTools()} />);

    const trigger = screen.getByRole("button", { name: /tools/i });
    expect(trigger).toHaveAttribute("aria-expanded", "false");

    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");

    // A tool link should now be visible and point to its route.
    const first = getAvailableTools()[0];
    const link = screen.getByRole("link", { name: new RegExp(first.name, "i") });
    expect(link).toHaveAttribute("href", `/tools/${first.slug}`);
  });
});
