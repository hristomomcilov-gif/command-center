import { describe, expect, it } from "vitest";
import { composeHomeView } from "./compose";
import { HOME_LIMITS } from "./limits";
import { atLocalTime, dayPeriod, formatDate, formatTime, isWeekend, zonedTimeToUtc } from "./time";
import type { CalendarEventSource, HomeSources, PrioritySource } from "./types";
import { weatherKindFromCode, weatherLabel } from "./weather-codes";

const tz = "America/Toronto";

function at(hour: number, minute: number, day = 7) {
  return zonedTimeToUtc(2026, 10, day, hour, minute, tz);
}

function event(
  now: Date,
  id: string,
  title: string,
  hour: number,
  minute: number,
  durationMinutes: number,
  color = "#6f93c7",
  dayOffset = 0,
): CalendarEventSource {
  const start = atLocalTime(now, tz, hour, minute, dayOffset);
  return {
    id,
    title,
    start: start.toISOString(),
    end: new Date(start.getTime() + durationMinutes * 60 * 1000).toISOString(),
    color,
  };
}

function priority(partial: Partial<PrioritySource> & Pick<PrioritySource, "id" | "title">): PrioritySource {
  return {
    context: null,
    projectId: null,
    projectName: null,
    href: `/priorities/${partial.id}`,
    pinned: false,
    personal: false,
    importance: "normal",
    dueOn: null,
    completed: false,
    ...partial,
  };
}

function sources(now: Date, overrides: Partial<HomeSources> = {}): HomeSources {
  const base: HomeSources = {
    profile: {
      firstName: "Chris",
      timezone: tz,
      locationLabel: "Barrie",
      latitude: 44.3894,
      longitude: -79.6903,
    },
    weather: {
      temperatureC: 8.2,
      kind: "partly-cloudy",
      label: "Partly cloudy",
      sunsetLabel: "6:48 PM",
      eveningTemperatureC: 5,
      precipitationLater: false,
      hours: [],
    },
    events: [
      event(now, "appointment", "Appointment", 9, 30, 45, "#6f93c7"),
      event(now, "review", "Teamulate review", 11, 0, 45, "#e0a15a"),
      event(now, "pickup", "Pick up Dani", 14, 30, 45, "#8d78c9"),
    ],
    tomorrowFirst: event(now, "tomorrow", "Morning block", 9, 0, 60, "#6f93c7", 1),
    priorities: [
      priority({ id: "prepare", title: "Prepare Wave 2 tools for review", context: "Best first move today.", pinned: true, importance: "focus" }),
      priority({ id: "finish", title: "Finish Wave 2 review" }),
      priority({ id: "vo", title: "Record Singularity Drive VO" }),
      priority({ id: "quote", title: "Send contractor quote" }),
      priority({ id: "archive", title: "Reorganize the archive" }),
    ],
    emails: [
      { id: "news", sender: "Digest", subject: "Weekly", context: null, receivedAt: new Date(now.getTime() - 3600_000).toISOString(), href: "/inbox/news", kind: "newsletter", symbol: "document" },
      { id: "promo", sender: "Offers", subject: "Upgrade", context: null, receivedAt: new Date(now.getTime() - 1800_000).toISOString(), href: "/inbox/promo", kind: "promotion", symbol: "document" },
      { id: "sarah", sender: "Sarah", subject: "Re: the proposal", context: "Replied to your proposal", receivedAt: new Date(now.getTime() - 2 * 3600_000).toISOString(), href: "/inbox/sarah", kind: "reply", symbol: "person" },
      { id: "cal", sender: "Calendar", subject: "Schedule change for tomorrow", context: "Schedule change for tomorrow", receivedAt: new Date(now.getTime() - 5 * 3600_000).toISOString(), href: "/inbox/cal", kind: "schedule", symbol: "calendar" },
      { id: "pay", sender: "Invoice", subject: "Payment confirmation", context: "Payment confirmation", receivedAt: new Date(now.getTime() - 26 * 3600_000).toISOString(), href: "/inbox/pay", kind: "awareness", symbol: "document" },
      { id: "receipt", sender: "Store", subject: "Receipt", context: null, receivedAt: new Date(now.getTime() - 4 * 3600_000).toISOString(), href: "/inbox/receipt", kind: "receipt", symbol: "document" },
    ],
    news: [
      { id: "ai", category: "AI", headline: "New agent workflow breakthrough", whyItMatters: "Could improve autonomous execution.", source: "Field notes", publishedAt: now.toISOString(), href: "/for-you/ai", topics: ["ai"] },
      { id: "car", category: "Tesla / Autonomy", headline: "FSD update expands testing", whyItMatters: "Worth watching for real-world rollout.", source: "Field notes", publishedAt: now.toISOString(), href: "/for-you/car", topics: ["autonomy"] },
      { id: "space", category: "Space / Future", headline: "Starship milestone reached", whyItMatters: "Signals progress for heavy launch cadence.", source: "Field notes", publishedAt: now.toISOString(), href: "/for-you/space", topics: ["space"] },
      { id: "dup", category: "AI", headline: "New agent workflow breakthrough", whyItMatters: "Same story again.", source: "Field notes", publishedAt: now.toISOString(), href: "/for-you/dup", topics: ["ai"] },
      { id: "celeb", category: "Culture", headline: "A celebrity appearance makes the rounds", whyItMatters: null, source: "Field notes", publishedAt: now.toISOString(), href: "/for-you/celeb", topics: ["celebrity"] },
    ],
    topics: ["ai", "autonomy", "space"],
    attention: [],
  };
  return { ...base, ...overrides };
}

describe("local time", () => {
  it("formats a Barrie morning without shifting the clock", () => {
    const now = at(8, 14);
    expect(formatTime(now, tz)).toBe("8:14 AM");
    expect(formatDate(now, tz)).toBe("Wednesday, October 7");
    expect(dayPeriod(now, tz)).toBe("morning");
    expect(isWeekend(now, tz)).toBe(false);
    expect(dayPeriod(at(13, 5), tz)).toBe("afternoon");
    expect(dayPeriod(at(17, 0), tz)).toBe("evening");
    expect(isWeekend(at(9, 0, 10), tz)).toBe(true);
  });
});

describe("composeHomeView", () => {
  it("builds the calm morning briefing and keeps every cap", () => {
    const now = at(8, 14);
    const view = composeHomeView(sources(now), now);

    expect(view.greeting).toBe("Good morning, Chris.");
    expect(view.dateLabel).toBe("Wednesday, October 7");
    expect(view.timeLabel).toBe("8:14 AM");
    expect(view.heroMessage).toBe("You have some room this morning.");
    expect(view.weather?.summary).toBe("8°C · Partly cloudy · Barrie");
    expect(view.primary?.title).toBe("Prepare Wave 2 tools for review");
    expect(view.primary?.context).toBe("Best first move today.");
    expect(view.priorities.map((item) => item.title)).toEqual([
      "Finish Wave 2 review",
      "Record Singularity Drive VO",
      "Send contractor quote",
    ]);
    expect(view.events.map((item) => `${item.timeLabel} ${item.title}`)).toEqual([
      "9:30 Appointment",
      "11:00 Teamulate review",
      "14:30 Pick up Dani",
    ]);
    expect(view.clearWindow).toEqual({ name: "Clear", timeLabel: "11:45–14:00" });
    expect(view.emails.map((item) => item.sender)).toEqual(["Sarah", "Calendar", "Invoice"]);
    expect(view.emails.map((item) => item.timeLabel)).toEqual(["2h ago", "5h ago", "Yesterday"]);
    expect(view.news.map((item) => item.headline)).toEqual([
      "New agent workflow breakthrough",
      "FSD update expands testing",
      "Starship milestone reached",
    ]);
    expect(view.attention).toBeNull();
    expect(view.thought).toBe("Move the important things forward. The rest can wait.");
    expect(view.later).toBe("Sunset 6:48 PM · Cooler this evening");
    expect(view.primary ? 1 : 0).toBeLessThanOrEqual(HOME_LIMITS.startHere);
    expect(view.priorities).toHaveLength(HOME_LIMITS.priorities);
    expect(view.emails.length).toBeLessThanOrEqual(HOME_LIMITS.emails);
    expect(view.news.length).toBeLessThanOrEqual(HOME_LIMITS.news);
    expect(view.events.length).toBeLessThanOrEqual(HOME_LIMITS.events);
  });

  it("never lets a noisy source overflow the page", () => {
    const now = at(8, 14);
    const manyEmails = Array.from({ length: 8 }, (_, index) => ({
      id: `mail-${index}`,
      sender: `Person ${index}`,
      subject: "Needs a reply",
      context: "Needs a reply",
      receivedAt: new Date(now.getTime() - index * 60000).toISOString(),
      href: `/inbox/mail-${index}`,
      kind: "reply" as const,
      symbol: "person" as const,
    }));
    const manyNews = Array.from({ length: 6 }, (_, index) => ({
      id: `story-${index}`,
      category: "AI",
      headline: `Distinct signal number ${index} today`,
      whyItMatters: "Worth a quiet look.",
      source: "Field notes",
      publishedAt: now.toISOString(),
      href: `/for-you/story-${index}`,
      topics: ["ai"],
    }));
    const manyEvents = Array.from({ length: 8 }, (_, index) =>
      event(now, `slot-${index}`, `Block ${index}`, 8 + index, 0, 30),
    );
    const view = composeHomeView(
      sources(now, {
        emails: manyEmails,
        news: manyNews,
        events: manyEvents,
        attention: [
          { id: "a", title: "One thing", context: null, href: null },
          { id: "b", title: "Another", context: null, href: null },
        ],
      }),
      now,
    );
    expect(view.emails).toHaveLength(3);
    expect(view.news).toHaveLength(3);
    expect(view.events.length).toBeLessThanOrEqual(5);
    expect(view.attention?.title).toBe("One thing");
    expect(view.priorities).toHaveLength(3);
  });

  it("speaks more quietly in the evening and on an open morning", () => {
    const evening = at(18, 40);
    const eveningView = composeHomeView(sources(evening), evening);
    expect(eveningView.greeting).toBe("Good evening, Chris.");
    expect(eveningView.heroMessage).toBe("The day is winding down.");
    expect(eveningView.thought).toBe("The day is winding down. Tomorrow can hold the rest.");
    expect(eveningView.later).toContain("Tomorrow starts at 9:00 AM");

    const openNow = at(8, 0);
    const openView = composeHomeView(
      sources(openNow, { events: [event(openNow, "late", "Review", 11, 0, 390)] }),
      openNow,
    );
    expect(openView.heroMessage).toBe("Your morning is open until 11:00.");
    expect(openView.clearWindow).toEqual({ name: "Open", timeLabel: "Until 11:00" });
  });

  it("names a long opening without calling the afternoon morning", () => {
    const now = at(11, 50);
    const view = composeHomeView(sources(now), now);
    expect(view.heroMessage).toBe("You are open until 14:30.");
  });

  it("does not pretend there is room when a meeting is underway", () => {
    const now = at(11, 10);
    const view = composeHomeView(sources(now), now);
    expect(view.heroMessage).toBe("A few things matter today. Nothing needs rushing.");
    expect(view.events.find((item) => item.title === "Appointment")?.passed).toBe(true);
  });

  it("counts two remaining priorities in the afternoon without turning them into a score", () => {
    const now = at(15, 30);
    const view = composeHomeView(
      sources(now, {
        priorities: [
          priority({ id: "one", title: "Prepare the notes", pinned: true }),
          priority({ id: "two", title: "Send the quote" }),
        ],
        events: [],
      }),
      now,
    );
    expect(view.heroMessage).toBe("Two important things remain today.");
    expect(view.clearWindow).toBeNull();
    expect(view.empty.calendar).toBe("Your day is open.");
  });

  it("keeps a weekend to what is genuinely important", () => {
    const now = at(9, 0, 10);
    const view = composeHomeView(
      sources(now, {
        priorities: [
          priority({ id: "prepare", title: "Prepare Wave 2 tools for review", pinned: true }),
          priority({ id: "finish", title: "Finish Wave 2 review" }),
          priority({ id: "walk", title: "Walk with Dani", personal: true }),
        ],
      }),
      now,
    );
    expect(view.weekend).toBe(true);
    expect(view.greeting).toBe("Good morning, Chris.");
    expect(view.heroMessage).toBe("A quieter morning. There is room to move slowly.");
    expect(view.primary?.title).toBe("Prepare Wave 2 tools for review");
    expect(view.priorities.map((item) => item.title)).toEqual(["Walk with Dani"]);
    expect(view.thought).toBe("You have some room today. Let it stay unhurried.");
  });

  it("stays whole when weather and priorities are missing", () => {
    const now = at(8, 14);
    const view = composeHomeView(sources(now, { weather: null, priorities: [], news: [], emails: [] }), now);
    expect(view.weather).toBeNull();
    expect(view.primary).toBeNull();
    expect(view.priorities).toEqual([]);
    expect(view.news).toEqual([]);
    expect(view.emails).toEqual([]);
    expect(view.later).toBeNull();
    expect(view.empty.primary).toBe("Nothing pressing right now. You have room to choose.");
    expect(view.empty.email).toBe("Nothing needs your attention right now.");
    expect(view.greeting).toBe("Good morning, Chris.");
  });
});

describe("weather codes", () => {
  it("maps forecast codes to calm labels", () => {
    expect(weatherKindFromCode(0)).toBe("clear");
    expect(weatherKindFromCode(2)).toBe("partly-cloudy");
    expect(weatherKindFromCode(3)).toBe("cloudy");
    expect(weatherKindFromCode(63)).toBe("rain");
    expect(weatherKindFromCode(71)).toBe("snow");
    expect(weatherKindFromCode(95)).toBe("storm");
    expect(weatherLabel("partly-cloudy")).toBe("Partly cloudy");
  });
});
