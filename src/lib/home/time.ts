import type { DayPeriod } from "./types";

type ZonedParts = {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  weekday: string;
};

export function zonedParts(date: Date, timeZone: string): ZonedParts {
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hourCycle: "h23",
    weekday: "short",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
  const bag: Record<string, string> = {};
  for (const part of fmt.formatToParts(date)) {
    if (part.type !== "literal") bag[part.type] = part.value;
  }
  let hour = Number(bag.hour);
  if (hour === 24) hour = 0;
  return {
    year: Number(bag.year),
    month: Number(bag.month),
    day: Number(bag.day),
    hour,
    minute: Number(bag.minute),
    weekday: bag.weekday ?? "",
  };
}

/** Wall-clock time in `timeZone`, returned as a UTC instant. */
export function zonedTimeToUtc(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  timeZone: string,
): Date {
  const guess = new Date(Date.UTC(year, month - 1, day, hour, minute, 0));
  const parts = zonedParts(guess, timeZone);
  const rendered = Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, 0);
  return new Date(guess.getTime() - (rendered - guess.getTime()));
}

function shiftCalendarDay(year: number, month: number, day: number, offset: number) {
  const next = new Date(Date.UTC(year, month - 1, day + offset));
  return {
    year: next.getUTCFullYear(),
    month: next.getUTCMonth() + 1,
    day: next.getUTCDate(),
  };
}

export function atLocalTime(base: Date, timeZone: string, hour: number, minute: number, dayOffset = 0): Date {
  const parts = zonedParts(base, timeZone);
  const shifted = shiftCalendarDay(parts.year, parts.month, parts.day, dayOffset);
  return zonedTimeToUtc(shifted.year, shifted.month, shifted.day, hour, minute, timeZone);
}

export function dayPeriod(date: Date, timeZone: string): DayPeriod {
  const { hour } = zonedParts(date, timeZone);
  if (hour < 12) return "morning";
  if (hour < 17) return "afternoon";
  return "evening";
}

export function isWeekend(date: Date, timeZone: string): boolean {
  const { weekday } = zonedParts(date, timeZone);
  return weekday === "Sat" || weekday === "Sun";
}

export function dateKey(date: Date, timeZone: string): string {
  const parts = zonedParts(date, timeZone);
  const month = String(parts.month).padStart(2, "0");
  const day = String(parts.day).padStart(2, "0");
  return `${parts.year}-${month}-${day}`;
}

export function formatTime(date: Date, timeZone: string): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

/** Compact schedule clock: 9:30, 14:30. */
export function formatScheduleTime(date: Date, timeZone: string): string {
  const parts = zonedParts(date, timeZone);
  return `${parts.hour}:${String(parts.minute).padStart(2, "0")}`;
}

export function formatDate(date: Date, timeZone: string): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone,
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(date);
}

export function formatRelative(from: Date, now: Date): string {
  const minutes = Math.round((now.getTime() - from.getTime()) / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days === 1) return "Yesterday";
  return `${days}d ago`;
}

/** Hour from an API local timestamp, as 0–23, without shifting zones. */
export function hourFromStamp(isoLocal: string): number {
  const hour = Number((isoLocal.split("T")[1] ?? "").slice(0, 2));
  return Number.isNaN(hour) ? 0 : hour;
}

/** Format an API local timestamp such as 2026-10-07T18:48 without shifting zones. */
export function formatWallClock(isoLocal: string): string {
  const time = isoLocal.split("T")[1] ?? "";
  const [hourText, minuteText] = time.split(":");
  const hour = Number(hourText);
  const minute = Number(minuteText);
  if (Number.isNaN(hour) || Number.isNaN(minute)) return isoLocal;
  const period = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12;
  return `${hour12}:${String(minute).padStart(2, "0")} ${period}`;
}
