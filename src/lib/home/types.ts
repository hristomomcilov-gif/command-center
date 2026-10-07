export type DayPeriod = "morning" | "afternoon" | "evening";

export type WeatherKind =
  | "clear"
  | "partly-cloudy"
  | "cloudy"
  | "fog"
  | "rain"
  | "snow"
  | "storm";

export type EmailKind =
  | "reply"
  | "decision"
  | "action"
  | "schedule"
  | "personal"
  | "awareness"
  | "newsletter"
  | "promotion"
  | "receipt"
  | "noise";

export type WeatherHour = {
  at: string;
  temperatureC: number;
  kind: WeatherKind;
  precipitationProbability: number;
};

export type WeatherSnapshot = {
  temperatureC: number;
  kind: WeatherKind;
  label: string;
  sunsetLabel: string | null;
  eveningTemperatureC: number | null;
  precipitationLater: boolean;
  hours: WeatherHour[];
};

export type ProfileSource = {
  firstName: string;
  timezone: string;
  locationLabel: string;
  latitude: number;
  longitude: number;
};

export type CalendarEventSource = {
  id: string;
  title: string;
  start: string;
  end: string;
  color: string;
};

export type PrioritySource = {
  id: string;
  title: string;
  context: string | null;
  projectId: string | null;
  projectName: string | null;
  href: string;
  pinned: boolean;
  personal: boolean;
  importance: "focus" | "normal";
  dueOn: string | null;
  completed: boolean;
};

export type EmailSymbol = "person" | "calendar" | "document";

export type EmailSource = {
  id: string;
  sender: string;
  subject: string;
  context: string | null;
  receivedAt: string;
  href: string;
  kind: EmailKind;
  symbol: EmailSymbol;
};

export type NewsSource = {
  id: string;
  category: string;
  headline: string;
  whyItMatters: string | null;
  source: string | null;
  publishedAt: string | null;
  href: string;
  topics: string[];
  image?: string | null;
};

export type AttentionSource = {
  id: string;
  title: string;
  context: string | null;
  href: string | null;
};

export type ProjectSource = {
  id: string;
  name: string;
  summary: string;
};

/**
 * Serializable inputs for Home. UI components only see the view model.
 * Replace individual fields from live integrations without changing the page.
 */
export type HomeSources = {
  profile: ProfileSource;
  weather: WeatherSnapshot | null;
  events: CalendarEventSource[];
  tomorrowFirst: CalendarEventSource | null;
  priorities: PrioritySource[];
  emails: EmailSource[];
  news: NewsSource[];
  topics: string[];
  attention: AttentionSource[];
};

export type HomeEvent = {
  id: string;
  title: string;
  timeLabel: string;
  color: string;
  href: string;
  passed: boolean;
};

export type HomeClearWindow = {
  timeLabel: string;
  name: "Clear" | "Open";
};

export type HomePriority = {
  id: string;
  title: string;
  href: string;
};

export type HomePrimary = {
  id: string;
  title: string;
  context: string;
  href: string;
  projectName: string | null;
};

export type HomeNewsItem = {
  id: string;
  category: string;
  headline: string;
  whyItMatters: string | null;
  source: string | null;
  publishedLabel: string | null;
  href: string;
  image: string | null;
};

export type HomeEmailItem = {
  id: string;
  sender: string;
  subject: string;
  context: string | null;
  timeLabel: string;
  href: string;
  symbol: EmailSymbol;
};

export type HomeAttention = {
  lead: string;
  id: string;
  title: string;
  context: string | null;
  href: string | null;
};

export type HomeWeatherHour = {
  id: string;
  shortLabel: string;
  timeLabel: string;
  temperatureC: number;
  temperatureLabel: string;
  kind: WeatherKind;
  condition: string;
  rainLabel: string | null;
};

export type HomeWeather = {
  temperatureLabel: string;
  summary: string;
  kind: WeatherKind;
  condition: string;
  locationLabel: string;
  outlook: HomeWeatherHour[];
};

export type HomeViewModel = {
  generatedAt: string;
  timezone: string;
  period: DayPeriod;
  weekend: boolean;
  greeting: string;
  dateLabel: string;
  timeLabel: string;
  heroMessage: string;
  weather: HomeWeather | null;
  primary: HomePrimary | null;
  events: HomeEvent[];
  clearWindow: HomeClearWindow | null;
  priorities: HomePriority[];
  news: HomeNewsItem[];
  emails: HomeEmailItem[];
  attention: HomeAttention | null;
  thought: string;
  later: string | null;
  empty: {
    primary: string;
    calendar: string;
    priorities: string;
    email: string;
  };
};
