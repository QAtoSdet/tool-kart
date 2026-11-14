/**
 * Fill "{name}" placeholders in a label template, e.g. fill("Make it under {kb} KB", { kb: 50 }).
 * Widgets take label templates as plain strings (not functions) because server pages pass them to
 * client components, and only plain data can cross that boundary.
 */
export function fill(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (m, key: string) => (key in vars ? String(vars[key]) : m));
}
