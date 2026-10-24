import { ImageResponse } from "next/og";
import { SITE } from "@/lib/site";

export const runtime = "edge";
export const alt = `${SITE.name} — ${SITE.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Default social share image for the homepage and any page without its own. */
export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(135deg,#eff6ff 0%,#ffffff 60%)",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 16,
              background: "#2563eb",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 40,
            }}
          >
            🧰
          </div>
          <div style={{ fontSize: 40, fontWeight: 700, color: "#0f172a" }}>{SITE.name}</div>
        </div>
        <div style={{ marginTop: 40, fontSize: 60, fontWeight: 800, color: "#0f172a", lineHeight: 1.1 }}>
          Free online tools that keep your files private
        </div>
        <div style={{ marginTop: 24, fontSize: 30, color: "#475569" }}>
          No sign-up • No uploads • Runs in your browser
        </div>
      </div>
    ),
    { ...size },
  );
}
