import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { ItemListJsonLd } from "@/components/seo/ItemListJsonLd";
import { buildMetadata } from "@/components/seo/metadata";
import { getAvailableGuides, getGuidesByCategory } from "@/lib/guides";
import { SITE } from "@/lib/site";

export const metadata: Metadata = buildMetadata({
  title: "Guides — Learn How the Tools Work",
  description:
    "Clear, practical guides on EMI, GST, image compression and more, written for Indian users. Learn how it works, then use the free tool.",
  path: "/guides",
});

export default function GuidesPage() {
  const groups = getGuidesByCategory();
  const guides = getAvailableGuides();

  return (
    <>
      <ItemListJsonLd
        items={guides.map((g) => ({ name: g.title, path: `/guides/${g.slug}` }))}
      />
      <Container className="py-10">
        <header className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Guides
          </h1>
          <p className="mt-2 max-w-2xl text-slate-600 dark:text-slate-300">
            Plain-English explainers for the tools on {SITE.name} — how the maths works, what the
            rules mean, and how to use them for real Indian situations. Read the guide, then run the
            tool.
          </p>
        </header>

        {groups.map((group) => (
          <section key={group.category} className="mb-12">
            <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">
              {group.category}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {group.guides.map((guide) => (
                <Link
                  key={guide.slug}
                  href={`/guides/${guide.slug}`}
                  className="group block h-full"
                >
                  <Card className="h-full transition-shadow group-hover:shadow-md">
                    <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 dark:text-white">
                      {guide.title}
                    </h3>
                    <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-400">
                      {guide.description}
                    </p>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </Container>
    </>
  );
}
