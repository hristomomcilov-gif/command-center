import { useId, type ReactNode } from "react";
import type { WeatherKind } from "@/lib/home/types";

export type IconName =
  | "home"
  | "people"
  | "spark"
  | "board"
  | "user"
  | "calendar"
  | "mail"
  | "folder"
  | "settings"
  | "chevron"
  | "sun"
  | "cloud"
  | "cloud-sun"
  | "rain"
  | "snow"
  | "fog"
  | "menu"
  | "close"
  | "check"
  | "doc"
  | "star"
  | "leaf"
  | "arrow";

const glyphs: Record<IconName, ReactNode> = {
  home: (
    <>
      <path d="M4.5 11.2 12 4.8l7.5 6.4" />
      <path d="M7 10.4V19h10v-8.6" />
    </>
  ),
  people: (
    <>
      <circle cx="9" cy="9" r="2.2" />
      <circle cx="15.2" cy="9.4" r="1.8" />
      <path d="M4.8 18.2c.6-2.4 2.3-3.6 4.2-3.6s3.6 1.2 4.2 3.6" />
      <path d="M13.2 14.8c1.5-.3 3 .4 3.8 2.2" />
    </>
  ),
  spark: (
    <>
      <path d="M12 3.5 13.4 9 19 10.5 13.4 12 12 17.5 10.6 12 5 10.5 10.6 9z" />
    </>
  ),
  board: (
    <>
      <rect x="4" y="4.5" width="16" height="15" rx="2" />
      <path d="M8 4.5v15M4 9.5h16" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8.5" r="2.6" />
      <path d="M6.2 18.4c.8-2.8 2.8-4.2 5.8-4.2s5 1.4 5.8 4.2" />
    </>
  ),
  calendar: (
    <>
      <rect x="4" y="5.5" width="16" height="14" rx="2" />
      <path d="M8 3.8v3.2M16 3.8v3.2M4 10h16" />
    </>
  ),
  mail: (
    <>
      <rect x="3.8" y="6" width="16.4" height="12" rx="2" />
      <path d="m4.5 7.5 7.5 6 7.5-6" />
    </>
  ),
  folder: (
    <>
      <path d="M3.8 8.2V17a2 2 0 0 0 2 2h12.4a2 2 0 0 0 2-2V9.2a2 2 0 0 0-2-2H12L10.2 5.5H5.8a2 2 0 0 0-2 2.7z" />
    </>
  ),
  settings: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 3.8v2.1M12 18.1v2.1M4.6 7.2l1.8 1.1M17.6 15.7l1.8 1.1M4.6 16.8l1.8-1.1M17.6 8.3l1.8-1.1" />
    </>
  ),
  chevron: <path d="m9 6 6 6-6 6" />,
  sun: (
    <>
      <circle cx="12" cy="12" r="3.2" />
      <path d="M12 3.6v1.8M12 18.6v1.8M3.6 12h1.8M18.6 12h1.8M6.1 6.1l1.3 1.3M16.6 16.6l1.3 1.3M17.9 6.1l-1.3 1.3M7.4 16.6l-1.3 1.3" />
    </>
  ),
  cloud: (
    <g fill="currentColor" stroke="none">
      <circle cx="9" cy="13.2" r="3.1" />
      <circle cx="13.4" cy="11.4" r="4" />
      <circle cx="17" cy="13.6" r="2.7" />
      <rect x="6.4" y="12.6" width="12.2" height="4.2" rx="2" />
    </g>
  ),
  "cloud-sun": (
    <>
      <g fill="currentColor" stroke="none">
        <circle cx="8" cy="8" r="2.3" />
        <circle cx="10.2" cy="14.2" r="2.6" />
        <circle cx="14.2" cy="12.6" r="3.3" />
        <circle cx="17.4" cy="14.6" r="2.2" />
        <rect x="8.2" y="13.4" width="10.4" height="3.4" rx="1.6" />
      </g>
      <path d="M8 3.6v1.4M4.2 8H5.6M5.2 5.2l1 .9" />
    </>
  ),
  rain: (
    <>
      <g fill="currentColor" stroke="none">
        <circle cx="9" cy="11" r="2.8" />
        <circle cx="13.2" cy="9.4" r="3.5" />
        <circle cx="16.6" cy="11.4" r="2.4" />
        <rect x="6.6" y="10.4" width="11.4" height="3.4" rx="1.6" />
      </g>
      <path d="M9 16.2 8.2 19M12.4 16.2 11.6 19M15.6 16.2 14.8 19" />
    </>
  ),
  snow: (
    <>
      <g fill="currentColor" stroke="none">
        <circle cx="9" cy="10.4" r="2.8" />
        <circle cx="13.2" cy="8.8" r="3.5" />
        <circle cx="16.6" cy="10.8" r="2.4" />
        <rect x="6.6" y="9.8" width="11.4" height="3.4" rx="1.6" />
      </g>
      <path d="M9 16v2.4M8 17.2h2M12.5 16v2.4M11.5 17.2h2M15.8 16v2.4M14.8 17.2h2" />
    </>
  ),
  fog: (
    <>
      <path d="M5 10h14M4 13.5h16M6 17h12" />
    </>
  ),
  menu: (
    <>
      <path d="M4 7.5h16M4 12h16M4 16.5h16" />
    </>
  ),
  close: (
    <>
      <path d="m7 7 10 10M17 7 7 17" />
    </>
  ),
  check: <path d="m6.5 12.5 3.4 3.4 7.6-8" />,
  doc: (
    <>
      <path d="M8 3.8h5.2L19 9.2V19a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 7 19V5.3A1.5 1.5 0 0 1 8.5 3.8z" />
      <path d="M13 3.8V9h5.2M9.5 13h5M9.5 16h4" />
    </>
  ),
  star: <path d="m12 4 1.7 4.2 4.6.4-3.5 3 1.1 4.5L12 13.8 8.1 16.1 9.2 11.6 5.7 8.6l4.6-.4z" />,
  leaf: (
    <>
      <path d="M5 19s1.2-7.5 7.2-11.2C16.8 5.2 19.5 4.5 19.5 4.5 19.5 4.5 18.2 8 16 11.2 13.2 15.2 8.5 17.5 5 19z" />
      <path d="M9 14.5c1.2-1.4 2.6-2.6 4.2-3.5" />
    </>
  ),
  arrow: <path d="M6 12h12M13 7l5 5-5 5" />,
};

export function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {glyphs[name]}
    </svg>
  );
}

export function WeatherGlyph({ kind, size = 18 }: { kind: WeatherKind; size?: number }) {
  const name: IconName =
    kind === "clear"
      ? "sun"
      : kind === "partly-cloudy"
        ? "cloud-sun"
        : kind === "rain" || kind === "storm"
          ? "rain"
          : kind === "snow"
            ? "snow"
            : kind === "fog"
              ? "fog"
              : "cloud";
  return <Icon name={name} size={size} />;
}

export function Mark({ size = 36 }: { size?: number }) {
  const id = `mark${useId().replace(/:/g, "")}`;
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" aria-hidden="true" className="mark">
      <defs>
        <linearGradient id={id} x1="6" y1="2" x2="30" y2="34" gradientUnits="userSpaceOnUse">
          <stop stopColor="#7fa4c6" />
          <stop offset="1" stopColor="#2d4c68" />
        </linearGradient>
      </defs>
      <rect width="36" height="36" rx="11" fill={`url(#${id})`} />
      <path
        d="M11 22.2 18 11.6l7 10.6"
        fill="none"
        stroke="white"
        strokeWidth="2.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M14.2 22.2h7.6" stroke="white" strokeWidth="2.1" strokeLinecap="round" />
    </svg>
  );
}
