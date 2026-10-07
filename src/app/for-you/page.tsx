import { NewsCard } from "@/components/home/NewsCard";
import { QuietPage } from "@/components/shell/QuietPage";
import { composeHomeView } from "@/lib/home/compose";
import { loadHomeSources } from "@/lib/home/sources/load-home-sources";

export const metadata = { title: "For you" };

export default async function ForYouPage() {
  const now = new Date();
  const view = composeHomeView(await loadHomeSources(now), now);

  return (
    <QuietPage title="For you" lede="A short list, on purpose.">
      {view.news.length === 0 ? null : (
        <div className="news-grid">
          {view.news.map((item) => (
            <NewsCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </QuietPage>
  );
}
