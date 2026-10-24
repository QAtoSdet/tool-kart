import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SITE } from "@/lib/site";
import { getAvailableTools } from "@/lib/tools";

const legalLinks = [
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms" },
];

export function Footer() {
  const tools = getAvailableTools();
  return (
    <footer className="mt-16 border-t border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900">
      <Container className="grid gap-8 py-10 sm:grid-cols-2 md:grid-cols-3">
        <div>
          <p className="font-semibold text-slate-900 dark:text-white">{SITE.name}</p>
          <p className="mt-2 max-w-xs text-sm text-slate-600 dark:text-slate-400">
            {SITE.tagline}. Everything runs in your browser — your files never leave your device.
          </p>
        </div>
        <nav aria-label="Tools">
          <p className="text-sm font-semibold text-slate-900 dark:text-white">Tools</p>
          <ul className="mt-3 space-y-2">
            {tools.map((tool) => (
              <li key={tool.slug}>
                <Link
                  href={`/tools/${tool.slug}`}
                  className="text-sm text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                >
                  {tool.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Site">
          <p className="text-sm font-semibold text-slate-900 dark:text-white">Site</p>
          <ul className="mt-3 space-y-2">
            {legalLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </Container>
      <div className="border-t border-slate-200 py-4 dark:border-slate-700">
        <Container>
          <p className="text-center text-xs text-slate-500 dark:text-slate-400">
            © {new Date().getFullYear()} {SITE.name}. All tools are free to use.
          </p>
        </Container>
      </div>
    </footer>
  );
}
