"use client";

import { useId, useState, type PointerEvent } from "react";

function points(values: number[], width: number, height: number, max: number, pad = 1) {
  const span = Math.max(values.length - 1, 1);
  return values.map((value, index) => {
    const x = pad + (index / span) * (width - pad * 2);
    const y = pad + (1 - value / max) * (height - pad * 2);
    return [x, y] as const;
  });
}

function line(values: number[], width: number, height: number, max: number, pad = 1) {
  return points(values, width, height, max, pad)
    .map(([x, y], index) => `${index === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`)
    .join(" ");
}

export function Sparkline({
  values,
  tone,
}: {
  values: number[];
  tone: "blue" | "green" | "violet" | "gold" | "cyan";
}) {
  if (values.length < 2) return null;
  const peak = Math.max(...values);
  const flat = peak === Math.min(...values);
  if (flat) {
    return (
      <svg className={`spark spark-${tone}`} viewBox="0 0 96 36" width="88" height="34" aria-hidden="true">
        <path className="spark-line" d="M2 18 H94" />
      </svg>
    );
  }
  const max = Math.max(peak, 1);
  const d = line(values, 96, 36, max, 2);
  const area = `${d} L94 34 L2 34 Z`;
  return (
    <svg className={`spark spark-${tone}`} viewBox="0 0 96 36" width="88" height="34" aria-hidden="true">
      <path className="spark-area" d={area} />
      <path className="spark-line" d={d} />
    </svg>
  );
}

const plot = { width: 560, height: 168, left: 32, right: 8, top: 12, bottom: 22 };

export function TrafficChart({
  labels,
  current,
  previous,
}: {
  labels: string[];
  current: number[];
  previous: number[];
}) {
  const gradientId = useId().replace(/:/g, "");
  const [hover, setHover] = useState<number | null>(null);
  const max = 80;
  const innerW = plot.width - plot.left - plot.right;
  const innerH = plot.height - plot.top - plot.bottom;
  const toPoint = (values: number[]) =>
    values.map((value, index) => {
      const x = plot.left + (index / Math.max(values.length - 1, 1)) * innerW;
      const y = plot.top + (1 - value / max) * innerH;
      return [x, y] as const;
    });
  const currentPts = toPoint(current);
  const previousPts = toPoint(previous);
  const currentLine = currentPts
    .map(([x, y], index) => `${index === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`)
    .join(" ");
  const previousLine = previousPts
    .map(([x, y], index) => `${index === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`)
    .join(" ");
  const area = `${currentLine} L${currentPts.at(-1)?.[0].toFixed(1)} ${plot.height - plot.bottom} L${currentPts[0]?.[0].toFixed(1)} ${plot.height - plot.bottom} Z`;
  const ticks = [0, 25, 50, 75];
  const labelEvery = labels.length > 8 ? 4 : 1;

  function choose(event: PointerEvent<SVGSVGElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * plot.width;
    const index = Math.round(((x - plot.left) / innerW) * (current.length - 1));
    setHover(Math.max(0, Math.min(current.length - 1, index)));
  }

  const active = hover == null ? null : currentPts[hover];

  return (
    <div className="traffic-chart">
      <svg
        viewBox={`0 0 ${plot.width} ${plot.height}`}
        role="img"
        aria-label="Website sessions by day. This period rises through late September, then eases into October. The previous period stays lower."
        onPointerMove={choose}
        onPointerLeave={() => setHover(null)}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6aa7ff" stopOpacity="0.38" />
            <stop offset="100%" stopColor="#6aa7ff" stopOpacity="0" />
          </linearGradient>
        </defs>
        {ticks.map((tick) => {
          const y = plot.top + (1 - tick / max) * innerH;
          return (
            <g key={tick}>
              <line x1={plot.left} x2={plot.width - plot.right} y1={y} y2={y} className="chart-grid" />
              <text x={0} y={y + 3} className="chart-tick">
                {tick}
              </text>
            </g>
          );
        })}
        <path d={area} fill={`url(#${gradientId})`} />
        <path d={previousLine} className="chart-previous" />
        <path d={currentLine} className="chart-current" />
        {active ? (
          <>
            <line
              x1={active[0]}
              x2={active[0]}
              y1={plot.top}
              y2={plot.height - plot.bottom}
              className="chart-guide"
            />
            <circle cx={active[0]} cy={active[1]} r="3.5" className="chart-dot" />
          </>
        ) : null}
        {labels.map((label, index) => {
          if (index % labelEvery !== 0 && index !== labels.length - 1) return null;
          const x = currentPts[index]?.[0] ?? 0;
          const anchor = index === 0 ? "start" : index === labels.length - 1 ? "end" : "middle";
          return (
            <text key={label} x={x} y={plot.height - 4} textAnchor={anchor} className="chart-tick">
              {label}
            </text>
          );
        })}
      </svg>
      {hover != null ? (
        <p className="chart-tip" style={{ left: `${(currentPts[hover][0] / plot.width) * 100}%` }}>
          <strong>{labels[hover]}</strong>
          <span>{current[hover]} this period</span>
          <span>{previous[hover]} previous</span>
        </p>
      ) : null}
    </div>
  );
}

export function RankBars({ values }: { values: number[] }) {
  const max = Math.max(...values, 1);
  const width = 76;
  const height = 96;
  const barW = 12;
  const gap = 6;
  const total = values.length * barW + (values.length - 1) * gap;
  const start = (width - total) / 2;
  return (
    <svg className="rank-bars" viewBox={`0 0 ${width} ${height}`} width={width} height={height} aria-hidden="true">
      {values.map((value, index) => {
        const barH = Math.max((value / max) * (height - 8), 6);
        return (
          <rect
            key={index}
            x={start + index * (barW + gap)}
            y={height - 2 - barH}
            width={barW}
            height={barH}
            rx="3"
          />
        );
      })}
    </svg>
  );
}
