"use client";

import { useState } from "react";
import Link from "next/link";
import type { Tool } from "@/lib/tools";

const legalLinks = [
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

/**
 * Mobile navigation: a hamburger button that opens an accessible slide-down
 * panel listing every tool plus key pages. Rendered only below the md breakpoint
 * (the parent hides it on desktop). Keeps full keyboard support and focus states.
 */
export function MobileNav({ tools }: { tools: Tool[] }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-10 w-10 items-center justify-center rounded-md text-slate-700 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:text-slate-200 dark:hover:bg-slate-800"
      >
        <span aria-hidden className="text-xl leading-none">
          {open ? "✕" : "☰"}
        </span>
      </button>

      {open ? (
        <div
          id="mobile-menu"
          className="absolute inset-x-0 top-14 z-40 border-b border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-900"
        >
          <nav aria-label="All tools" className="mx-auto max-w-5xl px-4 py-3">
            <p className="px-2 pb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Tools
            </p>
            <ul className="space-y-0.5">
              {tools.map((tool) => (
                <li key={tool.slug}>
                  <Link
                    href={`/tools/${tool.slug}`}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 rounded-md px-2 py-2.5 text-sm text-slate-700 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:text-slate-200 dark:hover:bg-slate-800"
                  >
                    <span aria-hidden className="text-base">
                      {tool.icon}
                    </span>
                    {tool.name}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="my-2 border-t border-slate-100 dark:border-slate-800" />
            <ul className="space-y-0.5">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-md px-2 py-2.5 text-sm text-slate-600 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      ) : null}
    </div>
  );
}
