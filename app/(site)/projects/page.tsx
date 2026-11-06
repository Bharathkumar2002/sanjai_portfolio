import type { Metadata } from "next";
import { getPublishedProjects } from "@/lib/data/public";
import { SectionHeading } from "@/components/site/SectionHeading";
import { ProjectsGallery } from "@/components/site/ProjectsGallery";
import { PillLink } from "@/components/ui/PillLink";

export const metadata: Metadata = {
  title: "Work",
  description: "Brand identity, packaging, poster, illustration and UI/UX projects.",
  alternates: { canonical: "/projects" },
};

export default async function ProjectsPage() {
  const projects = await getPublishedProjects();

  return (
    <div className="container-page pb-16 pt-32 sm:pt-40">
      <SectionHeading
        as="h1"
        eyebrow="Portfolio"
        title="Selected *work*"
        aside={
          <p className="text-[15px] leading-relaxed text-mist">
            Identity systems, packaging, campaigns and interfaces — each project starts with a clear idea and ends with
            obsessive craft.
          </p>
        }
      />
      <div className="mt-14 sm:mt-20">
        {projects.length > 0 ? (
          <ProjectsGallery projects={projects} />
        ) : (
          <div className="flex flex-col items-start gap-6 rounded-4xl border border-dashed border-white/15 bg-ink-900 p-10 sm:p-14">
            <p className="font-display text-3xl font-semibold tracking-tight">No projects published yet.</p>
            <p className="max-w-lg text-mist">New case studies are on their way. Want to be one of them?</p>
            <PillLink href="/#contact" variant="accent">
              Start a project
            </PillLink>
          </div>
        )}
      </div>
    </div>
  );
}
