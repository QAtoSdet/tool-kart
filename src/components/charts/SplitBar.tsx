import { formatINR } from "@/lib/sip";
import { percentOf } from "@/lib/chart";

export interface SplitSegment {
  label: string;
  value: number;
  /** Tailwind background class for the segment and its legend swatch. */
  colorClass: string;
}

/**
 * One horizontal bar split into proportional segments, with a legend that states the amounts and
 * percentages in text (so the information never depends on colour alone).
 */
export function SplitBar({ segments, label }: { segments: SplitSegment[]; label: string }) {
  const total = segments.reduce((s, x) => s + Math.max(0, x.value), 0);
  return (
    <figure className="space-y-3">
      <figcaption className="sr-only">{label}</figcaption>
      <div className="flex h-4 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800" aria-hidden>
        {segments.map((s) => (
          <div
            key={s.label}
            className={s.colorClass}
            style={{ width: `${total > 0 ? (Math.max(0, s.value) / total) * 100 : 0}%` }}
          />
        ))}
      </div>
      <ul className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-slate-700 dark:text-slate-200">
        {segments.map((s) => (
          <li key={s.label} className="flex items-center gap-2">
            <span aria-hidden className={`inline-block h-3 w-3 rounded-sm ${s.colorClass}`} />
            {s.label}: <strong>{formatINR(s.value)}</strong>
            <span className="text-slate-500 dark:text-slate-400">({percentOf(s.value, total)}%)</span>
          </li>
        ))}
      </ul>
    </figure>
  );
}
