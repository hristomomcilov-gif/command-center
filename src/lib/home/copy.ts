import type { DayPeriod } from "./types";

export const EMPTY_COPY = {
  primary: "Nothing pressing right now. You have room to choose.",
  calendar: "Your day is open.",
  priorities: "Nothing else is asking for you.",
  email: "Nothing needs your attention right now.",
} as const;

export const ATTENTION_LEAD = "One thing may need your attention today.";

export const DEFAULT_FOCUS_CONTEXT = "Best first move today.";

export type ToneInput = {
  period: DayPeriod;
  weekend: boolean;
  eventCount: number;
  remainingEvents: number;
  minutesUntilFirst: number | null;
  firstEventLabel: string | null;
  nextEventHour: number | null;
  inProgress: boolean;
  prioritiesRemaining: number;
};

export function greetingFor(period: DayPeriod, name: string): string {
  return `Good ${period}, ${name}.`;
}

export function heroLine(input: ToneInput): string {
  const {
    period,
    weekend,
    eventCount,
    remainingEvents,
    minutesUntilFirst,
    firstEventLabel,
    nextEventHour,
    inProgress,
    prioritiesRemaining,
  } = input;

  if (period === "evening") {
    return weekend ? "The evening is yours." : "The day is winding down.";
  }

  if (weekend) {
    return period === "morning"
      ? "A quieter morning. There is room to move slowly."
      : "A quieter day. Keep only what matters.";
  }

  if (period === "morning") {
    if (
      !inProgress &&
      minutesUntilFirst !== null &&
      minutesUntilFirst >= 90 &&
      firstEventLabel
    ) {
      if (nextEventHour !== null && nextEventHour < 12) {
        return `Your morning is open until ${firstEventLabel}.`;
      }
      return `You are open until ${firstEventLabel}.`;
    }
    if (eventCount >= 5) return "A full morning. The gaps are worth protecting.";
    if (inProgress || (minutesUntilFirst !== null && minutesUntilFirst <= 20)) {
      return "A few things matter today. Nothing needs rushing.";
    }
    if (eventCount <= 3) return "You have some room this morning.";
    return "A few things matter today. Nothing needs rushing.";
  }

  if (remainingEvents >= 4) return "A meeting-heavy afternoon. The gaps still belong to you.";
  if (prioritiesRemaining === 1) return "One important thing remains today.";
  if (prioritiesRemaining === 2) return "Two important things remain today.";
  if (prioritiesRemaining >= 3) return "A few important things remain today.";
  if (remainingEvents === 0) return "Your afternoon is fairly open.";
  return "A few things matter today. Nothing needs rushing.";
}

export function thoughtFor(input: { period: DayPeriod; weekend: boolean; eventCount: number }): string {
  if (input.period === "evening") {
    return "The day is winding down. Tomorrow can hold the rest.";
  }
  if (input.weekend) {
    return "You have some room today. Let it stay unhurried.";
  }
  if (input.eventCount >= 5) {
    return "A meeting-heavy day. Protect the gaps between them.";
  }
  if (input.eventCount <= 1) {
    return "You have some room today. A good day for deeper work.";
  }
  return "Move the important things forward. The rest can wait.";
}

export function laterLine(input: {
  period: DayPeriod;
  sunset: string | null;
  evening: string | null;
  tomorrowAt: string | null;
}): string | null {
  const parts: string[] = [];
  if (input.sunset) parts.push(`Sunset ${input.sunset}`);
  if (input.evening) parts.push(input.evening);
  if (input.period === "evening" && input.tomorrowAt) {
    parts.push(`Tomorrow starts at ${input.tomorrowAt}`);
  }
  return parts.length ? parts.join(" · ") : null;
}
