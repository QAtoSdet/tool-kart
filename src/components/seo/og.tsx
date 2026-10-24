import { ImageResponse } from "next/og";
import { SITE } from "@/lib/site";

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

/**
 * Shared Open Graph image renderer used by per-tool opengraph-image routes.
 * Keeps all social images visually consistent with just a title + icon passed in.
 */
export function renderOgImage(title: string, icon: string) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          background: "linear-gradient(135deg,#eff6ff 0%,#ffffff 60%)",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background: "#2563eb",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 30,
            }}
          >
            🧰
          </div>
          <div style={{ fontSize: 32, fontWeight: 700, color: "#0f172a" }}>{SITE.name}</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          <div style={{ fontSize: 110 }}>{icon}</div>
          <div style={{ fontSize: 68, fontWeight: 800, color: "#0f172a", lineHeight: 1.05 }}>
            {title}
          </div>
        </div>
        <div style={{ fontSize: 28, color: "#16a34a", fontWeight: 600 }}>
          🔒 Private • Free • Runs in your browser
        </div>
      </div>
    ),
    { ...OG_SIZE },
  );
}
