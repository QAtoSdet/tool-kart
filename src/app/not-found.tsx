import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { getAvailableTools } from "@/lib/tools";
import { SITE } from "@/lib/site";

/**
 * Custom 404 page. Instead of the generic Next.js error, visitors see the site
 * branding, a clear message, and the full tool grid so they can find what they
 * were looking for instead of bouncing.
 */
export default function NotFound() {
  const tools = getAvailableTools();
  return (
    <Container className="py-16">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-6xl font-bold text-slate-200 dark:text-slate-800">404</p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Page not found
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-300">
          The page you&apos;re looking for doesn&apos;t exist or may have moved. Try one of our
          free tools below, or head back to the homepage.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex h-11 items-center justify-center rounded-lg bg-blue-600 px-5 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
        >
          Back to home
        </Link>
      </div>

      <div className="mt-14">
        <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">
          Browse our tools
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <Link key={tool.slug} href={`/tools/${tool.slug}`} className="group block h-full">
              <Card className="h-full transition-shadow group-hover:shadow-md">
                <div className="flex items-start gap-3">
                  <span aria-hidden className="text-2xl">
                    {tool.icon}
                  </span>
                  <div>
                    <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 dark:text-white">
                      {tool.name}
                    </h3>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                      {tool.description}
                    </p>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      <p className="mt-10 text-center text-sm text-slate-500 dark:text-slate-400">
        {SITE.name} — {SITE.tagline}
      </p>
    </Container>
  );
}
