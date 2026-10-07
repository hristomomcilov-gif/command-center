import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/icons";
import { NewsArt } from "@/components/home/NewsArt";
import type { HomeNewsItem } from "@/lib/home/types";

export function StoryImage({ image, category }: { image: string | null; category: string }) {
  if (image) return <Image src={image} alt="" fill sizes="(max-width: 760px) 96px, 280px" />;
  return <NewsArt category={category} />;
}

export function NewsCard({ item }: { item: HomeNewsItem }) {
  return (
    <Link href={item.href} className="story">
      <span className="story-art">
        <StoryImage image={item.image} category={item.category} />
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
