"use client";

/**
 * A button that smooth-scrolls to an element by id WITHOUT adding a hash to the
 * URL (so the address bar stays clean). Falls back to a plain scroll if the
 * target isn't found. Keyboard/focus accessible like any button.
 */
export function ScrollToButton({
  targetId,
  className,
  children,
}: {
  targetId: string;
  className?: string;
  children: React.ReactNode;
}) {
  const handleClick = () => {
    const el = document.getElementById(targetId);
    if (!el) return;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    el.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "start" });
    // Move focus to the target for accessibility, without the browser jumping.
    el.setAttribute("tabindex", "-1");
    el.focus({ preventScroll: true });
  };

  return (
    <button type="button" onClick={handleClick} className={className}>
      {children}
    </button>
  );
}
