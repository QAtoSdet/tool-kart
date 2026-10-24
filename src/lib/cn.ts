/**
 * Minimal className combiner. Filters out falsy values and joins with spaces.
 * Keeps the bundle tiny (no clsx/tailwind-merge dependency).
 */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}
