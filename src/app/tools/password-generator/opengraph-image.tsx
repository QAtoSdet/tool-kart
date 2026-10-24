import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/components/seo/og";

export const runtime = "edge";
export const alt = "Password Generator";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOgImage("Password Generator", "🔑");
}
