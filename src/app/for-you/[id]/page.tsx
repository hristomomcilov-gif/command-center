import { notFound } from "next/navigation";
import { StoryImage } from "@/components/home/NewsCard";
import { QuietPage } from "@/components/shell/QuietPage";
import { composeHomeView } from "@/lib/home/compose";
import { loadHomeSources } from "@/lib/home/sources/load-home-sources";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const now = new Date();
  const view = composeHomeView(await loadHomeSources(now), now);
  const story = view.news.find((item) => item.id === id);
  return { title: story?.headline ?? "For you" };
}

export default async function StoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const now = new Date();
  const view = composeHomeView(await loadHomeSources(now), now);
  const story = view.news.find((item) => item.id === id);
  if (!story) notFound();

  return (
    <QuietPage
      backHref="/for-you"
      backLabel="For you"
      kicker={story.category}
      title={story.headline}
      lede={story.whyItMatters ?? undefined}
    >
      <div className="story-page">
        <div className="story-art">
          <StoryImage image={story.image} category={story.category} />
        </div>
      </div>
      {story.source || story.publishedLabel ? (
        <p className="meta-line">{[story.source, story.publishedLabel].filter(Boolean).join(" · ")}</p>
      ) : null}
    </QuietPage>
  );
}
