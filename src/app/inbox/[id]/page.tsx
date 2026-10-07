import { notFound } from "next/navigation";
import { QuietPage } from "@/components/shell/QuietPage";
import { composeHomeView } from "@/lib/home/compose";
import { loadHomeSources } from "@/lib/home/sources/load-home-sources";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const now = new Date();
  const view = composeHomeView(await loadHomeSources(now), now);
  const email = view.emails.find((item) => item.id === id);
  return { title: email?.subject ?? "Worth a glance" };
}

export default async function EmailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const now = new Date();
  const view = composeHomeView(await loadHomeSources(now), now);
  const email = view.emails.find((item) => item.id === id);
  if (!email) notFound();

  return (
    <QuietPage
      backHref="/inbox"
      backLabel="Worth a glance"
      kicker={email.sender}
      title={email.subject}
      lede={email.context ?? undefined}
    >
      <p className="meta-line">{email.timeLabel}</p>
    </QuietPage>
  );
}
