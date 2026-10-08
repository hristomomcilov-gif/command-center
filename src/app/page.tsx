import { HomeScreen } from "@/components/home/HomeScreen";
import { loadHomeSources } from "@/lib/home/sources/load-home-sources";

export const metadata = {
  title: "Command Center",
};

export default async function HomePage() {
  const now = new Date();
  const sources = await loadHomeSources(now);
  return <HomeScreen sources={sources} initialNow={now.toISOString()} />;
}
