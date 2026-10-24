import { describe, it, expect, vi, beforeEach } from "vitest";
import { render } from "@testing-library/react";

// Controllable mock of the ads config so we can test both states.
const mockState = { active: false };
vi.mock("@/lib/ads", () => ({
  adsActive: () => mockState.active,
  ADSENSE_CLIENT: "ca-pub-TEST",
  AD_UNIT_IDS: { "tool-top": "111", "tool-bottom": "222" },
}));

import { AdSlot } from "./AdSlot";

beforeEach(() => {
  mockState.active = false;
  // @ts-expect-error test stub for the adsbygoogle queue.
  window.adsbygoogle = [];
});

describe("AdSlot", () => {
  it("renders a dev placeholder when ads are off (non-production)", () => {
    const { container } = render(<AdSlot slot="tool-top" />);
    expect(container.querySelector('[data-ad-slot="tool-top"]')).toBeTruthy();
    expect(container.querySelector("ins.adsbygoogle")).toBeNull();
  });

  it("renders AdSense <ins> markup when ads are active", () => {
    mockState.active = true;
    const { container } = render(<AdSlot slot="tool-top" />);
    const ins = container.querySelector("ins.adsbygoogle");
    expect(ins).toBeTruthy();
    expect(ins?.getAttribute("data-ad-client")).toBe("ca-pub-TEST");
    expect(ins?.getAttribute("data-ad-slot")).toBe("111");
  });

  it("pushes to the adsbygoogle queue when active", () => {
    mockState.active = true;
    render(<AdSlot slot="tool-bottom" />);
    // The effect should have pushed a config object onto the queue.
    // @ts-expect-error test stub for the adsbygoogle queue.
    expect(window.adsbygoogle.length).toBeGreaterThan(0);
  });
});
