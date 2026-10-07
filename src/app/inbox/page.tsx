import { GlanceList } from "@/components/home/GlanceList";
import { QuietPage } from "@/components/shell/QuietPage";
import { composeHomeView } from "@/lib/home/compose";
import { loadHomeSources } from "@/lib/home/sources/load-home-sources";

export const metadata = { title: "Worth a glance" };

export default async function InboxPage() {
  const now = new Date();
  const view = composeHomeView(await loadHomeSources(now), now);

  return (
    <QuietPage title="Worth a glance" lede="Only what may actually need you.">
      {view.emails.length === 0 ? <p className="empty">{view.empty.email}</p> : <GlanceList emails={view.emails} />}
    </QuietPage>
  );
}
