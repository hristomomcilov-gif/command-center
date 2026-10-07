import { notFound } from "next/navigation";
import { QuietPage } from "@/components/shell/QuietPage";
import { getProject } from "@/lib/home/sources/temporary-state";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return { title: getProject(id)?.name ?? "Projects" };
}

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = getProject(id);
  if (!project) notFound();

  return <QuietPage backHref="/projects" backLabel="Projects" title={project.name} lede={project.summary} />;
}
