import {
  ATTENTION_LEAD,
  DEFAULT_FOCUS_CONTEXT,
  EMPTY_COPY,
  greetingFor,
  heroLine,
  laterLine,
  thoughtFor,
} from "./copy";
import { eveningNote } from "./weather-codes";
import { HOME_LIMITS } from "./limits";
import {
  atLocalTime,
  dateKey,
  dayPeriod,
  formatDate,
  formatRelative,
  formatScheduleTime,
  formatTime,
  isWeekend,
  zonedParts,
} from "./time";
import type {
  AttentionSource,
  CalendarEventSource,
  EmailKind,
  EmailSource,
  HomeClearWindow,
  HomeSources,
  HomeViewModel,
  NewsSource,
  PrioritySource,
} from "./types";

const GLANCE_KINDS = new Set<EmailKind>([
  "reply",
  "decision",
  "action",
  "schedule",
  "personal",
  "awareness",
]);

const DAY_START_HOUR = 8;
const DAY_END_HOUR = 18;
const MIN_GAP_MS = 45 * 60 * 1000;
const CLEAR_CUSHION_MS = 30 * 60 * 1000;

function scorePriority(task: PrioritySource, today: string): number {
  let score = 0;
  if (task.pinned) score += 100;
  if (task.dueOn === today) score += 40;
  if (task.importance === "focus") score += 20;
  return score;
}

function rankPriorities(tasks: PrioritySource[], today: string): PrioritySource[] {
  return tasks
    .filter((task) => !task.completed)
    .map((task, index) => ({ task, index, score: scorePriority(task, today) }))
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .map((entry) => entry.task);
}

function selectPriorities(tasks: PrioritySource[], today: string, weekend: boolean) {
  const ranked = rankPriorities(tasks, today);
  const pool = weekend
    ? ranked.filter((task) => task.pinned || task.personal || task.dueOn === today)
    : ranked;
  return {
    primary: pool[0] ?? null,
    secondary: pool.slice(HOME_LIMITS.startHere, HOME_LIMITS.startHere + HOME_LIMITS.priorities),
  };
}

export function isGlanceEmail(kind: EmailKind): boolean {
  return GLANCE_KINDS.has(kind);
}

function selectEmails(emails: EmailSource[], now: Date) {
  return emails
    .filter((email) => isGlanceEmail(email.kind))
    .sort((a, b) => new Date(b.receivedAt).getTime() - new Date(a.receivedAt).getTime())
    .slice(0, HOME_LIMITS.emails)
    .map((email) => ({
      id: email.id,
      sender: email.sender,
      subject: email.subject,
      context: email.context,
      timeLabel: formatRelative(new Date(email.receivedAt), now),
      href: email.href,
      symbol: email.symbol,
    }));
}

function headlineKey(headline: string): string {
  return headline
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .split(" ")
    .slice(0, 4)
    .join(" ");
}

function selectNews(items: NewsSource[], topics: string[], now: Date, timeZone: string) {
  const interested = items.filter((item) => item.topics.some((topic) => topics.includes(topic)));
  const pool = interested.length > 0 ? interested : items;
  const seen = new Set<string>();
  const picked: NewsSource[] = [];
  for (const item of pool) {
    const key = headlineKey(item.headline);
    if (seen.has(key)) continue;
    seen.add(key);
    picked.push(item);
    if (picked.length === HOME_LIMITS.news) break;
  }
  return picked.map((item) => ({
    id: item.id,
    category: item.category,
    headline: item.headline,
    whyItMatters: item.whyItMatters,
    source: item.source,
    publishedLabel: item.publishedAt ? publishedLabel(item.publishedAt, now, timeZone) : null,
    href: item.href,
  }));
}

function publishedLabel(iso: string, now: Date, timeZone: string): string {
  const published = new Date(iso);
  if (dateKey(published, timeZone) === dateKey(now, timeZone)) return "Today";
  return formatDate(published, timeZone);
}

function selectEvents(events: CalendarEventSource[], now: Date, timeZone: string) {
  const sorted = [...events].sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
  const upcoming = sorted.filter((event) => new Date(event.end).getTime() > now.getTime());
  const past = sorted.filter((event) => new Date(event.end).getTime() <= now.getTime());
  const chosen =
    upcoming.length >= HOME_LIMITS.events
      ? upcoming.slice(0, HOME_LIMITS.events)
      : [...past.slice(-(HOME_LIMITS.events - upcoming.length)), ...upcoming];
  return chosen
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
    .map((event) => ({
      id: event.id,
      title: event.title,
      timeLabel: formatScheduleTime(new Date(event.start), timeZone),
      color: event.color,
      href: `/calendar#${event.id}`,
      passed: new Date(event.end).getTime() <= now.getTime(),
    }));
}

function findClearWindow(
  events: CalendarEventSource[],
  now: Date,
  timeZone: string,
): HomeClearWindow | null {
  if (events.length === 0) return null;
  const startBound = atLocalTime(now, timeZone, DAY_START_HOUR, 0).getTime();
  const endBound = atLocalTime(now, timeZone, DAY_END_HOUR, 0).getTime();
  if (now.getTime() >= endBound) return null;

  const blocks = events
    .map((event) => ({
      start: new Date(event.start).getTime(),
      end: new Date(event.end).getTime(),
    }))
    .filter((event) => event.end > startBound && event.start < endBound)
    .sort((a, b) => a.start - b.start);

  const gaps: { start: number; end: number }[] = [];
  let cursor = startBound;
  for (const block of blocks) {
    const blockStart = Math.max(block.start, startBound);
    const blockEnd = Math.min(block.end, endBound);
    if (blockStart > cursor) gaps.push({ start: cursor, end: blockStart });
    if (blockEnd > cursor) cursor = blockEnd;
  }
  if (cursor < endBound) gaps.push({ start: cursor, end: endBound });

  const useful = gaps.filter((gap) => gap.end - gap.start >= MIN_GAP_MS && gap.end > now.getTime());
  if (useful.length === 0) return null;
  useful.sort((a, b) => b.end - b.start - (a.end - a.start) || a.start - b.start);
  const best = useful[0];
  if (!best) return null;

  const open = best.start === startBound;
  let displayEnd = best.end;
  if (!open && best.end < endBound - 1000 && best.end - best.start - CLEAR_CUSHION_MS >= MIN_GAP_MS) {
    displayEnd = best.end - CLEAR_CUSHION_MS;
  }
  if (displayEnd <= now.getTime()) return null;

  const endLabel = formatScheduleTime(new Date(displayEnd), timeZone);
  if (open) return { name: "Open", timeLabel: `Until ${endLabel}` };
  const startLabel = formatScheduleTime(new Date(best.start), timeZone);
  return { name: "Clear", timeLabel: `${startLabel}–${endLabel}` };
}

function selectAttention(items: AttentionSource[]): HomeViewModel["attention"] {
  const item = items[0];
  if (!item) return null;
  return {
    lead: ATTENTION_LEAD,
    id: item.id,
    title: item.title,
    context: item.context,
    href: item.href,
  };
}

export function composeHomeView(sources: HomeSources, now: Date): HomeViewModel {
  const { timezone, firstName, locationLabel } = sources.profile;
  const period = dayPeriod(now, timezone);
  const weekend = isWeekend(now, timezone);
  const today = dateKey(now, timezone);
  const focus = selectPriorities(sources.priorities, today, weekend);
  const events = selectEvents(sources.events, now, timezone);
  const remainingEvents = sources.events.filter((event) => new Date(event.end).getTime() > now.getTime());
  const nextStart = sources.events
    .map((event) => new Date(event.start))
    .filter((start) => start.getTime() > now.getTime())
    .sort((a, b) => a.getTime() - b.getTime())[0];
  const inProgress = sources.events.some((event) => {
    const start = new Date(event.start).getTime();
    const end = new Date(event.end).getTime();
    return start <= now.getTime() && end > now.getTime();
  });
  const prioritiesRemaining = (focus.primary ? 1 : 0) + focus.secondary.length;
  const tone = {
    period,
    weekend,
    eventCount: sources.events.length,
    remainingEvents: remainingEvents.length,
    minutesUntilFirst: nextStart ? Math.round((nextStart.getTime() - now.getTime()) / 60000) : null,
    firstEventLabel: nextStart ? formatScheduleTime(nextStart, timezone) : null,
    nextEventHour: nextStart ? zonedParts(nextStart, timezone).hour : null,
    inProgress,
    prioritiesRemaining,
  };
  const weather = sources.weather;
  const tomorrowAt = sources.tomorrowFirst
    ? formatTime(new Date(sources.tomorrowFirst.start), timezone)
    : null;

  return {
    generatedAt: now.toISOString(),
    timezone,
    period,
    weekend,
    greeting: greetingFor(period, firstName),
    dateLabel: formatDate(now, timezone),
    timeLabel: formatTime(now, timezone),
    heroMessage: heroLine(tone),
    weather: weather
      ? {
          temperatureLabel: `${Math.round(weather.temperatureC)}°C`,
          summary: [`${Math.round(weather.temperatureC)}°C`, weather.label, locationLabel]
            .filter(Boolean)
            .join(" · "),
          kind: weather.kind,
          locationLabel,
        }
      : null,
    primary: focus.primary
      ? {
          id: focus.primary.id,
          title: focus.primary.title,
          context: focus.primary.context ?? DEFAULT_FOCUS_CONTEXT,
          href: focus.primary.href,
          projectName: focus.primary.projectName,
        }
      : null,
    events,
    clearWindow: findClearWindow(sources.events, now, timezone),
    priorities: focus.secondary.map((task) => ({
      id: task.id,
      title: task.title,
      href: task.href,
    })),
    news: selectNews(sources.news, sources.topics, now, timezone),
    emails: selectEmails(sources.emails, now),
    attention: selectAttention(sources.attention.slice(0, HOME_LIMITS.attention)),
    thought: thoughtFor({ period, weekend, eventCount: sources.events.length }),
    later: laterLine({
      period,
      sunset: weather?.sunsetLabel ?? null,
      evening: eveningNote(weather),
      tomorrowAt,
    }),
    empty: EMPTY_COPY,
  };
}
