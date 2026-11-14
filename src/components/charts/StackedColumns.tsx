import { compactINR, labelIndices, niceCeil } from "@/lib/chart";
import { formatINR } from "@/lib/sip";

export interface ColumnSeries {
  name: string;
  /** Tailwind background class. */
  colorClass: string;
}

export interface Column {
  label: string;
  /** One value per series, stacked bottom-up in series order. */
  values: number[];
}

/**
 * Stacked column chart drawn with HTML boxes rather than SVG, so axis text stays crisp and
 * readable at phone widths. The chart is one labelled image for screen readers; the exact numbers
 * live in the accompanying table.
 */
export function StackedColumns({
  columns,
  series,
  summary,
  maxXLabels = 6,
}: {
  columns: Column[];
  series: ColumnSeries[];
  /** Plain-language description of what the chart shows (read by screen readers). */
  summary: string;
  maxXLabels?: number;
}) {
  if (columns.length === 0) return null;
  const top = niceCeil(Math.max(...columns.map((c) => c.values.reduce((s, v) => s + v, 0))));
  const shown = labelIndices(columns.length, maxXLabels);
  const n = columns.length;
  // Thinner gaps for long loans, so 30 narrow bars don't turn into stripes on a phone.
  const gap = n > 15 ? "gap-px px-px" : "gap-[2px] px-[2px]";

  return (
    <figure className="space-y-3">
      <div className="flex gap-2" role="img" aria-label={summary}>
        {/* Y axis */}
        <div className="flex h-44 w-12 shrink-0 flex-col justify-between text-right text-[11px] text-slate-500 dark:text-slate-400" aria-hidden>
          <span>{compactINR(top)}</span>
          <span>{compactINR(top / 2)}</span>
          <span>₹0</span>
        </div>
        <div className="min-w-0 flex-1" aria-hidden>
          <div className="relative h-44 border-b border-l border-slate-300 dark:border-slate-600">
            <div className="pointer-events-none absolute inset-x-0 top-0 border-t border-dashed border-slate-200 dark:border-slate-700" />
            <div className="pointer-events-none absolute inset-x-0 top-1/2 border-t border-dashed border-slate-200 dark:border-slate-700" />
            <div className={`absolute inset-0 flex items-end ${gap}`}>
              {columns.map((c) => (
                <div
                  key={c.label}
                  className="flex h-full min-w-0 flex-1 flex-col-reverse"
                  title={`${c.label}: ${c.values.map((v, i) => `${series[i].name} ${formatINR(v)}`).join(", ")}`}
                >
                  {c.values.map((v, i) => (
                    <div
                      key={series[i].name}
                      className={series[i].colorClass}
                      style={{ height: `${(Math.max(0, v) / top) * 100}%` }}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
          {/* Labels sit under their column's centre; the first and last are pinned to the edges
              so they can't be clipped by the card. */}
          <div className="relative mt-1 h-4 text-[11px] text-slate-500 dark:text-slate-400">
            {shown.map((i, k) => {
              const edge = k === 0 && n > 1 ? "first" : k === shown.length - 1 && n > 1 ? "last" : "mid";
              return (
                <span
                  key={columns[i].label}
                  className="absolute whitespace-nowrap"
                  style={
                    edge === "first"
                      ? { left: 0 }
                      : edge === "last"
                        ? { right: 0 }
                        : { left: `${((i + 0.5) / n) * 100}%`, transform: "translateX(-50%)" }
                  }
                >
                  {columns[i].label}
                </span>
              );
            })}
          </div>
        </div>
      </div>
      <ul className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-slate-700 dark:text-slate-200" aria-hidden>
        {series.map((s) => (
          <li key={s.name} className="flex items-center gap-2">
            <span className={`inline-block h-3 w-3 rounded-sm ${s.colorClass}`} />
            {s.name}
          </li>
        ))}
      </ul>
    </figure>
  );
}
