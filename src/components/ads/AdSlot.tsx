"use client";

import { useEffect, useRef } from "react";
import { adsActive, ADSENSE_CLIENT, AD_UNIT_IDS } from "@/lib/ads";

/**
 * Switch-ready ad position.
 *
 * - Ads active (env flag on + client configured): renders the AdSense <ins> unit
 *   and pushes it to adsbygoogle so it fills.
 * - Dev, ads off: shows a dashed placeholder so slot positions are visible.
 * - Production, ads off (e.g. pre-approval): renders nothing (no empty boxes).
 *
 * Placement is controlled centrally (the shell decides where slots go), so
 * turning ads on requires only env changes, not edits to each page.
 */
export function AdSlot({
  slot,
  className,
}: {
  /** Logical slot name, e.g. "tool-top" or "tool-bottom". */
  slot: string;
  className?: string;
}) {
  const pushedRef = useRef(false);
  const active = adsActive();

  useEffect(() => {
    if (!active || pushedRef.current) return;
    try {
      // @ts-expect-error adsbygoogle is injected by the AdSense script.
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushedRef.current = true;
    } catch {
      // AdSense not ready yet; it will retry on next mount.
    }
  }, [active]);

  if (active) {
    const adSlotId = AD_UNIT_IDS[slot] || undefined;
    return (
      <ins
        className={"adsbygoogle block " + (className ?? "")}
        style={{ display: "block" }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={adSlotId}
        data-ad-format="auto"
        data-full-width-responsive="true"
        aria-hidden="true"
      />
    );
  }

  if (process.env.NODE_ENV === "production") {
    // Pre-approval: nothing rendered.
    return null;
  }

  // Dev placeholder so we can see where ads will appear.
  return (
    <div
      data-ad-slot={slot}
      className={
        "flex min-h-[90px] items-center justify-center rounded-md border border-dashed border-slate-300 text-xs text-slate-400 dark:border-slate-700 " +
        (className ?? "")
      }
    >
      Ad slot: {slot}
    </div>
  );
}
