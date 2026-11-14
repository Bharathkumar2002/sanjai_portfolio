import Image from "next/image";
import Link from "next/link";
import type { ProjectSummary } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ArrowUpRight, ImageIcon } from "@/components/ui/icons";

type Props = {
  project: ProjectSummary;
  className?: string;
  sizes?: string;
  /** Load immediately (above-the-fold cards). */
  eager?: boolean;
};

/** Poster-style card: the artwork in a 4:5 frame, title and category beneath. */
export function ProjectCard({ project, className, sizes = "(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw", eager }: Props) {
  return (
    <Link href={`/projects/${project.slug}`} className={cn("group block rounded-4xl focus-visible:outline-offset-4", className)}>
      <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-ink-800 ring-1 ring-white/[0.06] transition duration-500 ease-out-expo group-hover:-translate-y-1.5 group-hover:shadow-[0_30px_60px_-25px_rgba(0,0,0,0.7)] group-hover:ring-white/20 motion-reduce:transition-none motion-reduce:group-hover:translate-y-0">
        {project.cover_image ? (
          <Image
            src={project.cover_image}
            alt={`${project.title} — ${project.category}`}
            fill
            sizes={sizes}
            loading={eager ? "eager" : "lazy"}
            className="object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          />
        ) : (
          <span className="grid h-full place-items-center text-white/20">
            <ImageIcon size={40} />
          </span>
        )}
      </div>
      <div className="mt-4 flex items-start justify-between gap-4 px-1">
        <div className="min-w-0">
          <h3 className="truncate text-lg font-semibold tracking-tight text-bone">{project.title}</h3>
          <p className="mt-0.5 text-sm text-smoke">
            {project.category}
            {project.project_year ? ` · ${project.project_year}` : ""}
          </p>
        </div>
        <span
          aria-hidden="true"
          className="grid size-10 shrink-0 place-items-center rounded-full ring-1 ring-white/15 text-bone transition-colors duration-300 group-hover:bg-ember-500 group-hover:text-ink-950 group-hover:ring-ember-500"
        >
          <ArrowUpRight size={16} />
        </span>
      </div>
    </Link>
  );
}
