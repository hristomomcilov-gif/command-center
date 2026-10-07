import Link from "next/link";
import { QuietPage } from "@/components/shell/QuietPage";
import { projects } from "@/lib/home/sources/temporary-state";

export const metadata = { title: "Projects" };

export default function ProjectsPage() {
  return (
    <QuietPage title="Projects" lede="Names only. The metrics can stay elsewhere.">
      <ul className="quiet-list">
        {projects.map((project) => (
          <li key={project.id}>
            <Link href={`/projects/${project.id}`}>
              <strong>{project.name}</strong>
              <span>{project.summary}</span>
            </Link>
          </li>
        ))}
      </ul>
    </QuietPage>
  );
}
