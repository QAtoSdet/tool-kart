import { describe, it, expect, afterEach, vi } from "vitest";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

async function loadAds() {
  // Re-import after stubbing env so module-level reads pick up the new values.
  return await import("./ads");
}

describe("adsActive", () => {
  it("is false when the flag is off", async () => {
    vi.stubEnv("NEXT_PUBLIC_ADS_ENABLED", "false");
    vi.stubEnv("NEXT_PUBLIC_ADSENSE_CLIENT", "ca-pub-123");
    vi.resetModules();
    const { adsActive } = await loadAds();
    expect(adsActive()).toBe(false);
  });

  it("is false when the flag is on but no client ID", async () => {
    vi.stubEnv("NEXT_PUBLIC_ADS_ENABLED", "true");
    vi.stubEnv("NEXT_PUBLIC_ADSENSE_CLIENT", "");
    vi.resetModules();
    const { adsActive } = await loadAds();
    expect(adsActive()).toBe(false);
  });

  it("is true when the flag is on and a client ID is set", async () => {
    vi.stubEnv("NEXT_PUBLIC_ADS_ENABLED", "true");
    vi.stubEnv("NEXT_PUBLIC_ADSENSE_CLIENT", "ca-pub-123");
    vi.resetModules();
    const { adsActive } = await loadAds();
    expect(adsActive()).toBe(true);
  });
});
