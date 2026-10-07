import { atLocalTime } from "../time";
import type { CalendarEventSource, EmailSource, HomeSources } from "../types";
import {
  attentionRecords,
  calendarTemplates,
  emailTemplates,
  homeProfile,
  newsRecords,
  priorityRecords,
  topicPreferences,
} from "./temporary-state";
import { getWeather } from "./weather";

function buildEvents(now: Date): { events: CalendarEventSource[]; tomorrowFirst: CalendarEventSource | null } {
  const built = calendarTemplates.map((template) => {
    const start = atLocalTime(now, homeProfile.timezone, template.hour, template.minute, template.dayOffset);
    const end = new Date(start.getTime() + template.durationMinutes * 60 * 1000);
    return {
      id: template.id,
      title: template.title,
      start: start.toISOString(),
      end: end.toISOString(),
      color: template.color,
      dayOffset: template.dayOffset,
    };
  });
  const events = built
    .filter((event) => event.dayOffset === 0)
    .map((event) => ({
      id: event.id,
      title: event.title,
      start: event.start,
      end: event.end,
      color: event.color,
    }));
  const tomorrow = built.find((event) => event.dayOffset === 1);
  return {
    events,
    tomorrowFirst: tomorrow
      ? {
          id: tomorrow.id,
          title: tomorrow.title,
          start: tomorrow.start,
          end: tomorrow.end,
          color: tomorrow.color,
        }
      : null,
  };
}

function buildEmails(now: Date): EmailSource[] {
  return emailTemplates.map((template) => ({
    id: template.id,
    sender: template.sender,
    subject: template.subject,
    context: template.context,
    receivedAt: new Date(now.getTime() - template.hoursAgo * 60 * 60 * 1000).toISOString(),
    href: `/inbox/${template.id}`,
    kind: template.kind,
    symbol: template.symbol,
  }));
}

export async function loadHomeSources(now = new Date()): Promise<HomeSources> {
  const weather = await getWeather();
  const calendar = buildEvents(now);
  return {
    profile: homeProfile,
    weather,
    events: calendar.events,
    tomorrowFirst: calendar.tomorrowFirst,
    priorities: priorityRecords,
    emails: buildEmails(now),
    news: newsRecords.map((item) => ({
      ...item,
      publishedAt: item.publishedAt ?? now.toISOString(),
    })),
    topics: topicPreferences,
    attention: attentionRecords,
  };
}
