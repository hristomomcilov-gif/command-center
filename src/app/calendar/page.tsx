import { EventList } from "@/components/home/EventList";
import { QuietPage } from "@/components/shell/QuietPage";
import { composeHomeView } from "@/lib/home/compose";
import { loadHomeSources } from "@/lib/home/sources/load-home-sources";

export const metadata = { title: "Calendar" };

export default async function CalendarPage() {
  const now = new Date();
  const view = composeHomeView(await loadHomeSources(now), now);

  return (
    <QuietPage title="Today" lede="The shape of the day, nothing more.">
      {view.events.length === 0 ? (
        <p className="empty">{view.empty.calendar}</p>
      ) : (
        <EventList events={view.events} linked={false} />
      )}
      {view.clearWindow ? (
        <p className="meta-line">
          {view.clearWindow.timeLabel} · {view.clearWindow.name}
        </p>
      ) : null}
    </QuietPage>
  );
}
