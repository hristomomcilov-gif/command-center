"use client";

import Link from "next/link";
import { FormEvent, useEffect, useId, useRef, useState } from "react";
import { Icon } from "@/components/icons";
import { RankBars, Sparkline, TrafficChart } from "@/components/teamulate/charts";
import {
  aiVisibility,
  answerFor,
  attention,
  bottlenecks,
  bucketWeekly,
  emptyTopic,
  freshness,
  keywordRanks,
  kpis,
  laterActions,
  momentum,
  nextActions,
  organicSearch,
  reportingRange,
  skipperPrompts,
  sourceHealth,
  topicMeta,
  topics as initialTopics,
  traffic,
  trafficStats,
  type Delta,
  type Topic,
  type TopicCell,
} from "@/lib/teamulate/snapshot";

function DeltaText({ delta }: { delta: Delta }) {
  const word = delta.tone === "up" ? "Up" : delta.tone === "down" ? "Down" : "Flat";
  const mark = delta.tone === "up" ? "↑" : delta.tone === "down" ? "↓" : "–";
  return (
    <span className={`delta delta-${delta.tone}`}>
      <span className="sr-only">{word}</span>
      <span aria-hidden="true">{mark}</span> {delta.text}
    </span>
  );
}

function TopicPill({ cell }: { cell: TopicCell }) {
  if (!cell) return <span className="pill pill-empty">—</span>;
  const tone = cell.status.toLowerCase().replace(" ", "-");
  return (
    <span className={`pill pill-${tone}`}>
      {cell.status}
      {cell.when ? <small>{cell.when}</small> : null}
    </span>
  );
}

export function TeamulateDashboard() {
  const searchId = useId();
  const topicDialog = useRef<HTMLDialogElement>(null);
  const topicField = useId();
  const [grain, setGrain] = useState<"daily" | "weekly">("daily");
  const [refreshing, setRefreshing] = useState(false);
  const [freshNote, setFreshNote] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [showTopics, setShowTopics] = useState(false);
  const [showAttention, setShowAttention] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [rows, setRows] = useState<Topic[]>(initialTopics);
  const [draft, setDraft] = useState("");
  const [topicTitle, setTopicTitle] = useState("");
  const [messages, setMessages] = useState<{ question: string; answer: string }[]>([]);
  const [chatOpen, setChatOpen] = useState(false);
  const chatInput = useRef<HTMLInputElement>(null);
  const chatLauncher = useRef<HTMLButtonElement>(null);
  const chatThread = useRef<HTMLDivElement>(null);

  const needle = query.trim().toLowerCase();
  const visibleTopics = rows.filter((topic) => !needle || topic.title.toLowerCase().includes(needle));
  const topicList = showTopics || needle ? visibleTopics : visibleTopics.slice(0, 4);
  const attentionList = attention.filter(
    (item) => !needle || `${item.title} ${item.note}`.toLowerCase().includes(needle),
  );
  const visibleAttention = showAttention ? attentionList : attentionList.slice(0, 4);

  const currentSeries =
    grain === "weekly" ? bucketWeekly(traffic.labels, traffic.current) : { labels: traffic.labels, values: traffic.current };
  const previousSeries =
    grain === "weekly"
      ? bucketWeekly(traffic.labels, traffic.previous)
      : { labels: traffic.labels, values: traffic.previous };

  function refresh() {
    if (refreshing) return;
    setRefreshing(true);
    window.setTimeout(() => {
      setRefreshing(false);
      setFreshNote("Updated just now");
    }, 450);
  }

  function ask(question: string) {
    const text = question.trim();
    if (!text) return;
    setMessages((list) => [...list.slice(-3), { question: text, answer: answerFor(text) }]);
    setDraft("");
  }

  function onAsk(event: FormEvent) {
    event.preventDefault();
    ask(draft);
  }

  function openChat() {
    setChatOpen(true);
  }

  function closeChat() {
    setChatOpen(false);
    chatLauncher.current?.focus();
  }

  useEffect(() => {
    if (!chatOpen) return;
    chatInput.current?.focus();
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") closeChat();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [chatOpen]);

  useEffect(() => {
    const thread = chatThread.current;
    if (!thread) return;
    thread.scrollTop = thread.scrollHeight;
  }, [messages, chatOpen]);

  function addTopic(event: FormEvent) {
    event.preventDefault();
    const title = topicTitle.trim();
    if (!title) return;
    setRows((list) => [{ ...emptyTopic(title), id: `topic-${list.length}-${title.length}` }, ...list]);
    setTopicTitle("");
    setShowTopics(true);
    topicDialog.current?.close();
  }

  return (
    <div className="tu-wrap">
      <div className="tu">
        <header className="tu-head panel">
          <p className="tu-crumb">
            <Link href="/">Command Center</Link>
            <span aria-hidden="true">/</span>
            Teamulate
          </p>
          <div className="tu-head-row">
            <div className="tu-brand">
              <span className="tu-logo" aria-hidden="true">
                <Icon name="spark" size={18} />
              </span>
              <div>
                <h1>Teamulate</h1>
                <p>AI-powered marketing department for B2B teams</p>
              </div>
            </div>
            <div className="tu-head-tools">
              <p className="tu-range">
                <Icon name="calendar" size={16} />
                <span>
                  <strong>{reportingRange.label}</strong>
                  <small>{reportingRange.span}</small>
                </span>
              </p>
              <ul className="tu-sources">
                {sourceHealth.map((source) => (
                  <li key={source.id}>
                    <span>{source.label}</span>
                    <strong className={`delta delta-${source.tone}`}>
                      {source.tone === "up" ? "↑" : "–"} {source.value}
                    </strong>
                  </li>
                ))}
              </ul>
              <button type="button" className="tu-btn tu-btn-ghost" onClick={refresh} aria-busy={refreshing}>
                <Icon name="refresh" size={16} />
                {refreshing ? "Refreshing" : "Refresh"}
              </button>
              <button type="button" className="tu-btn tu-btn-skipper" onClick={openChat}>
                <Icon name="spark" size={16} />
                Ask Skipper
              </button>
            </div>
          </div>
        </header>

        <div className="tu-tools">
          <div className={`tu-search ${searchOpen ? "is-open" : ""}`}>
            <button
              type="button"
              className="tu-icon-btn"
              aria-expanded={searchOpen}
              aria-controls={searchId}
              onClick={() => {
                setSearchOpen((open) => !open);
                if (searchOpen) setQuery("");
              }}
            >
              <Icon name="search" size={18} />
              <span className="sr-only">{searchOpen ? "Close search" : "Search the dashboard"}</span>
            </button>
            {searchOpen ? (
              <input
                id={searchId}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search topics and attention"
                aria-label="Search topics and attention"
                autoFocus
              />
            ) : null}
          </div>
          <details className="tu-bell">
            <summary className="tu-icon-btn" aria-label="Notifications, 1 new">
              <Icon name="bell" size={18} />
              <span className="tu-badge">1</span>
            </summary>
            <div className="tu-popover panel">
              <p>Needs a look</p>
              <strong>{attention[0]?.title}</strong>
              <span>Open for {attention[0]?.age}</span>
            </div>
          </details>
          <span className="tu-avatar" role="img" aria-label="Account">
            TS
          </span>
        </div>

        <div className="tu-main">
          <section className="tu-kpis" aria-label="Headline numbers">
            {kpis.map((kpi) => (
              <article className="tu-kpi panel" key={kpi.id}>
                <div className="tu-kpi-label">
                  <span className={`tu-glyph tu-glyph-${kpi.tone}`}>
                    <Icon name={kpi.icon} size={15} />
                  </span>
                  {kpi.label}
                </div>
                <div className="tu-kpi-body">
                  <p>
                    <strong>{kpi.value}</strong>
                    <DeltaText delta={kpi.delta} />
                  </p>
                  <Sparkline values={kpi.series} tone={kpi.tone} />
                </div>
                <p className="tu-kpi-foot">{kpi.foot}</p>
              </article>
            ))}
          </section>

          <section className="tu-acq panel" aria-labelledby="acq-title">
            <header className="tu-section-head">
              <div>
                <h2 id="acq-title">
                  <span className="tu-glyph tu-glyph-blue">
                    <Icon name="chart" size={15} />
                  </span>
                  Acquisition & visibility
                </h2>
                <p>Website traffic, search performance, keyword visibility, and AI presence.</p>
              </div>
              <div className="tu-legend">
                <span>
                  <i className="swatch swatch-now" /> Last 28 days
                </span>
                <span>
                  <i className="swatch swatch-prev" /> Previous 28 days
                </span>
                <label>
                  <span className="sr-only">Chart grain</span>
                  <select value={grain} onChange={(event) => setGrain(event.target.value as "daily" | "weekly")}>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                  </select>
                </label>
              </div>
            </header>
            <div className="tu-acq-grid">
              <div className="tu-block">
                <h3>Website traffic</h3>
                <p className="tu-hero-stat">
                  <strong>265</strong>
                  <DeltaText delta={{ text: "27.4%", tone: "up" }} />
                </p>
                <TrafficChart
                  labels={currentSeries.labels}
                  current={currentSeries.values}
                  previous={previousSeries.values}
                />
                <ul className="tu-stat-row">
                  {trafficStats.map((stat) => (
                    <li key={stat.label}>
                      <strong>{stat.value}</strong>
                      <span>{stat.label}</span>
                      <DeltaText delta={stat.delta} />
                    </li>
                  ))}
                </ul>
              </div>
              <div className="tu-block">
                <h3>
                  Organic search
                  <small>GSC · {organicSearch.asOf}</small>
                </h3>
                <ul className="tu-mini-stats">
                  {organicSearch.stats.map((stat) => (
                    <li key={stat.label}>
                      <strong>{stat.value}</strong>
                      <span>{stat.label}</span>
                      {stat.delta ? <DeltaText delta={stat.delta} /> : null}
                    </li>
                  ))}
                </ul>
                <div className="tu-keywords">
                  <h3>
                    Keyword visibility
                    <small>GSC queries by top paid position</small>
                  </h3>
                  <RankBars values={keywordRanks.map((rank) => rank.value)} />
                  <ul>
                    {keywordRanks.map((rank) => (
                      <li key={rank.label}>
                        <span>{rank.label}</span>
                        <strong>{rank.value}</strong>
                        <DeltaText delta={rank.delta} />
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="tu-block">
                <h3>
                  AI visibility
                  <small>
                    {aiVisibility.promptsTested} prompts tested · {aiVisibility.uniquePrompts} unique
                  </small>
                </h3>
                <ul className="tu-ai-counts">
                  <li>
                    <strong>{aiVisibility.mentions}</strong> Mentions
                  </li>
                  <li>
                    <strong>{aiVisibility.recommendations}</strong> Recommendations
                  </li>
                  <li>
                    <strong>{aiVisibility.citations}</strong> Citations
                  </li>
                </ul>
                <div className="tu-table-scroll">
                  <table className="tu-ai">
                    <caption className="sr-only">AI engine visibility for the last 28 days</caption>
                    <thead>
                      <tr>
                        <th scope="col">Engine</th>
                        <th scope="col">Prompts</th>
                        <th scope="col">Mentions</th>
                        <th scope="col">Recommended</th>
                        <th scope="col">Cited</th>
                      </tr>
                    </thead>
                    <tbody>
                      {aiVisibility.engines.map((engine) => (
                        <tr key={engine.engine} className={engine.hit ? "is-hit" : undefined}>
                          <th scope="row">{engine.engine}</th>
                          <td>{engine.prompts}</td>
                          <td>{engine.mentions}</td>
                          <td>{engine.recommended}</td>
                          <td>{engine.cited}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </section>

          <div className="tu-bottom">
            <section className="tu-matrix panel" aria-labelledby="matrix-title">
              <header className="tu-section-head">
                <div>
                  <h2 id="matrix-title">Topic matrix / content engine</h2>
                  <p>Track content lifecycle across multiple formats and channels.</p>
                </div>
                <button
                  type="button"
                  className="tu-btn tu-btn-skipper"
                  onClick={() => {
                    topicDialog.current?.showModal();
                    topicDialog.current?.querySelector("input")?.focus();
                  }}
                >
                  <Icon name="plus" size={15} />
                  New topic
                </button>
              </header>
              <div className="tu-table-scroll">
                <table className="tu-topics">
                  <caption className="sr-only">Topics and where each format stands</caption>
                  <thead>
                    <tr>
                      <th scope="col">Topic</th>
                      <th scope="col">Research</th>
                      <th scope="col">Blog</th>
                      <th scope="col">Explorer</th>
                      <th scope="col">Shorts</th>
                      <th scope="col">Podcast</th>
                      <th scope="col">Performance, 28d</th>
                      <th scope="col">Schedule</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topicList.map((topic) => (
                      <tr key={topic.id}>
                        <th scope="row">{topic.title}</th>
                        <td>
                          <TopicPill cell={topic.research} />
                        </td>
                        <td>
                          <TopicPill cell={topic.blog} />
                        </td>
                        <td>
                          <TopicPill cell={topic.explorer} />
                        </td>
                        <td>
                          <TopicPill cell={topic.shorts} />
                        </td>
                        <td>
                          <TopicPill cell={topic.podcast} />
                        </td>
                        <td>
                          {topic.sessions == null ? (
                            <span className="tu-quiet">Not yet</span>
                          ) : (
                            <span className="tu-perf">
                              <strong>{topic.sessions} sessions</strong>
                              {topic.delta ? <DeltaText delta={topic.delta} /> : null}
                              <Sparkline values={topic.series} tone="blue" />
                            </span>
                          )}
                        </td>
                        <td>{topic.schedule}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {topicList.length === 0 ? <p className="tu-empty">No topics match that.</p> : null}
              <footer className="tu-matrix-foot">
                <button type="button" onClick={() => setShowTopics((open) => !open)}>
                  {showTopics ? "Show the first four" : `Show all ${visibleTopics.length} topics`}
                </button>
                <span>{topicMeta}</span>
              </footer>
            </section>

            <section className="tu-actions panel" aria-labelledby="actions-title">
              <h2 id="actions-title">Results / next best actions</h2>
              <div className="tu-action tu-action-up">
                <h3>
                  <Icon name="arrow" size={15} /> Momentum
                </h3>
                <ul>
                  {momentum.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className="tu-action tu-action-down">
                <h3>
                  <Icon name="alert" size={15} /> Current bottlenecks
                </h3>
                <ul>
                  {bottlenecks.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className="tu-action tu-action-next">
                <h3>
                  <Icon name="spark" size={15} /> Next best action
                </h3>
                <ol>
                  {(showActions ? [...nextActions, ...laterActions] : nextActions).map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ol>
              </div>
              <button type="button" className="tu-text-btn" onClick={() => setShowActions((open) => !open)}>
                {showActions ? "Show fewer actions" : "View all actions"}
              </button>
            </section>
          </div>
        </div>

        <aside className="tu-rail">
          <section className="panel tu-card" aria-labelledby="attention-title">
            <header className="tu-card-head">
              <h2 id="attention-title">
                Needs attention <span className="tu-count">{attentionList.length}</span>
              </h2>
              <button type="button" onClick={() => setShowAttention((open) => !open)}>
                {showAttention ? "Show less" : "View all"}
              </button>
            </header>
            {visibleAttention.length === 0 ? (
              <p className="tu-empty">Nothing in the queue matches that.</p>
            ) : (
              <ul className="tu-attention">
                {visibleAttention.map((item) => (
                  <li key={item.id}>
                    <span className="tu-dot" aria-hidden="true" />
                    <span>
                      <strong>{item.title}</strong>
                      <small>
                        {item.age} · {item.note}
                      </small>
                    </span>
                  </li>
                ))}
              </ul>
            )}
            {!showAttention && attentionList.length > 4 ? (
              <button type="button" className="tu-text-btn" onClick={() => setShowAttention(true)}>
                and more
              </button>
            ) : null}
          </section>

          <section className="panel tu-card" id="ask-skipper" aria-labelledby="skipper-title">
            <header className="tu-card-head">
              <h2 id="skipper-title">
                <Icon name="spark" size={16} /> Ask Skipper
              </h2>
            </header>
            <div className="tu-thread" aria-live="polite">
              {messages.map((message) => (
                <article key={message.question}>
                  <p className="tu-q">{message.question}</p>
                  <p>{message.answer}</p>
                </article>
              ))}
            </div>
            <form className="tu-ask" onSubmit={onAsk}>
              <label className="sr-only" htmlFor="skipper-input">
                Ask anything about Teamulate
              </label>
              <input
                id="skipper-input"
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder="Ask anything about Teamulate…"
              />
              <button type="submit" className="tu-btn tu-btn-skipper" aria-label="Send">
                <Icon name="arrow" size={16} />
              </button>
            </form>
            <p className="tu-try">Try asking</p>
            <ul className="tu-prompts">
              {skipperPrompts.map((prompt) => (
                <li key={prompt}>
                  <button type="button" onClick={() => ask(prompt)}>
                    {prompt}
                    <Icon name="chevron" size={14} />
                  </button>
                </li>
              ))}
            </ul>
          </section>

          <section className="panel tu-card" aria-labelledby="fresh-title">
            <h2 id="fresh-title">
              <Icon name="refresh" size={16} /> Data freshness
            </h2>
            <ul className="tu-fresh">
              {freshness.map((source) => (
                <li key={source.id}>
                  <span className="tu-live" aria-hidden="true" />
                  <span>
                    <strong>{source.name}</strong>
                    <small>{source.id === "gaa" && freshNote ? freshNote : source.updated}</small>
                  </span>
                  <small>{source.through}</small>
                </li>
              ))}
            </ul>
          </section>
        </aside>
      </div>

      <button
        ref={chatLauncher}
        type="button"
        className="tu-skipper-fab"
        aria-expanded={chatOpen}
        aria-controls="skipper-chat"
        onClick={() => (chatOpen ? closeChat() : openChat())}
      >
        <Icon name={chatOpen ? "close" : "spark"} size={18} />
        {chatOpen ? "Close" : "Ask Skipper"}
      </button>
      {chatOpen ? (
        <section id="skipper-chat" className="tu-chat" role="dialog" aria-labelledby="skipper-chat-title">
          <header className="tu-chat-head">
            <h2 id="skipper-chat-title">
              <Icon name="spark" size={16} /> Ask Skipper
            </h2>
            <button type="button" className="tu-icon-btn" onClick={closeChat} aria-label="Close chat">
              <Icon name="close" size={16} />
            </button>
          </header>
          <div className="tu-thread tu-chat-thread" ref={chatThread} aria-live="polite">
            {messages.length === 0 ? (
              <p className="tu-chat-empty">Ask about traffic, topics, visibility, or the next useful action.</p>
            ) : (
              messages.map((message, index) => (
                <article key={`${message.question}-${index}`}>
                  <p className="tu-q">{message.question}</p>
                  <p>{message.answer}</p>
                </article>
              ))
            )}
          </div>
          <form className="tu-ask" onSubmit={onAsk}>
            <label className="sr-only" htmlFor="skipper-chat-input">
              Ask anything about Teamulate
            </label>
            <input
              ref={chatInput}
              id="skipper-chat-input"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Ask anything about Teamulate…"
            />
            <button type="submit" className="tu-btn tu-btn-skipper" aria-label="Send">
              <Icon name="arrow" size={16} />
            </button>
          </form>
          {messages.length === 0 ? (
            <ul className="tu-prompts tu-chat-prompts">
              {skipperPrompts.slice(0, 4).map((prompt) => (
                <li key={prompt}>
                  <button type="button" onClick={() => ask(prompt)}>
                    {prompt}
                    <Icon name="chevron" size={14} />
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </section>
      ) : null}

      <dialog ref={topicDialog} className="tu-dialog" aria-labelledby={topicField}>
        <form onSubmit={addTopic}>
          <h2 id={topicField}>New topic</h2>
          <p>It joins the matrix as research in progress. Formats stay empty until you schedule them.</p>
          <label>
            Title
            <input
              value={topicTitle}
              onChange={(event) => setTopicTitle(event.target.value)}
              required
              placeholder="A working title"
            />
          </label>
          <div className="tu-dialog-actions">
            <button type="button" className="tu-btn tu-btn-ghost" onClick={() => topicDialog.current?.close()}>
              Cancel
            </button>
            <button type="submit" className="tu-btn tu-btn-skipper">
              Add topic
            </button>
          </div>
        </form>
      </dialog>
    </div>
  );
}
