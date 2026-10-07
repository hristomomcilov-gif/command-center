import type { ReactNode } from "react";
import { Inter, Newsreader } from "next/font/google";
import { AppShell } from "@/components/shell/AppShell";
import { homeProfile } from "@/lib/home/sources/temporary-state";
import { getWeather } from "@/lib/home/sources/weather";
import { dayPeriod, isWeekend } from "@/lib/home/time";
import "./globals.css";

const sans = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

const serif = Newsreader({
  subsets: ["latin"],
  display: "swap",
  style: ["normal", "italic"],
  variable: "--font-serif",
});

export const dynamic = "force-dynamic";

export const metadata = {
  title: {
    default: "Teamulate",
    template: "%s · Teamulate",
  },
  description: "A calm, personal start to the day.",
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const now = new Date();
  const weather = await getWeather();

  return (
    <html
      lang="en"
      className={`${sans.variable} ${serif.variable}`}
      data-period={dayPeriod(now, homeProfile.timezone)}
      data-weekend={isWeekend(now, homeProfile.timezone) ? "true" : "false"}
      data-weather={weather?.kind ?? "clear"}
      data-surface="ops"
    >
      <body>
        <a className="skip" href="#content">
          Skip to content
        </a>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
