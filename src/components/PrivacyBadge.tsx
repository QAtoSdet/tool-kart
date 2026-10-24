import Link from "next/link";

/**
 * "Private by design" badge shown on every tool page.
 *
 * The claim it makes is accurate by construction: the tools in this app process
 * data entirely in the browser, so inputs/files are never uploaded or stored by us.
 * The only data collected is standard ads/analytics usage data, disclosed in the
 * privacy policy — which is exactly what the copy here says, so we never overclaim.
 */
export function PrivacyBadge({ processedInBrowser = true }: { processedInBrowser?: boolean }) {
  return (
    <div className="flex items-start gap-2 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-900 dark:border-green-900/50 dark:bg-green-950/40 dark:text-green-200">
      <span aria-hidden className="mt-0.5">
        🔒
      </span>
      <p>
        <span className="font-semibold">Private by design.</span>{" "}
        {processedInBrowser ? (
          <>
            Everything runs in your browser — your data is never uploaded to or stored on our
            servers.
          </>
        ) : (
          <>We don&apos;t store the data you enter here.</>
        )}{" "}
        <Link href="/privacy" className="font-medium underline underline-offset-2">
          How we handle data
        </Link>
      </p>
    </div>
  );
}
