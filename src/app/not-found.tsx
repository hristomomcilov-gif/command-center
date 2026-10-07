import { QuietPage } from "@/components/shell/QuietPage";

export default function NotFound() {
  return (
    <QuietPage
      title="This page is quiet."
      lede="Nothing is here, and that is fine."
      backHref="/"
    />
  );
}
