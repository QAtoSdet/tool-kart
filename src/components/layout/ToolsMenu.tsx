"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { Tool } from "@/lib/tools";

/**
 * Desktop "Tools" dropdown. Keeps the header compact and scalable no matter how
 * many tools exist (listing every tool inline overflowed the bar). Accessible:
 * closes on outside click and Escape, with aria-expanded state.
 */
export function ToolsMenu({ tools }: { tools: Tool[] }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1 rounded-md px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
      >
        Tools
        <span aria-hidden className={"text-xs transition-transform " + (open ? "rotate-180" : "")}>
          ▾
        </span>
      </button>

      {open ? (
        <div className="absolute right-0 top-full mt-1 w-64 rounded-lg border border-slate-200 bg-white p-2 shadow-lg dark:border-slate-700 dark:bg-slate-900">
          <ul className="max-h-[70vh] overflow-auto">
            {tools.map((tool) => (
              <li key={tool.slug}>
                <Link
                  href={`/tools/${tool.slug}`}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm text-slate-700 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  <span aria-hidden className="text-base">
                    {tool.icon}
                  </span>
                  {tool.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
