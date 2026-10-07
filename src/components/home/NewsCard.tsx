import Link from "next/link";
import { Icon } from "@/components/icons";
import { NewsArt } from "@/components/home/NewsArt";
import type { HomeNewsItem } from "@/lib/home/types";

export function NewsCard({ item }: { item: HomeNewsItem }) {
  return (
    <Link href={item.href} className="story">
      <span className="story-art">
        <NewsArt category={item.category} />
      </span>
      <span className="story-copy">
        <span className="kicker">{item.category}</span>
        <h3>{item.headline}</h3>
        {item.whyItMatters ? <p className="why">{item.whyItMatters}</p> : null}
      </span>
      <Icon name="chevron" />
    </Link>
  );
}
