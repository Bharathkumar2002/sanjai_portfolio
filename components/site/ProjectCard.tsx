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

/**
 * Image-led project card. Monochrome at rest, full colour on hover/focus.
 * The whole card is one link; the "View Project" pill is decorative.
 */
export function ProjectCard({ project, className, sizes = "(min-width: 1024px) 50vw, 100vw", eager }: Props) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className={cn(
        "group relative isolate block overflow-hidden rounded-4xl bg-ink-800 ring-1 ring-white/5 focus-visible:outline-offset-4",
        className,
      )}
    >
      {project.cover_image ? (
        <Image
          src={project.cover_image}
          alt=""
          fill
          sizes={sizes}
          loading={eager ? "eager" : "lazy"}
          className="-z-10 object-cover grayscale-[0.9] transition-[filter,transform] duration-[1200ms] ease-out-expo group-hover:scale-[1.05] group-hover:grayscale-0 group-focus-visible:scale-[1.05] group-focus-visible:grayscale-0"
        />
      ) : (
        <div className="absolute inset-0 -z-10 grid place-items-center bg-gradient-to-br from-ink-700 to-ink-850 text-white/20">
          <ImageIcon size={48} />
        </div>
      )}
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/85 via-black/20 to-black/10 transition-opacity duration-700 group-hover:opacity-90" />

      <div className="flex h-full flex-col justify-between p-5 sm:p-7">
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-black/35 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-md ring-1 ring-inset ring-white/15">
              {project.category}
            </span>
            {project.project_year && (
              <span className="rounded-full bg-black/35 px-3 py-1.5 text-xs font-medium text-white/80 backdrop-blur-md ring-1 ring-inset ring-white/15">
                {project.project_year}
              </span>
            )}
          </div>
          <span
            aria-hidden="true"
            className="grid size-11 shrink-0 place-items-center rounded-full bg-white text-ink-950 transition-all duration-500 ease-out-expo group-hover:rotate-45 group-hover:bg-ember-500 group-hover:text-white"
          >
            <ArrowUpRight size={18} />
          </span>
        </div>

        <div>
          <h3 className="font-display text-2xl font-semibold tracking-tight text-white sm:text-3xl lg:text-[2.1rem]">
            {project.title}
          </h3>
          {project.short_description && (
            <p className="mt-2 line-clamp-2 max-w-md text-sm leading-relaxed text-white/75 transition-all duration-500 lg:translate-y-2 lg:opacity-0 lg:group-hover:translate-y-0 lg:group-hover:opacity-100 lg:group-focus-visible:translate-y-0 lg:group-focus-visible:opacity-100">
              {project.short_description}
            </p>
          )}
          <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-white">
            View Project
            <span className="h-px w-6 bg-ember-400 transition-all duration-500 group-hover:w-12" aria-hidden="true" />
          </span>
        </div>
      </div>
    </Link>
  );
}
