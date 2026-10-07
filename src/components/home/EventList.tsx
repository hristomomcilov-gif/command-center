import Link from "next/link";
import type { HomeEvent } from "@/lib/home/types";

export function EventList({ events, linked = true }: { events: HomeEvent[]; linked?: boolean }) {
  return (
    <ul className="event-list">
      {events.map((event) => {
        const className = event.passed ? "event-row is-past" : "event-row";
        const body = (
          <>
            <span className="event-time">{event.timeLabel}</span>
            <span className="event-dot" style={{ background: event.color }} />
            <span className="event-title">{event.title}</span>
          </>
        );
        return (
          <li key={event.id}>
            {linked ? (
              <Link href={event.href} className={className}>
                {body}
              </Link>
            ) : (
              <div id={event.id} className={className}>
                {body}
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
