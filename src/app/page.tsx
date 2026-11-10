import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { ScrollToButton } from "@/components/ScrollToButton";
import { ItemListJsonLd } from "@/components/seo/ItemListJsonLd";
import { getAvailableTools, type Tool } from "@/lib/tools";
import { getAvailableHubs } from "@/lib/categories";
import { SITE } from "@/lib/site";

const tools = getAvailableTools();

/**
 * Homepage metadata. Uses an absolute title (bypassing the layout's
 * "%s | SiteName" template) so the brand name isn't duplicated, and a
 * description that names the main tool categories + the privacy angle —
 * this is the highest-authority page and should target the brand + core
 * offering, not fall back to the generic layout default.
 */
export const metadata: Metadata = {
  title: {
    absolute: `${SITE.name} — ${tools.length} Free Online Tools (Image, QR, EMI, GST & More)`,
  },
  description:
    "Free online utility tools that run in your browser — income tax, EMI, GST, SIP and age calculators, image compressor, QR code generator, unit converter, word counter and password generator. No sign-up, no uploads, fully private.",
  alternates: { canonical: SITE.url },
  openGraph: {
    type: "website",
    siteName: SITE.name,
    title: `${SITE.name} — ${tools.length} Free Online Tools`,
    description: SITE.description,
    url: SITE.url,
  },
  twitter: {
    card: "summary",
    title: `${SITE.name} — ${tools.length} Free Online Tools`,
    description: SITE.description,
  },
};

function ToolCard({ tool }: { tool: Tool }) {
  return (
    <Link href={`/tools/${tool.slug}`} className="group block h-full">
      <Card className="h-full transition-shadow group-hover:shadow-md">
        <div className="flex items-start gap-3">
          <span aria-hidden className="text-2xl">
            {tool.icon}
          </span>
          <div>
            <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 dark:text-white">
              {tool.name}
            </h3>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{tool.description}</p>
          </div>
        </div>
      </Card>
    </Link>
  );
}

export default function Home() {
  return (
    <>
      {/* ItemList structured data: declares the site's content map to search
          engines and is eligible for richer listing representations. */}
      <ItemListJsonLd items={tools.map((t) => ({ name: t.name, path: `/tools/${t.slug}` }))} />

      <section className="border-b border-slate-200 bg-gradient-to-b from-blue-50 to-white py-16 dark:border-slate-800 dark:from-slate-900 dark:to-slate-950">
        <Container className="text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-medium text-green-800 dark:border-green-900/50 dark:bg-green-950/40 dark:text-green-300">
            🔒 Private by design — nothing leaves your device
          </span>
          <h1 className="mx-auto mt-5 max-w-2xl text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl dark:text-white">
            Free online tools that keep your files private
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-slate-600 dark:text-slate-300">
            Compress images, generate QR codes and run everyday calculations — all in your browser.
            No sign-up, no uploads, no tracking of what you process.
          </p>
          <div className="mt-8">
            <ScrollToButton
              targetId="tools"
              className="inline-flex h-12 cursor-pointer items-center justify-center rounded-lg bg-blue-600 px-6 text-base font-medium text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
            >
              Browse tools
            </ScrollToButton>
          </div>
          <ul className="mx-auto mt-8 flex max-w-lg flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-slate-600 dark:text-slate-400">
            <li className="flex items-center gap-1.5">✓ Runs in your browser</li>
            <li className="flex items-center gap-1.5">✓ No file uploads</li>
            <li className="flex items-center gap-1.5">✓ Free, no account</li>
          </ul>
        </Container>
      </section>

      <section aria-labelledby="categories-heading" className="pt-14">
        <Container>
          <h2
            id="categories-heading"
            className="mb-6 text-2xl font-semibold text-slate-900 dark:text-white"
          >
            Browse by category
          </h2>
          <ul className="flex flex-wrap gap-3">
            {getAvailableHubs().map((hub) => (
              <li key={hub.slug}>
                <Link
                  href={`/${hub.slug}`}
                  className="inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-blue-800 dark:hover:bg-blue-950/30"
                >
                  {hub.shortTitle}
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section id="tools" className="py-14">
        <Container>
          <h2 className="mb-6 text-2xl font-semibold text-slate-900 dark:text-white">
            All tools
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tools.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </div>
        </Container>
      </section>

      <section className="border-t border-slate-200 py-14 dark:border-slate-800">
        <Container>
          <div className="mx-auto max-w-2xl space-y-4 text-slate-600 dark:text-slate-300">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
              Free tools that respect your privacy
            </h2>
            <p>
              {SITE.name} brings together the everyday tools you need — image compression, QR
              code generation, finance calculators, unit converters and more — in one fast, free
              place. Every tool runs entirely in your browser, which means your files and data
              never leave your device. No sign-up, no uploads, no tracking of what you work on.
            </p>
            <p>
              Whether you are compressing a photo for an online exam form, calculating your home
              loan EMI, or generating a QR code for your business, you get instant results without
              sending anything to a server. That keeps things fast and your data private by design.
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
