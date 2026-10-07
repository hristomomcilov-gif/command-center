import { QuietPage } from "@/components/shell/QuietPage";

export const metadata = { title: "Settings" };

export default function SettingsPage() {
  return (
    <QuietPage
      title="Settings"
      lede="Home already follows the day. Finer preferences can come later."
    />
  );
}
