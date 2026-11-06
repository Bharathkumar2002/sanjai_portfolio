import Link from "next/link";
import type { ProjectSummary } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/motion/Reveal";
import { PillLink } from "@/components/ui/PillLink";
import { ArrowRight } from "@/components/ui/icons";
import { ProjectCard } from "./ProjectCard";
import { SectionHeading } from "./SectionHeading";

/**
 * Asymmetric rhythm that repeats every five projects:
 *   [ 7 | 5 ]  [ 5 | 7 ]  [ —— 12 —— ]
 */
const layout = [
  { span: "md:col-span-7", h: "h-[26rem] md:h-[30rem] lg:h-[36rem]", sizes: "(min-width: 768px) 58vw, 100vw" },
  { span: "md:col-span-5", h: "h-[26rem] md:h-[30rem] lg:h-[36rem]", sizes: "(min-width: 768px) 42vw, 100vw" },
  { span: "md:col-span-5", h: "h-[26rem] md:h-[30rem] lg:h-[36rem]", sizes: "(min-width: 768px) 42vw, 100vw" },
  { span: "md:col-span-7", h: "h-[26rem] md:h-[30rem] lg:h-[36rem]", sizes: "(min-width: 768px) 58vw, 100vw" },
  { span: "md:col-span-12", h: "h-[26rem] md:h-[32rem] lg:h-[40rem]", sizes: "100vw" },
];

export function FeaturedProjects({ projects }: { projects: ProjectSummary[] }) {
  // With an odd tail, let the last card span the full row instead of leaving a gap.
  const lastIsAlone = projects.length % 5 === 1 || projects.length % 5 === 3;

  return (
    <section id="projects" aria-labelledby="projects-title" className="container-page pb-12 pt-20 sm:pb-16 sm:pt-28">
      <SectionHeading
        eyebrow="Selected Work"
        title="Featured *Projects*"
        titleId="projects-title"
        aside={
          <div className="space-y-6">
            <p className="text-[15px] leading-relaxed text-mist">
              A selection of identities, packaging and campaigns — each one built around a clear idea and finished with care.
            </p>
            <Link
              href="/projects"
              className="group inline-flex items-center gap-3 text-sm font-medium text-bone"
            >
              View all projects
              <span className="grid size-9 place-items-center rounded-full ring-1 ring-white/20 transition-colors group-hover:bg-ember-500 group-hover:ring-ember-500">
                <ArrowRight size={16} />
              </span>
            </Link>
          </div>
        }
      />

      {projects.length > 0 ? (
        <div className="mt-14 grid grid-cols-1 gap-4 sm:mt-20 md:grid-cols-12 lg:gap-5">
          {projects.map((project, i) => {
            const l = layout[i % layout.length];
            const isLast = i === projects.length - 1;
            return (
              <Reveal key={project.id} delay={(i % 2) * 0.08} className={cn(isLast && lastIsAlone ? "md:col-span-12" : l.span)}>
                <ProjectCard project={project} className={l.h} sizes={l.sizes} />
              </Reveal>
            );
          })}
        </div>
      ) : (
        <Reveal className="mt-14">
          <div className="flex flex-col items-start gap-6 rounded-4xl border border-dashed border-white/15 bg-ink-900 p-10 sm:p-14">
            <p className="font-display text-3xl font-semibold tracking-tight">New work is on its way.</p>
            <p className="max-w-lg text-mist">
              Case studies are being prepared right now. In the meantime, I&apos;d love to hear about what you&apos;re building.
            </p>
            <PillLink href="/#contact" variant="accent">
              Start a conversation
            </PillLink>
          </div>
        </Reveal>
      )}
    </section>
  );
}
