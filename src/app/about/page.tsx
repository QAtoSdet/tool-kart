import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/LegalPage";
import { buildMetadata } from "@/components/seo/metadata";
import { SITE } from "@/lib/site";
import { getAvailableTools } from "@/lib/tools";

export const metadata: Metadata = buildMetadata({
  title: "About",
  description: `About ${SITE.name} — fast, free, privacy-friendly online tools that run entirely in your browser.`,
  path: "/about",
});

export default function AboutPage() {
  const tools = getAvailableTools();
  return (
    <LegalPage title={`About ${SITE.name}`}>
      <p>
        {SITE.name} is a collection of fast, free online utility tools built around one simple
        idea: the tools you use every day should respect your privacy. Everything here runs
        <strong> entirely in your browser</strong>, so the files and values you work with never
        leave your device.
      </p>

      <h2>Why we built it</h2>
      <p>
        Many &quot;free online tools&quot; upload your files to a server to process them. That is
        slower, and it means handing your data to someone else. We take a different approach:
        modern browsers are powerful enough to compress images, generate QR codes and run
        calculations locally. No upload, no account, no clutter.
      </p>

      <h2>What you can do here</h2>
      <ul>
        {tools.map((tool) => (
          <li key={tool.slug}>
            <Link href={`/tools/${tool.slug}`}>{tool.name}</Link> — {tool.description}
          </li>
        ))}
      </ul>

      <h2>How we keep it free</h2>
      <p>
        The site is supported by non-intrusive advertising and uses lightweight analytics to
        understand which tools are useful. We explain exactly what that involves in our{" "}
        <Link href="/privacy">Privacy Policy</Link>.
      </p>

      <h2>Feedback</h2>
      <p>
        Have a tool you&apos;d like to see, or found a bug? We&apos;d love to hear from you on the{" "}
        <Link href="/contact">contact page</Link>.
      </p>
    </LegalPage>
  );
}
