import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { ScrollToButton } from "@/components/ScrollToButton";
import { getAvailableTools, type Tool } from "@/lib/tools";

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
  const tools = getAvailableTools();
  return (
    <>
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
    </>
  );
}
