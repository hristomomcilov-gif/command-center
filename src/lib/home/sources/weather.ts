import { cache } from "react";
import { dateKey } from "../time";
import { formatWallClock } from "../time";
import type { WeatherSnapshot } from "../types";
import { weatherKindFromCode, weatherLabel } from "../weather-codes";
import { homeProfile } from "./temporary-state";

type OpenMeteoResponse = {
  current?: { temperature_2m?: number; weather_code?: number };
  hourly?: {
    time?: string[];
    temperature_2m?: number[];
    precipitation_probability?: number[];
  };
  daily?: { sunset?: string[] };
};

function hourOf(stamp: string): number {
  const time = stamp.split("T")[1] ?? "";
  return Number(time.slice(0, 2));
}

/**
 * Live weather for the profile location.
 * Open-Meteo needs no key. A failure leaves Home intact without a weather line.
 */
export const getWeather = cache(async (): Promise<WeatherSnapshot | null> => {
  const { latitude, longitude, timezone } = homeProfile;
  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.searchParams.set("latitude", String(latitude));
  url.searchParams.set("longitude", String(longitude));
  url.searchParams.set("current", "temperature_2m,weather_code");
  url.searchParams.set("hourly", "temperature_2m,precipitation_probability");
  url.searchParams.set("daily", "sunset");
  url.searchParams.set("timezone", timezone);
  url.searchParams.set("forecast_days", "2");

  try {
    const response = await fetch(url, {
      signal: AbortSignal.timeout(2500),
      next: { revalidate: 1800 },
    });
    if (!response.ok) return null;
    const body = (await response.json()) as OpenMeteoResponse;
    const temperature = body.current?.temperature_2m;
    const code = body.current?.weather_code;
    if (typeof temperature !== "number" || typeof code !== "number") return null;

    const today = dateKey(new Date(), timezone);
    const times = body.hourly?.time ?? [];
    const temps = body.hourly?.temperature_2m ?? [];
    const rain = body.hourly?.precipitation_probability ?? [];
    const eveningIndex = times.findIndex((stamp) => stamp.startsWith(`${today}T19:`));
    const eveningTemperatureC = eveningIndex >= 0 ? (temps[eveningIndex] ?? null) : null;
    const precipitationLater = times.some((stamp, index) => {
      if (!stamp.startsWith(today)) return false;
      const hour = hourOf(stamp);
      return hour >= 15 && hour <= 21 && (rain[index] ?? 0) >= 55;
    });
    const sunset = body.daily?.sunset?.[0];
    const kind = weatherKindFromCode(code);

    return {
      temperatureC: temperature,
      kind,
      label: weatherLabel(kind),
      sunsetLabel: sunset ? formatWallClock(sunset) : null,
      eveningTemperatureC,
      precipitationLater,
    };
  } catch {
    return null;
  }
});
