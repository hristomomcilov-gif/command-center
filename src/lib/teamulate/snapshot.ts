export type Tone = "up" | "down" | "flat";

export type Delta = {
  text: string;
  tone: Tone;
};

export type Kpi = {
  id: string;
  label: string;
  value: string;
  delta: Delta;
  foot: string;
  tone: "blue" | "green" | "violet" | "gold" | "cyan";
  icon: "chart" | "search" | "star" | "user" | "spark";
  series: number[];
};

export type TopicStatus = "In progress" | "Preview" | "Scheduled" | "Done";

export type TopicCell = {
  status: TopicStatus;
  when?: string;
} | null;

export type Topic = {
  id: string;
  title: string;
  research: TopicCell;
  blog: TopicCell;
  explorer: TopicCell;
  shorts: TopicCell;
  podcast: TopicCell;
  sessions: number | null;
  delta: Delta | null;
  series: number[];
  schedule: string;
};

export type AttentionItem = {
  id: string;
  title: string;
  age: string;
  note: string;
};

export const reportingRange = {
  label: "Last 28 days",
  span: "Sep 8 – Oct 5, 2024",
};

export const sourceHealth = [
  { id: "gaa", label: "GAA", value: "31", tone: "up" as const },
  { id: "gsc", label: "GSC", value: "0", tone: "flat" as const },
  { id: "ai", label: "AI Visibility", value: "0.8", tone: "up" as const },
];

export const kpis: Kpi[] = [
  {
    id: "sessions",
    label: "Website Sessions",
    value: "265",
    delta: { text: "27.4%", tone: "up" },
    foot: "GAA · Last 28 days",
    tone: "blue",
    icon: "chart",
    series: [8, 10, 12, 11, 14, 18, 16, 22, 20, 24, 28, 26],
  },
  {
    id: "clicks",
    label: "Organic Clicks",
    value: "5",
    delta: { text: "67.7%", tone: "up" },
    foot: "GSC · Last 28 days",
    tone: "green",
    icon: "search",
    series: [1, 1, 2, 1, 2, 2, 3, 2, 3, 4, 4, 5],
  },
  {
    id: "queries",
    label: "GSC Visible Queries",
    value: "14",
    delta: { text: "123.3%", tone: "up" },
    foot: "1 of 18 tracked",
    tone: "violet",
    icon: "chart",
    series: [2, 3, 3, 4, 5, 6, 6, 8, 9, 11, 12, 14],
  },
  {
    id: "mentions",
    label: "AI Mentions",
    value: "1",
    delta: { text: "0%", tone: "flat" },
    foot: "No change",
    tone: "gold",
    icon: "star",
    series: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  },
  {
    id: "leads",
    label: "Leads / Demo requests",
    value: "1",
    delta: { text: "100%", tone: "up" },
    foot: "Form submissions",
    tone: "blue",
    icon: "user",
    series: [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1],
  },
  {
    id: "tools",
    label: "Tool starts / completions",
    value: "23",
    delta: { text: "53.3%", tone: "up" },
    foot: "GAA events · 4 tools",
    tone: "cyan",
    icon: "spark",
    series: [6, 7, 8, 9, 8, 11, 12, 14, 13, 16, 18, 23],
  },
];

const dayLabels = Array.from({ length: 28 }, (_, index) => {
  const date = new Date(Date.UTC(2024, 8, 8 + index));
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(date);
});

export const traffic = {
  labels: dayLabels,
  current: [
    14, 18, 24, 20, 28, 36, 30, 42, 34, 26, 32, 40, 52, 64, 58, 70, 74, 62, 48, 40, 34, 30, 26, 24, 22,
    18, 16, 15,
  ],
  previous: [
    12, 14, 13, 16, 15, 18, 17, 19, 16, 15, 17, 18, 20, 19, 21, 22, 20, 18, 17, 16, 15, 16, 14, 15, 13,
    12, 14, 11,
  ],
};

export const trafficStats = [
  { label: "Users", value: "223", delta: { text: "67.3%", tone: "up" as const } },
  { label: "Engaged sessions", value: "15", delta: { text: "11.1%", tone: "up" as const } },
  { label: "Engagement rate", value: "32.5%", delta: { text: "12.7 pp", tone: "down" as const } },
];

export const organicSearch = {
  asOf: "Sep 8 – Oct 5",
  stats: [
    { label: "Clicks", value: "5", delta: { text: "67.7%", tone: "up" as const } },
    { label: "Impressions", value: "232", delta: null },
    { label: "CTR", value: "2.2%", delta: { text: "2.2 pp", tone: "up" as const } },
    { label: "Avg. position", value: "23.7", delta: { text: "4.5", tone: "up" as const } },
  ],
};

export const keywordRanks = [
  { label: "Top 3", value: 1, delta: { text: "0", tone: "flat" as const } },
  { label: "Top 5", value: 4, delta: { text: "2", tone: "up" as const } },
  { label: "Top 10", value: 5, delta: { text: "1", tone: "up" as const } },
  { label: "Top 100", value: 18, delta: { text: "9", tone: "up" as const } },
];

export const aiVisibility = {
  promptsTested: 23,
  uniquePrompts: 21,
  mentions: 1,
  recommendations: 1,
  citations: 1,
  engines: [
    { engine: "ChatGPT", prompts: 11, mentions: "1/7 (14%)", recommended: "1/7 (14%)", cited: "1/7 (14%)", hit: true },
    { engine: "Perplexity", prompts: 3, mentions: "0/3 (0%)", recommended: "0/3 (0%)", cited: "0/3 (0%)", hit: false },
    { engine: "Gemini", prompts: 3, mentions: "0/3 (0%)", recommended: "0/3 (0%)", cited: "0/3 (0%)", hit: false },
    { engine: "Claude", prompts: 3, mentions: "0/3 (0%)", recommended: "0/3 (0%)", cited: "0/3 (0%)", hit: false },
    { engine: "Copilot", prompts: 3, mentions: "0/3 (0%)", recommended: "0/3 (0%)", cited: "0/3 (0%)", hit: false },
  ],
};

export const topics: Topic[] = [
  {
    id: "content-center",
    title: "The Content Center, scaling as a small marketing team",
    research: { status: "In progress" },
    blog: { status: "Preview" },
    explorer: { status: "Scheduled", when: "Oct 14" },
    shorts: { status: "Scheduled", when: "Oct 14" },
    podcast: { status: "Scheduled", when: "Oct 28" },
    sessions: 245,
    delta: { text: "12%", tone: "up" },
    series: [18, 22, 20, 28, 26, 34, 40],
    schedule: "Oct 28",
  },
  {
    id: "two-day-stack",
    title: "Build a 2-day marketing stack that creates more value",
    research: { status: "In progress" },
    blog: { status: "Preview" },
    explorer: { status: "Scheduled", when: "Oct 11" },
    shorts: { status: "Scheduled", when: "Oct 14" },
    podcast: { status: "Scheduled", when: "Oct 21" },
    sessions: 142,
    delta: { text: "24%", tone: "up" },
    series: [8, 10, 14, 12, 18, 22, 28],
    schedule: "Oct 28",
  },
  {
    id: "ai-advertising",
    title: "How to use AI for tighter, more useful advertising",
    research: null,
    blog: { status: "Preview" },
    explorer: { status: "Scheduled", when: "Oct 11" },
    shorts: { status: "Scheduled", when: "Oct 14" },
    podcast: { status: "Scheduled", when: "Oct 21" },
    sessions: 92,
    delta: { text: "18%", tone: "up" },
    series: [6, 8, 7, 10, 12, 11, 16],
    schedule: "Oct 21",
  },
  {
    id: "volume-with-ai",
    title: "How small marketing teams drive more volume with AI",
    research: { status: "Done" },
    blog: { status: "Preview" },
    explorer: { status: "Scheduled", when: "Oct 11" },
    shorts: { status: "Scheduled", when: "Oct 14" },
    podcast: { status: "Scheduled", when: "Oct 21" },
    sessions: 312,
    delta: { text: "8%", tone: "up" },
    series: [30, 28, 34, 32, 36, 40, 38],
    schedule: "Oct 14",
  },
  {
    id: "who-ai-search-cares",
    title: "Who AI search cares about, and how to write for it",
    research: { status: "In progress" },
    blog: { status: "Preview" },
    explorer: null,
    shorts: null,
    podcast: null,
    sessions: 64,
    delta: { text: "4%", tone: "up" },
    series: [8, 9, 8, 10, 11, 10, 12],
    schedule: "Oct 18",
  },
  {
    id: "demo-path",
    title: "A shorter path from article to demo request",
    research: { status: "Done" },
    blog: { status: "Scheduled", when: "Oct 16" },
    explorer: null,
    shorts: { status: "Scheduled", when: "Oct 22" },
    podcast: null,
    sessions: 41,
    delta: { text: "0%", tone: "flat" },
    series: [6, 6, 7, 6, 6, 7, 6],
    schedule: "Oct 16",
  },
];

export const topicMeta = "6 blog · 12 active topics · CTA keywords across topics · GAA sessions from blog per topic";

export const momentum = [
  "Website sessions 265, up 27.4% on the previous 28 days.",
  "Organic clicks 5, up 67.7%.",
  "GSC visible queries 14, up 123.3%.",
  "Leads and demo requests 1, up from none.",
];

export const bottlenecks = [
  "AI mentions are still low: 1 citation across the engines tested.",
  "Recommendations and citations barely appear in AI answers.",
];

export const nextActions = [
  "Rewrite the “Who AI search cares” section so the page answers the prompt directly.",
  "Publish two or three topical posts already in preview.",
  "Ship the explorer pieces that are scheduled and not yet seen.",
  "Add short FAQs that reinforce experience and clear sourcing.",
  "Daily reply pass to 10 companies is on hold until the copy lands.",
];

export const laterActions = [
  "Refresh the LinkedIn lookalike once the new section is live.",
  "Close the competitor gap noted in this week’s outreach review.",
];

export const attention: AttentionItem[] = [
  {
    id: "rewrite",
    title: "Rewrite “Who AI search cares” section copy",
    age: "6d",
    note: "Another chance before launch",
  },
  {
    id: "linkedin",
    title: "Update the LinkedIn campaign lookalike",
    age: "3d",
    note: "Outreach",
  },
  {
    id: "competitor",
    title: "Competitor gap in the outreach review",
    age: "3d",
    note: "Outreach",
  },
  {
    id: "takeaway",
    title: "Add a takeaway to the outreach review",
    age: "3d",
    note: "Outreach",
  },
  {
    id: "daily-sync",
    title: "Daily sync: email the top 10 companies",
    age: "3d",
    note: "On hold",
  },
];

export const freshness = [
  { id: "gaa", name: "GAA", updated: "Updated 1h ago", through: "Data through Oct 5" },
  { id: "gsc", name: "GSC", updated: "Updated 3h ago", through: "Data through Oct 5" },
  { id: "ai", name: "AI Visibility", updated: "Updated 2h ago", through: "Data through Oct 5" },
  { id: "clickup", name: "ClickUp", updated: "Updated 8h ago", through: "Data through Oct 5" },
];

export const skipperPrompts = [
  "Why did website traffic increase?",
  "Which topics are performing best?",
  "What should we work on next?",
  "Show AI visibility trends",
  "Which accounts need attention?",
  "Summarize this week’s progress",
];

export function bucketWeekly(labels: string[], values: number[]) {
  const nextLabels: string[] = [];
  const nextValues: number[] = [];
  for (let index = 0; index < values.length; index += 7) {
    const slice = values.slice(index, index + 7);
    const total = slice.reduce((sum, value) => sum + value, 0);
    nextLabels.push(labels[index] ?? "");
    nextValues.push(Math.round(total / slice.length));
  }
  return { labels: nextLabels, values: nextValues };
}

export function answerFor(question: string): string {
  const q = question.trim().toLowerCase();
  if (!q) return "Ask about traffic, topics, visibility, or what to do next.";
  if (q.includes("traffic") || q.includes("session") || q.includes("increase")) {
    return "Sessions are 265, up 27.4% from the previous 28 days. The line climbs through late September, peaks, then eases into October. Users are up 67.3%. Engagement rate is the soft spot, down 12.7 points.";
  }
  if (q.includes("topic") || q.includes("performing") || q.includes("content")) {
    return "The volume piece is the strongest page in view, at 312 sessions. The 2-day marketing stack is the fastest mover, up 24%. Four posts are still in preview, so the next gains are already written.";
  }
  if (q.includes("next") || q.includes("work") || q.includes("action") || q.includes("priority")) {
    return "Start with the “Who AI search cares” section. It is the item that has been waiting longest, and it is the page AI answers are most likely to quote. Then publish the previews and ship the scheduled explorer pieces.";
  }
  if (q.includes("visibility") || q.includes("mention") || q.includes("chatgpt") || q.includes("ai")) {
    return "23 prompts were tested, 21 of them unique. ChatGPT is the only engine with a mention, a recommendation, and a citation, each at 1 of 7. Perplexity, Gemini, Claude, and Copilot are still at zero.";
  }
  if (q.includes("account") || q.includes("attention") || q.includes("outreach") || q.includes("competitor")) {
    return "Five things need a person. The oldest is the section rewrite, open for 6 days. Three outreach notes are 3 days old, and the daily email to 10 companies is on hold.";
  }
  if (q.includes("week") || q.includes("summar") || q.includes("progress")) {
    return "A stronger acquisition week: sessions, clicks, and visible queries are all up. One new lead came in. AI visibility has not moved. The useful work is the rewrite, then the posts already in preview.";
  }
  return "This view is the Sep 8 – Oct 5 snapshot. I can walk through traffic, the topics that are moving, AI visibility, and the next useful action.";
}

export function emptyTopic(title: string): Topic {
  return {
    id: `topic-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`,
    title,
    research: { status: "In progress" },
    blog: null,
    explorer: null,
    shorts: null,
    podcast: null,
    sessions: null,
    delta: null,
    series: [],
    schedule: "Unscheduled",
  };
}
