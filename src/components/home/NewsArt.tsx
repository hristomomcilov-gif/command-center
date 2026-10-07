import { useId } from "react";

type ArtKind = "ai" | "road" | "launch" | "general";

function artKind(category: string): ArtKind {
  const value = category.toLowerCase();
  if (value.includes("ai") || value.includes("agent")) return "ai";
  if (value.includes("tesla") || value.includes("autonom") || value.includes("robot")) return "road";
  if (value.includes("space") || value.includes("star")) return "launch";
  return "general";
}

export function NewsArt({ category }: { category: string }) {
  const id = useId().replace(/:/g, "");
  const kind = artKind(category);

  return (
    <svg className="news-art" viewBox="0 0 160 112" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      {kind === "ai" ? <AiArt id={id} /> : null}
      {kind === "road" ? <RoadArt id={id} /> : null}
      {kind === "launch" ? <LaunchArt id={id} /> : null}
      {kind === "general" ? <GeneralArt id={id} /> : null}
    </svg>
  );
}

function AiArt({ id }: { id: string }) {
  return (
    <>
      <defs>
        <linearGradient id={`${id}-bg`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#d9e4f2" />
          <stop offset="1" stopColor="#b9c6de" />
        </linearGradient>
      </defs>
      <rect width="160" height="112" fill={`url(#${id}-bg)`} />
      <circle cx="78" cy="58" r="28" fill="#eef3f8" />
      <path d="M62 70c4-16 12-24 22-26 8 6 12 16 12 28" fill="#c9d5e6" />
      <circle cx="86" cy="54" r="3" fill="#6d84a8" />
      <g fill="none" stroke="#7f96b8" strokeWidth="1.2">
        <circle cx="112" cy="36" r="3" />
        <circle cx="124" cy="52" r="2.2" />
        <circle cx="108" cy="70" r="2.4" />
        <path d="M90 52h19M96 66l10 6" />
      </g>
    </>
  );
}

function RoadArt({ id }: { id: string }) {
  return (
    <>
      <defs>
        <linearGradient id={`${id}-bg`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f6dcc0" />
          <stop offset="0.5" stopColor="#e7c7a4" />
          <stop offset="1" stopColor="#8b9aaa" />
        </linearGradient>
      </defs>
      <rect width="160" height="112" fill={`url(#${id}-bg)`} />
      <path d="M0 74h160v38H0z" fill="#5f6b76" />
      <path d="M70 74v38" stroke="#f6f1e8" strokeWidth="3" strokeDasharray="8 8" />
      <g transform="translate(38 46)">
        <path d="M14 28h58c4 0 8-3 9-7l4-8c1-2-1-4-3-4H28l-8 8c-3 3-4 7-4 11z" fill="#f8f6f2" />
        <path d="M30 14h26c2 0 4 1 5 3l6 11H24l4-12c.4-1 2-2 2-2z" fill="#d5dee8" />
        <circle cx="30" cy="32" r="6" fill="#2c3642" />
        <circle cx="30" cy="32" r="2.4" fill="#d7dde4" />
        <circle cx="68" cy="32" r="6" fill="#2c3642" />
        <circle cx="68" cy="32" r="2.4" fill="#d7dde4" />
      </g>
    </>
  );
}

function LaunchArt({ id }: { id: string }) {
  return (
    <>
      <defs>
        <linearGradient id={`${id}-bg`} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#f0c48a" />
          <stop offset="0.45" stopColor="#e7b7c4" />
          <stop offset="1" stopColor="#8ea4c8" />
        </linearGradient>
      </defs>
      <rect width="160" height="112" fill={`url(#${id}-bg)`} />
      <path d="M0 86c30-16 70-8 110-20 20-6 36-4 50 2v44H0z" fill="#d9896a" opacity="0.35" />
      <g transform="translate(74 18)">
        <path d="M8 8c8-10 16-10 16 6v46H8z" fill="#f7f5f1" />
        <path d="M8 42 0 58h8zM24 42l8 16h-8z" fill="#e4e0da" />
        <path d="M12 70c2 10 8 16 8 16s2-8 0-16z" fill="#f2d2a4" />
        <circle cx="16" cy="24" r="3" fill="#8ea4c8" />
      </g>
    </>
  );
}

function GeneralArt({ id }: { id: string }) {
  return (
    <>
      <defs>
        <linearGradient id={`${id}-bg`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ead9c4" />
          <stop offset="1" stopColor="#c9d5cf" />
        </linearGradient>
      </defs>
      <rect width="160" height="112" fill={`url(#${id}-bg)`} />
      <circle cx="112" cy="36" r="14" fill="#fff6ea" />
      <path d="M0 78c40-18 70-8 110-22 24-8 36-6 50 0v56H0z" fill="#8eaa9d" opacity="0.7" />
    </>
  );
}
