import type {
  AttentionSource,
  EmailKind,
  NewsSource,
  PrioritySource,
  ProjectSource,
} from "../types";

/**
 * Temporary personal state for Home.
 *
 * These records stand in for live profile, calendar, priority, mail, and news
 * integrations. Adapters own this data. The page renders the composed view model
 * and does not read these records directly.
 *
 * Replace the readers in this folder when a real source exists.
 */

export const homeProfile = {
  firstName: "Chris",
  timezone: "America/Toronto",
  locationLabel: "Barrie",
  latitude: 44.3894,
  longitude: -79.6903,
};

export const topicPreferences = ["ai", "agents", "autonomy", "space", "robotics"];

export const projects: ProjectSource[] = [
  {
    id: "wave-2",
    name: "Teamulate",
    summary: "The product itself, taken one calm step at a time.",
  },
  {
    id: "singularity-drive",
    name: "Singularity Drive",
    summary: "Longer work, held quietly until you are ready.",
  },
  {
    id: "contractor-quote",
    name: "Freelance",
    summary: "A quote, when you choose to send it.",
  },
];

export const priorityRecords: PrioritySource[] = [
  {
    id: "prepare-wave-2",
    title: "Prepare Wave 2 tools for review",
    context: "Best first move today.",
    projectId: "wave-2",
    projectName: "Teamulate",
    href: "/priorities/prepare-wave-2",
    pinned: true,
    personal: false,
    importance: "focus",
    dueOn: null,
    completed: false,
  },
  {
    id: "finish-wave-2",
    title: "Finish Wave 2 review",
    context: null,
    projectId: "wave-2",
    projectName: "Teamulate",
    href: "/priorities/finish-wave-2",
    pinned: false,
    personal: false,
    importance: "normal",
    dueOn: null,
    completed: false,
  },
  {
    id: "record-vo",
    title: "Record Singularity Drive VO",
    context: null,
    projectId: "singularity-drive",
    projectName: "Singularity Drive",
    href: "/priorities/record-vo",
    pinned: false,
    personal: false,
    importance: "normal",
    dueOn: null,
    completed: false,
  },
  {
    id: "contractor-quote",
    title: "Send contractor quote",
    context: null,
    projectId: "contractor-quote",
    projectName: "Freelance",
    href: "/priorities/contractor-quote",
    pinned: false,
    personal: false,
    importance: "normal",
    dueOn: null,
    completed: false,
  },
  {
    id: "reorganize-archive",
    title: "Reorganize the archive",
    context: null,
    projectId: "wave-2",
    projectName: "Teamulate",
    href: "/priorities/reorganize-archive",
    pinned: false,
    personal: false,
    importance: "normal",
    dueOn: null,
    completed: false,
  },
];

export type CalendarTemplate = {
  id: string;
  title: string;
  hour: number;
  minute: number;
  durationMinutes: number;
  color: string;
  dayOffset: number;
};

export const calendarTemplates: CalendarTemplate[] = [
  {
    id: "appointment",
    title: "Appointment",
    hour: 9,
    minute: 30,
    durationMinutes: 45,
    color: "#6f93c7",
    dayOffset: 0,
  },
  {
    id: "teamulate-review",
    title: "Teamulate review",
    hour: 11,
    minute: 0,
    durationMinutes: 45,
    color: "#e0a15a",
    dayOffset: 0,
  },
  {
    id: "pick-up-dani",
    title: "Pick up Dani",
    hour: 14,
    minute: 30,
    durationMinutes: 45,
    color: "#8d78c9",
    dayOffset: 0,
  },
  {
    id: "tomorrow-start",
    title: "Morning block",
    hour: 9,
    minute: 0,
    durationMinutes: 60,
    color: "#6f93c7",
    dayOffset: 1,
  },
];

export type EmailTemplate = {
  id: string;
  sender: string;
  subject: string;
  context: string | null;
  hoursAgo: number;
  kind: EmailKind;
  symbol: "person" | "calendar" | "document";
};

export const emailTemplates: EmailTemplate[] = [
  {
    id: "sarah-proposal",
    sender: "Sarah",
    subject: "Re: the proposal",
    context: "Replied to your proposal",
    hoursAgo: 2,
    kind: "reply",
    symbol: "person",
  },
  {
    id: "schedule-change",
    sender: "Calendar",
    subject: "Schedule change for tomorrow",
    context: "Schedule change for tomorrow",
    hoursAgo: 5,
    kind: "schedule",
    symbol: "calendar",
  },
  {
    id: "payment",
    sender: "Invoice",
    subject: "Payment confirmation",
    context: "Payment confirmation",
    hoursAgo: 26,
    kind: "awareness",
    symbol: "document",
  },
  {
    id: "weekly-digest",
    sender: "Digest",
    subject: "Your weekly roundup",
    context: null,
    hoursAgo: 3,
    kind: "newsletter",
    symbol: "document",
  },
  {
    id: "promo",
    sender: "Offers",
    subject: "A limited upgrade",
    context: null,
    hoursAgo: 1,
    kind: "promotion",
    symbol: "document",
  },
];

export const newsRecords: NewsSource[] = [
  {
    id: "agent-workflow",
    category: "AI",
    headline: "New agent workflow breakthrough",
    whyItMatters: "Could improve autonomous execution.",
    source: "Field notes",
    publishedAt: null,
    href: "/for-you/agent-workflow",
    topics: ["ai", "agents"],
  },
  {
    id: "fsd-testing",
    category: "Tesla / Autonomy",
    headline: "FSD update expands testing",
    whyItMatters: "Worth watching for real-world rollout.",
    source: "Field notes",
    publishedAt: null,
    href: "/for-you/fsd-testing",
    topics: ["autonomy"],
  },
  {
    id: "starship",
    category: "Space / Future",
    headline: "Starship milestone reached",
    whyItMatters: "Signals progress for heavy launch cadence.",
    source: "Field notes",
    publishedAt: null,
    href: "/for-you/starship",
    topics: ["space"],
  },
  {
    id: "agent-workflow-repeat",
    category: "AI",
    headline: "New agent workflow breakthrough",
    whyItMatters: "A second telling of the same development.",
    source: "Field notes",
    publishedAt: null,
    href: "/for-you/agent-workflow-repeat",
    topics: ["ai"],
  },
  {
    id: "celebrity-noise",
    category: "Culture",
    headline: "A celebrity appearance makes the rounds",
    whyItMatters: null,
    source: "Field notes",
    publishedAt: null,
    href: "/for-you/celebrity-noise",
    topics: ["celebrity"],
  },
];

export const attentionRecords: AttentionSource[] = [];

export function getProject(id: string): ProjectSource | null {
  return projects.find((project) => project.id === id) ?? null;
}

export function getPriority(id: string): PrioritySource | null {
  return priorityRecords.find((priority) => priority.id === id) ?? null;
}
