"use client";

import { useState } from "react";
import { WeatherGlyph } from "@/components/icons";
import type { HomeClearWindow, HomeWeather } from "@/lib/home/types";

export function WeatherOutlook({
  weather,
  clearWindow,
}: {
  weather: HomeWeather;
  clearWindow: HomeClearWindow | null;
}) {
  const [selected, setSelected] = useState(0);
  const hours = weather.outlook;
  const hour = hours[Math.min(selected, hours.length - 1)] ?? hours[0];
  if (!hour) return null;

  const temps = hours.map((item) => item.temperatureC);
  const low = Math.min(...temps);
  const high = Math.max(...temps);
  const span = Math.max(high - low, 1);

  return (
    <div className="outlook">
      <div className="outlook-now" aria-live="polite">
        <WeatherGlyph kind={hour.kind} size={22} />
        <div>
          <p className="outlook-temp">
            {hour.temperatureLabel}
            <span>{hour.timeLabel}</span>
          </p>
          <p className="outlook-condition">
            {hour.condition}
            <span> · {weather.locationLabel}</span>
          </p>
        </div>
      </div>
      <div className="outlook-hours" role="group" aria-label="Weather over the next hours">
        {hours.map((item, index) => {
          const height = 16 + ((item.temperatureC - low) / span) * 84;
          return (
            <button
              key={item.id}
              type="button"
              className={index === selected ? "is-selected" : undefined}
              aria-pressed={index === selected}
              onClick={() => setSelected(index)}
            >
              <span className="outlook-track" aria-hidden="true">
                <span className={`outlook-bar bar-${item.kind}`} style={{ height: `${height}%` }} />
              </span>
              <span className="outlook-hour">{item.shortLabel}</span>
            </button>
          );
        })}
      </div>
      {hour.rainLabel ? <p className="outlook-rain">{hour.rainLabel}</p> : null}
      {clearWindow ? (
        <p className="outlook-open">
          {clearWindow.name} {clearWindow.timeLabel}
        </p>
      ) : null}
    </div>
  );
}
