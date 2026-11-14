import type { ProjectSummary } from "@/lib/types";
import { Reveal } from "@/components/motion/Reveal";
import { PillLink } from "@/components/ui/PillLink";
import { ProjectCard } from "./ProjectCard";
import { SectionHeading } from "./SectionHeading";

export function Work({ projects }: { projects: ProjectSummary[] }) {
  return (
    <section id="work" aria-labelledby="work-title" className="container-page py-16 sm:py-24">
      <SectionHeading
        eyebrow="Selected work"
        title="Recent *samples*"
        titleId="work-title"
        aside={<p className="text-[15px] leading-relaxed text-mist">Product posters and launch visuals. Select a piece to see the thinking behind it.</p>}
      />

      {projects.length > 0 ? (
        <ul className="mt-12 grid gap-x-5 gap-y-10 sm:mt-16 sm:grid-cols-2 xl:grid-cols-4">
          {projects.map((project, i) => (
            <li key={project.id}>
              <Reveal delay={(i % 4) * 0.06}>
                <ProjectCard project={project} eager={i < 2} />
              </Reveal>
            </li>
          ))}
        </ul>
      ) : (
        <Reveal className="mt-12">
          <div className="flex flex-col items-start gap-5 rounded-4xl border border-dashed border-white/15 bg-ink-900 p-10">
            <p className="text-2xl font-semibold tracking-tight">New work is on its way.</p>
            <p className="max-w-lg text-mist">Samples are being prepared. In the meantime, feel free to get in touch.</p>
            <PillLink href="/#contact" variant="accent">
              Get in touch
            </PillLink>
          </div>
        </Reveal>
      )}
    </section>
  );
}
