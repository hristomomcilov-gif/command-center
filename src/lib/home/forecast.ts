import type { HomeWeatherHour, WeatherHour, WeatherKind } from "./types";
import { dateKey, hourFromStamp, zonedParts } from "./time";
import { weatherKindFromCode, weatherLabel } from "./weather-codes";

export function upcomingHours(
  times: string[],
  temperatures: Array<number | undefined>,
  codes: Array<number | undefined>,
  rain: Array<number | undefined>,
  now: Date,
  timeZone: string,
): WeatherHour[] {
  const parts = zonedParts(now, timeZone);
  const key = `${dateKey(now, timeZone)}T${String(parts.hour).padStart(2, "0")}`;
  let start = times.findIndex((stamp) => stamp.startsWith(key));
  if (start < 0) start = times.findIndex((stamp) => stamp >= key);
  if (start < 0) start = 0;

  const hours: WeatherHour[] = [];
  for (let index = start; index < times.length && hours.length < 8; index += 1) {
    const temperatureC = temperatures[index];
    const code = codes[index];
    const stamp = times[index];
    if (!stamp || typeof temperatureC !== "number" || typeof code !== "number") continue;
    hours.push({
      at: stamp,
      temperatureC,
      kind: weatherKindFromCode(code),
      precipitationProbability: rain[index] ?? 0,
    });
  }
  return hours;
}

export function outlookFrom(hours: WeatherHour[], fallback: { temperatureC: number; kind: WeatherKind; rainLater: boolean }): HomeWeatherHour[] {
  const source =
    hours.length > 0
      ? hours
      : [
          {
            at: "now",
            temperatureC: fallback.temperatureC,
            kind: fallback.kind,
            precipitationProbability: fallback.rainLater ? 60 : 0,
          },
        ];

  return source.map((hour, index) => {
    const clock = hour.at === "now" ? null : hourFromStamp(hour.at);
    return {
      id: hour.at,
      shortLabel: index === 0 ? "Now" : String(clock),
      timeLabel: hour.at === "now" ? "Now" : `${clock}:00`,
      temperatureC: hour.temperatureC,
      temperatureLabel: `${Math.round(hour.temperatureC)}°C`,
      kind: hour.kind,
      condition: weatherLabel(hour.kind),
      rainLabel:
        hour.precipitationProbability >= 30 ? `${Math.round(hour.precipitationProbability)}% chance of rain` : null,
    };
  });
}
