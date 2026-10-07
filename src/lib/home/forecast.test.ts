import { describe, expect, it } from "vitest";
import { outlookFrom, upcomingHours } from "./forecast";
import { zonedTimeToUtc } from "./time";

const tz = "America/Toronto";

describe("upcoming hours", () => {
  it("starts at the current local hour and keeps the next stretch", () => {
    const now = zonedTimeToUtc(2026, 10, 7, 15, 10, tz);
    const times = ["2026-10-07T13:00", "2026-10-07T14:00", "2026-10-07T15:00", "2026-10-07T16:00"];
    const hours = upcomingHours(times, [10, 11, 12, 9], [1, 2, 61, 0], [0, 10, 40, 5], now, tz);
    expect(hours.map((hour) => hour.at)).toEqual(["2026-10-07T15:00", "2026-10-07T16:00"]);
    expect(hours[0]?.kind).toBe("rain");
    expect(outlookFrom(hours, { temperatureC: 12, kind: "rain", rainLater: true })[0]).toMatchObject({
      shortLabel: "Now",
      timeLabel: "15:00",
      rainLabel: "40% chance of rain",
    });
  });
});
