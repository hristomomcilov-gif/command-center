"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Icon } from "@/components/icons";
import type { HomePriority } from "@/lib/home/types";

const STORAGE_KEY = "teamulate-home-done";

export function ThreeThingsCard({ items, empty }: { items: HomePriority[]; empty: string }) {
  const [done, setDone] = useState<string[]>([]);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as unknown;
      if (Array.isArray(parsed) && parsed.every((item) => typeof item === "string")) {
        setDone(parsed);
      }
    } catch {
      // A corrupted local note should not disturb the day.
    }
  }, []);

  function toggle(id: string) {
    setDone((current) => {
      const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }

  return (
    <section className="panel three" aria-labelledby="three-title">
      <div className="section-head">
        <span className="section-icon sage" aria-hidden="true">
          <Icon name="check" />
        </span>
        <h2 id="three-title">Three things for today</h2>
      </div>
      {items.length === 0 ? (
        <p className="empty">{empty}</p>
      ) : (
        <ul className="thing-list">
          {items.map((item) => {
            const complete = done.includes(item.id);
            return (
              <li key={item.id} className={complete ? "thing is-done" : "thing"}>
                <button
                  type="button"
                  className="tick"
                  aria-pressed={complete}
                  aria-label={complete ? `Bring back ${item.title}` : `Mark ${item.title} done`}
                  onClick={() => toggle(item.id)}
                >
                  <span className="tick-ring">{complete ? <Icon name="check" size={14} /> : null}</span>
                </button>
                <Link href={item.href}>{item.title}</Link>
              </li>
            );
          })}
        </ul>
      )}
      {items.length > 0 ? <Plant /> : null}
    </section>
  );
}

function Plant() {
  return (
    <svg className="plant" viewBox="0 0 220 180" aria-hidden="true">
      <ellipse cx="150" cy="168" rx="46" ry="8" fill="#d9c7ae" opacity="0.45" />
      <path d="M132 168c2-28 8-46 18-78" fill="none" stroke="#7f9a84" strokeWidth="2" />
      <path d="M150 150c18-8 34-6 48 6-20 4-34 2-48-6z" fill="#c5d2c2" />
      <path d="M148 132c-22-6-36 4-42 18 18 2 32-2 42-18z" fill="#aebfae" />
      <path d="M154 118c20-16 42-12 52 4-22 8-38 6-52-4z" fill="#d7e3d4" />
      <path d="M146 104c-8-22-2-40 14-52-2 22-4 36-14 52z" fill="#8eaa8e" />
      <rect x="128" y="150" width="36" height="22" rx="6" fill="#efe4d4" />
      <rect x="124" y="146" width="44" height="8" rx="3" fill="#e4d5c0" />
    </svg>
  );
}
