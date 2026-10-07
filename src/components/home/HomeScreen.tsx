"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Icon, WeatherGlyph } from "@/components/icons";
import { EventList } from "@/components/home/EventList";
import { GlanceList } from "@/components/home/GlanceList";
import { NewsCard } from "@/components/home/NewsCard";
import { ThreeThingsCard } from "@/components/home/ThreeThingsCard";
import { HeroScene } from "@/components/shell/scenes";
import { composeHomeView } from "@/lib/home/compose";
import type { HomeClearWindow, HomeSources, HomeViewModel } from "@/lib/home/types";

export function HomeScreen({ sources, initialNow }: { sources: HomeSources; initialNow: string }) {
  const [nowIso, setNowIso] = useState(initialNow);
  const view = useMemo(() => composeHomeView(sources, new Date(nowIso)), [sources, nowIso]);

  useEffect(() => {
    const tick = () => setNowIso(new Date().toISOString());
    tick();
    const id = window.setInterval(tick, 15000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.period = view.period;
    root.dataset.weekend = view.weekend ? "true" : "false";
    root.dataset.weather = view.weather?.kind ?? "clear";
  }, [view.period, view.weekend, view.weather?.kind]);

  const className = ["home", view.news.length > 0 ? "has-news" : "", view.attention ? "has-attention" : ""]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={className}>
      <Hero view={view} nowIso={nowIso} />
      <StartHere view={view} />
      <Today view={view} />
      {view.news.length > 0 ? <ForYou view={view} /> : null}
      <ThreeThingsCard items={view.priorities} empty={view.empty.priorities} />
      <Glance view={view} />
      {view.attention ? <Attention view={view} /> : null}
      <Thought view={view} />
    </div>
  );
}

function Hero({ view, nowIso }: { view: HomeViewModel; nowIso: string }) {
  return (
    <header className="hero">
      <HeroScene />
      <div className="hero-scrim" />
      <div className="hero-veil" />
      <div className="hero-copy">
        <div className="hero-top">
          <div className="hero-ident">
            <h1>{view.greeting}</h1>
            <p className="hero-date">{view.dateLabel}</p>
          </div>
          <p className="hero-clock">
            <span className="sr-only">Local time</span>
            <time dateTime={nowIso}>{view.timeLabel}</time>
          </p>
          {view.weather ? (
            <p className="hero-weather">
              <WeatherGlyph kind={view.weather.kind} />
              <span>{view.weather.summary}</span>
            </p>
          ) : null}
        </div>
        <p className="hero-line">{view.heroMessage}</p>
      </div>
    </header>
  );
}

function StartHere({ view }: { view: HomeViewModel }) {
  return (
    <section className="panel start" aria-labelledby="start-here-title">
      <div className="section-head">
        <span className="section-icon" aria-hidden="true">
          <Icon name="arrow" size={16} />
        </span>
        <h2 id="start-here-title">Start here</h2>
      </div>
      {view.primary ? (
        <Link className="start-body" href={view.primary.href}>
          <span className="doc" aria-hidden="true">
            <Icon name="doc" />
          </span>
          <span className="start-copy">
            <span className="task-title">{view.primary.title}</span>
            <span className="task-context">{view.primary.context}</span>
          </span>
          <span className="go" aria-hidden="true">
            <Icon name="chevron" size={16} />
          </span>
        </Link>
      ) : (
        <p className="empty">{view.empty.primary}</p>
      )}
    </section>
  );
}

function Today({ view }: { view: HomeViewModel }) {
  return (
    <section className="panel today" aria-labelledby="today-title">
      <div className="section-head">
        <span className="section-icon" aria-hidden="true">
          <Icon name="calendar" size={16} />
        </span>
        <h2 id="today-title">Today</h2>
        <Link href="/calendar" className="icon-link" aria-label="Open today">
          <Icon name="chevron" size={16} />
        </Link>
      </div>
      {view.events.length === 0 ? (
        <p className="empty">{view.empty.calendar}</p>
      ) : (
        <div className="today-body">
          <EventList events={view.events} />
          {view.clearWindow ? <ClearWindow block={view.clearWindow} /> : null}
        </div>
      )}
    </section>
  );
}

function ClearWindow({ block }: { block: HomeClearWindow }) {
  return (
    <div className="clear-panel">
      <p className="clear-time">{block.timeLabel}</p>
      <p className="clear-name">{block.name}</p>
      <span className="clear-sun" aria-hidden="true">
        <Icon name="sun" />
      </span>
    </div>
  );
}

function ForYou({ view }: { view: HomeViewModel }) {
  return (
    <section className="panel news" aria-labelledby="for-you-title">
      <div className="section-head">
        <span className="section-icon" aria-hidden="true">
          <Icon name="star" size={16} />
        </span>
        <h2 id="for-you-title">For you</h2>
        <Link href="/for-you" className="view-all">
          View all
          <Icon name="chevron" size={15} />
        </Link>
      </div>
      <div className="news-grid">
        {view.news.map((item) => (
          <NewsCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}

function Glance({ view }: { view: HomeViewModel }) {
  return (
    <section className="panel glance" aria-labelledby="glance-title">
      <div className="section-head">
        <span className="section-icon" aria-hidden="true">
          <Icon name="mail" size={16} />
        </span>
        <h2 id="glance-title">Worth a glance</h2>
      </div>
      {view.emails.length === 0 ? (
        <p className="empty">{view.empty.email}</p>
      ) : (
        <GlanceList emails={view.emails} />
      )}
    </section>
  );
}

function Attention({ view }: { view: HomeViewModel }) {
  if (!view.attention) return null;
  const item = view.attention;
  return (
    <aside className="attention" aria-label="Worth knowing">
      <p className="attention-lead">{item.lead}</p>
      {item.href ? (
        <Link href={item.href} className="attention-link">
          {item.title}
          <Icon name="chevron" size={15} />
        </Link>
      ) : (
        <p className="attention-link">{item.title}</p>
      )}
      {item.context ? <p className="attention-context">{item.context}</p> : null}
    </aside>
  );
}

function Thought({ view }: { view: HomeViewModel }) {
  return (
    <section className="panel thought" aria-labelledby="thought-title">
      <div className="thought-copy">
        <h2 id="thought-title" className="thought-kicker">
          <Icon name="leaf" size={16} />
          A thought for today
        </h2>
        <p className="thought-quote">{view.thought}</p>
      </div>
      {view.later ? (
        <p className="later">
          <Icon name="sun" size={16} />
          <span>{view.later}</span>
        </p>
      ) : null}
    </section>
  );
}
