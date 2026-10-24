import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { MobileNav } from "@/components/layout/MobileNav";
import { ToolsMenu } from "@/components/layout/ToolsMenu";
import { SITE } from "@/lib/site";
import { getAvailableTools } from "@/lib/tools";

export function Header() {
  const tools = getAvailableTools();
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-700 dark:bg-slate-900/90">
      <Container className="flex h-14 items-center justify-between gap-4">
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold text-slate-900 dark:text-white"
        >
          <span aria-hidden className="text-lg">🧰</span>
          <span>{SITE.name}</span>
        </Link>

        {/* Desktop nav: a compact set of links + a Tools dropdown that scales
            no matter how many tools exist. */}
        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          <ToolsMenu tools={tools} />
          <Link
            href="/about"
            className="rounded-md px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
          >
            About
          </Link>
          <Link
            href="/contact"
            className="rounded-md px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
          >
            Contact
          </Link>
        </nav>

        <MobileNav tools={tools} />
      </Container>
    </header>
  );
}
