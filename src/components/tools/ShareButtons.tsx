"use client";

import { useState } from "react";
import { SITE } from "@/lib/site";

/**
 * Social share buttons for tool pages. Encourages free distribution —
 * especially via WhatsApp, which is the dominant sharing channel in India.
 *
 * Renders nothing during SSR/build (the URL is constructed client-side from the
 * current location), so it adds no crawlable noise.
 */
export interface ShareLabels {
  heading: string;
  copyLink: string;
  copied: string;
}

const ENGLISH_SHARE_LABELS: ShareLabels = { heading: "Share this tool", copyLink: "Copy link", copied: "Copied!" };

export function ShareButtons({
  title,
  path,
  labels = ENGLISH_SHARE_LABELS,
}: {
  title: string;
  path: string;
  labels?: ShareLabels;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const url = `${SITE.url.replace(/\/$/, "")}${path}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API not available — ignore silently.
    }
  };

  const shareUrl = `${SITE.url.replace(/\/$/, "")}${path}`;
  const shareText = `${title} — ${SITE.name}`;
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;

  return (
    <section aria-labelledby="share-heading" className="mt-8 border-t border-slate-200 pt-6 dark:border-slate-700">
      <h2 id="share-heading" className="mb-3 text-sm font-semibold text-slate-900 dark:text-white">
        {labels.heading}
      </h2>
      <div className="flex flex-wrap items-center gap-2">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:border-green-300 hover:bg-green-50 hover:text-green-700 dark:border-slate-700 dark:text-slate-300 dark:hover:border-green-800 dark:hover:bg-green-950/20 dark:hover:text-green-300"
        >
          <span aria-hidden>💬</span> WhatsApp
        </a>
        <a
          href={twitterUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:border-slate-400 hover:bg-slate-100 hover:text-slate-900 dark:border-slate-700 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:bg-slate-800 dark:hover:text-white"
        >
          <span aria-hidden>𝕏</span> Twitter
        </a>
        <button
          onClick={handleCopy}
          type="button"
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:border-slate-400 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:bg-slate-800 dark:hover:text-white"
        >
          <span aria-hidden>{copied ? "✓" : "🔗"}</span> {copied ? labels.copied : labels.copyLink}
        </button>
      </div>
    </section>
  );
}
