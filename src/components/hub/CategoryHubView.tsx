import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ItemListJsonLd } from "@/components/seo/ItemListJsonLd";
import { getAvailableTools } from "@/lib/tools";
import type { CategoryHub } from "@/lib/categories";

/**
 * Shared rendering for a category hub page. Lists the tools in the hub's
 * category as cards (which link to the tools) and emits an `ItemList` so search
 * engines understand the category's content map. Used by every hub route so the
 * markup is identical and adding a hub needs no new component code.
 */
export function CategoryHubView({ hub }: { hub: CategoryHub }) {
  const tools = getAvailableTools().filter((t) => t.category === hub.category);
  const hubPath = `/${hub.slug}`;

  return (
    <>
      <ItemListJsonLd
        items={tools.map((t) => ({ name: t.name, path: `/tools/${t.slug}` }))}
      />
      <Container className="py-10">
        <Breadcrumbs
          items={[{ name: "Home", href: "/" }, { name: hub.shortTitle, href: hubPath }]}
        />
        <header className="mb-8 mt-4">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            {hub.title}
          </h1>
          <p className="mt-2 max-w-2xl text-slate-600 dark:text-slate-300">{hub.intro}</p>
        </header>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <Link key={tool.slug} href={`/tools/${tool.slug}`} className="group block h-full">
              <Card className="h-full transition-shadow group-hover:shadow-md">
                <div className="flex items-start gap-3">
                  <span aria-hidden className="text-2xl">
                    {tool.icon}
                  </span>
                  <div>
                    <h2 className="font-semibold text-slate-900 group-hover:text-blue-600 dark:text-white">
                      {tool.name}
                    </h2>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                      {tool.description}
                    </p>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </Container>
    </>
  );
}
