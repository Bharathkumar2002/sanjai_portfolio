import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProjectBySlug, getProjectSlugs, getPublishedProjects } from "@/lib/data/public";
import { Reveal } from "@/components/motion/Reveal";
import { Prose } from "@/components/site/RichText";
import { PillLink } from "@/components/ui/PillLink";
import { ArrowLeft, ArrowUpRight } from "@/components/ui/icons";
import { cn } from "@/lib/utils";
import { siteUrl } from "@/lib/supabase/env";

type Params = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const slugs = await getProjectSlugs();
  return slugs.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return { title: "Project not found" };
  const description = project.short_description || project.description.slice(0, 160);
  return {
    title: project.title,
    description,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: {
      type: "article",
      title: project.title,
      description,
      url: `/projects/${project.slug}`,
      images: project.cover_image ? [{ url: project.cover_image, alt: project.title }] : undefined,
    },
    twitter: { card: "summary_large_image", title: project.title, description },
  };
}

function CaseSection({ label, index, text }: { label: string; index: string; text: string }) {
  if (!text.trim()) return null;
  return (
    <Reveal>
      <section className="grid gap-6 border-t border-white/10 py-12 sm:py-16 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <p className="text-sm font-medium text-ember-500">{index}</p>
          <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">{label}</h2>
        </div>
        <Prose text={text} className="text-lg leading-relaxed text-mist lg:col-span-7 lg:col-start-6" />
      </section>
    </Reveal>
  );
}

export default async function ProjectPage({ params }: Params) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const all = await getPublishedProjects();
  const index = all.findIndex((p) => p.slug === project.slug);
  const next = all.length > 1 ? all[(index + 1) % all.length] : null;

  const meta = [
    { label: "Client", value: project.client_name },
    { label: "Category", value: project.category },
    { label: "Year", value: project.project_year ? String(project.project_year) : null },
  ].filter((m): m is { label: string; value: string } => Boolean(m.value));

  const sections = [
    { label: "Design process", text: project.design_process },
    { label: "Challenges", text: project.challenges },
    { label: "Outcome", text: project.outcome },
  ].filter((s) => s.text.trim());

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.short_description,
    genre: project.category,
    dateCreated: project.project_year ? String(project.project_year) : undefined,
    image: project.cover_image ?? undefined,
    url: `${siteUrl}/projects/${project.slug}`,
  };

  return (
    <article className="pb-16 pt-28 sm:pt-36">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <div className="container-page">
        <Link href="/projects" className="group inline-flex items-center gap-2 text-sm text-mist hover:text-white">
          <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
          All projects
        </Link>

        <header className="mt-10 grid gap-10 lg:grid-cols-12 lg:items-end">
          <Reveal className="lg:col-span-8">
            <p className="text-sm font-medium text-ember-500">{project.category}</p>
            <h1 className="mt-3 font-display text-[clamp(2.8rem,8vw,7.5rem)] font-bold leading-[0.9] tracking-[-0.055em] text-balance">
              {project.title}
            </h1>
          </Reveal>
          {project.short_description && (
            <Reveal delay={0.1} className="lg:col-span-4">
              <p className="text-lg leading-relaxed text-mist text-pretty">{project.short_description}</p>
            </Reveal>
          )}
        </header>

        {meta.length > 0 && (
          <Reveal delay={0.15}>
            <dl className="mt-12 grid grid-cols-2 gap-6 border-y border-white/10 py-6 sm:grid-cols-4">
              {meta.map((m) => (
                <div key={m.label}>
                  <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-smoke">{m.label}</dt>
                  <dd className="mt-1.5 font-medium text-bone">{m.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        )}
      </div>

      {project.cover_image && (
        <Reveal className="container-page mt-10 sm:mt-14">
          <div className="relative aspect-[4/3] overflow-hidden rounded-4xl bg-ink-800 sm:aspect-[16/9]">
            <Image src={project.cover_image} alt={`${project.title} — cover`} fill preload sizes="100vw" className="object-cover" />
          </div>
        </Reveal>
      )}

      <div className="container-page mt-12 sm:mt-20">
        {project.description.trim() && (
          <CaseSection label="Overview" index="01" text={project.description} />
        )}

        {project.project_images.length > 0 && (
          <div className="grid gap-4 py-6 sm:grid-cols-2 lg:gap-5">
            {project.project_images.map((img, i) => {
              // Rhythm: one full-width image, then a pair, repeating.
              const full = i % 3 === 0 || (i === project.project_images.length - 1 && i % 3 === 1);
              return (
                <Reveal key={img.id} delay={full ? 0 : (i % 3) * 0.06} className={cn(full && "sm:col-span-2")}>
                  <figure>
                    <div className={cn("relative overflow-hidden rounded-4xl bg-ink-800", full ? "aspect-[4/3] sm:aspect-[16/9]" : "aspect-[4/5]")}>
                      <Image
                        src={img.image_url}
                        alt={img.alt_text || `${project.title} — image ${i + 1}`}
                        fill
                        sizes={full ? "100vw" : "(min-width: 640px) 50vw, 100vw"}
                        className="object-cover"
                      />
                    </div>
                    {img.caption && <figcaption className="mt-3 text-sm text-smoke">{img.caption}</figcaption>}
                  </figure>
                </Reveal>
              );
            })}
          </div>
        )}

        {sections.map((s, i) => (
          <CaseSection key={s.label} label={s.label} index={String(i + (project.description.trim() ? 2 : 1)).padStart(2, "0")} text={s.text} />
        ))}
      </div>

      <div className="container-page mt-12 grid gap-4 lg:grid-cols-2">
        {next && (
          <Link
            href={`/projects/${next.slug}`}
            className="group relative isolate flex min-h-[18rem] flex-col justify-between overflow-hidden rounded-4xl bg-ink-800 p-8 ring-1 ring-white/5 sm:p-10"
          >
            {next.cover_image && (
              <Image
                src={next.cover_image}
                alt=""
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="-z-10 object-cover opacity-40 grayscale transition-all duration-1000 ease-out-expo group-hover:scale-105 group-hover:opacity-60 group-hover:grayscale-0"
              />
            )}
            <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/80 to-black/20" />
            <p className="text-sm font-medium text-white/70">Next project</p>
            <div className="flex items-end justify-between gap-6">
              <p className="font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl">{next.title}</p>
              <span className="grid size-12 shrink-0 place-items-center rounded-full bg-white text-ink-950 transition-all duration-500 group-hover:rotate-45 group-hover:bg-ember-500 group-hover:text-white">
                <ArrowUpRight size={20} />
              </span>
            </div>
          </Link>
        )}
        <div className={cn("grain relative flex min-h-[18rem] flex-col justify-between overflow-hidden rounded-4xl bg-[radial-gradient(130%_120%_at_0%_0%,#ff8a4c,#ff5f1f_40%,#c92a12)] p-8 sm:p-10", !next && "lg:col-span-2")}>
          <p className="text-sm font-medium text-white/85">Like what you see?</p>
          <div className="flex flex-col items-start gap-6">
            <p className="font-display text-4xl font-semibold leading-[1] tracking-tight text-white sm:text-5xl">
              Let&apos;s build your brand next.
            </p>
            <PillLink href="/#contact" variant="dark">
              Start a project
            </PillLink>
          </div>
        </div>
      </div>
    </article>
  );
}
