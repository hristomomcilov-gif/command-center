import type { WeatherKind, WeatherSnapshot } from "./types";

export function weatherKindFromCode(code: number): WeatherKind {
  if (code === 0) return "clear";
  if (code === 1 || code === 2) return "partly-cloudy";
  if (code === 3) return "cloudy";
  if (code === 45 || code === 48) return "fog";
  if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return "rain";
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) return "snow";
  if (code >= 95) return "storm";
  return "cloudy";
}

export function weatherLabel(kind: WeatherKind): string {
  switch (kind) {
    case "clear":
      return "Clear";
    case "partly-cloudy":
      return "Partly cloudy";
    case "cloudy":
      return "Cloudy";
    case "fog":
      return "Foggy";
    case "rain":
      return "Rain";
    case "snow":
      return "Snow";
    case "storm":
      return "Storms";
  }
}

export function eveningNote(weather: WeatherSnapshot | null): string | null {
  if (!weather) return null;
  if (weather.kind === "snow") return "Snow in the air";
  if (weather.precipitationLater && weather.kind !== "rain" && weather.kind !== "storm") {
    return "Rain possible later";
  }
  if (weather.kind === "rain" || weather.kind === "storm") return "Rain possible later";
  if (
    weather.eveningTemperatureC !== null &&
    weather.eveningTemperatureC <= weather.temperatureC - 2
  ) {
    return "Cooler this evening";
  }
  return null;
}
