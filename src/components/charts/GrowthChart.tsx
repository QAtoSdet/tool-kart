import { compactINR, labelIndices, niceCeil } from "@/lib/chart";

export interface GrowthSeries {
  name: string;
  /** Tailwind stroke class for the line, e.g. "stroke-blue-600". */
  strokeClass: string;
  /** Optional Tailwind fill class to shade the area under this line. */
  fillClass?: string;
  /** Tailwind background class for the legend swatch. */
  swatchClass: string;
  dashed?: boolean;
}

export interface GrowthPoint {
  /** Position on the x axis, e.g. elapsed years. */
  x: number;
  /** One value per series. */
  values: number[];
}

/**
 * Line/area chart for values growing over time. The SVG stretches to the container
 * (preserveAspectRatio="none") with non-scaling strokes, while axis labels are HTML so they stay
 * legible on small screens. The whole chart is one labelled image for screen readers.
 */
export function GrowthChart({
  points,
  series,
  summary,
  formatX,
}: {
  points: GrowthPoint[];
  series: GrowthSeries[];
  summary: string;
  formatX: (x: number) => string;
}) {
  if (points.length === 0) return null;
  // Every series starts from zero at x = 0.
  const all = [{ x: 0, values: series.map(() => 0) }, ...points];
  const xMax = all[all.length - 1].x || 1;
  const top = niceCeil(Math.max(...all.flatMap((p) => p.values)));
  const px = (x: number) => (x / xMax) * 100;
  const py = (v: number) => 100 - (Math.max(0, v) / top) * 100;
  const xLabels = labelIndices(all.length, 6).map((i) => all[i]);

  return (
    <figure className="space-y-3">
      <div className="flex gap-2" role="img" aria-label={summary}>
        <div className="flex h-44 w-12 shrink-0 flex-col justify-between text-right text-[11px] text-slate-500 dark:text-slate-400" aria-hidden>
          <span>{compactINR(top)}</span>
          <span>{compactINR(top / 2)}</span>
          <span>₹0</span>
        </div>
        <div className="min-w-0 flex-1" aria-hidden>
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="block h-44 w-full overflow-visible border-b border-l border-slate-300 dark:border-slate-600"
          >
            <line x1="0" x2="100" y1="0" y2="0" className="stroke-slate-200 dark:stroke-slate-700" strokeDasharray="3 3" vectorEffect="non-scaling-stroke" />
            <line x1="0" x2="100" y1="50" y2="50" className="stroke-slate-200 dark:stroke-slate-700" strokeDasharray="3 3" vectorEffect="non-scaling-stroke" />
            {series.map((s, si) => {
              const line = all.map((p) => `${px(p.x)},${py(p.values[si])}`).join(" ");
              return (
                <g key={s.name}>
                  {s.fillClass ? (
                    <polygon points={`0,100 ${line} ${px(xMax)},100`} className={s.fillClass} />
                  ) : null}
                  <polyline
                    points={line}
                    fill="none"
                    strokeWidth={2.5}
                    strokeLinejoin="round"
                    strokeDasharray={s.dashed ? "6 4" : undefined}
                    vectorEffect="non-scaling-stroke"
                    className={s.strokeClass}
                  />
                </g>
              );
            })}
          </svg>
          <div className="relative mt-1 h-4 text-[11px] text-slate-500 dark:text-slate-400">
            {xLabels.map((p, i) => (
              <span
                key={p.x}
                className="absolute whitespace-nowrap"
                style={{
                  left: `${px(p.x)}%`,
                  transform: i === 0 ? "none" : i === xLabels.length - 1 ? "translateX(-100%)" : "translateX(-50%)",
                }}
              >
                {formatX(p.x)}
              </span>
            ))}
          </div>
        </div>
      </div>
      <ul className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-slate-700 dark:text-slate-200" aria-hidden>
        {series.map((s) => (
          <li key={s.name} className="flex items-center gap-2">
            <span className={`inline-block h-[3px] w-4 rounded ${s.swatchClass}`} />
            {s.name}
          </li>
        ))}
      </ul>
    </figure>
  );
}
