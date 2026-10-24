import { Container } from "@/components/ui/Container";

/** Shared layout for legal/info pages: a readable, centered article column. */
export function LegalPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated?: string;
  children: React.ReactNode;
}) {
  return (
    <Container className="py-10">
      <article className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          {title}
        </h1>
        {updated ? (
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Last updated: {updated}</p>
        ) : null}
        <div className="mt-6 space-y-4 text-slate-700 dark:text-slate-300 [&_a]:text-blue-600 [&_a]:underline [&_h2]:mt-8 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-slate-900 dark:[&_h2]:text-white [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-6">
          {children}
        </div>
      </article>
    </Container>
  );
}
