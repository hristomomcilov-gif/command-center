import Link from "next/link";
import { notFound } from "next/navigation";
import { QuietPage } from "@/components/shell/QuietPage";
import { getPriority } from "@/lib/home/sources/temporary-state";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return { title: getPriority(id)?.title ?? "Home" };
}

export default async function PriorityPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const priority = getPriority(id);
  if (!priority) notFound();

  return (
    <QuietPage
      backHref="/"
      title={priority.title}
      lede={priority.context ?? "When you are ready."}
    >
      {priority.projectId && priority.projectName ? (
        <p className="meta-line">
          <Link href={`/projects/${priority.projectId}`}>{priority.projectName}</Link>
        </p>
      ) : null}
    </QuietPage>
  );
}
