import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProjectBySlug, getProjectSlugs, getPublishedProjects } from "@/lib/data/public";
import { Reveal } from "@/components/motion/Reveal";
import { Prose } from "@/components/site/RichText";
import { PillLink } from "@/components/ui/PillLink";
import { ArrowLeft, ArrowUpRight } from "@/components/ui/icons";
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

export default async function ProjectPage({ params }: Params) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const all = await getPublishedProjects();
  const index = all.findIndex((p) => p.slug === project.slug);
  const next = all.length > 1 ? all[(index + 1) % all.length] : null;

  const meta = [
    { label: "Category", value: project.category },
    { label: "Year", value: project.project_year ? String(project.project_year) : null },
    { label: "Client", value: project.client_name },
  ].filter((m): m is { label: string; value: string } => Boolean(m.value));

  const sections = [
    { label: "Process", text: project.design_process },
    { label: "Challenge", text: project.challenges },
    { label: "Outcome", text: project.outcome },
  ].filter((s) => s.text.trim());

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.short_description,
    genre: project.category,
    dateCreated: project.project_year ? String(project.project_year) : undefined,
    url: `${siteUrl}/projects/${project.slug}`,
  };

  return (
    <article className="container-page pb-20 pt-28 sm:pt-32">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <Link href="/#work" className="group inline-flex items-center gap-2 text-sm text-mist hover:text-white">
        <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1 motion-reduce:transition-none" />
        Back to work
      </Link>

      <div className="mt-8 grid gap-10 lg:grid-cols-12 lg:gap-14">
        {/* Artwork */}
        <Reveal className="lg:col-span-6">
          {project.cover_image && (
            <div className="relative aspect-[4/5] overflow-hidden rounded-4xl bg-ink-800 ring-1 ring-white/[0.06] lg:sticky lg:top-28">
              <Image src={project.cover_image} alt={`${project.title} — final artwork`} fill preload sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
            </div>
          )}
        </Reveal>

        {/* Story */}
        <div className="lg:col-span-6 lg:pt-4">
          <Reveal>
            <p className="text-sm font-semibold text-ember-400">{project.category}</p>
            <h1 className="mt-3 text-[clamp(2.4rem,5vw,4rem)] font-extrabold leading-[1.02] tracking-[-0.035em] text-balance">{project.title}</h1>
            {project.short_description && <p className="mt-5 text-lg leading-relaxed text-mist text-pretty">{project.short_description}</p>}
            {meta.length > 0 && (
              <dl className="mt-8 grid grid-cols-3 gap-4 border-y border-white/10 py-5">
                {meta.map((m) => (
                  <div key={m.label} className="min-w-0">
                    <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-smoke">{m.label}</dt>
                    <dd className="mt-1 truncate text-[15px] font-medium text-bone">{m.value}</dd>
                  </div>
                ))}
              </dl>
            )}
          </Reveal>

          {project.description.trim() && (
            <Reveal className="mt-8">
              <Prose text={project.description} className="text-[17px] leading-relaxed text-mist" />
            </Reveal>
          )}

          {sections.map((s) => (
            <Reveal key={s.label} className="mt-10">
              <h2 className="text-xl font-bold tracking-tight">{s.label}</h2>
              <Prose text={s.text} className="mt-3 text-[17px] leading-relaxed text-mist" />
            </Reveal>
          ))}
        </div>
      </div>

      {project.project_images.length > 0 && (
        <div className="mt-16 grid gap-4 sm:grid-cols-2">
          {project.project_images.map((img, i) => (
            <Reveal key={img.id}>
              <figure>
                <div className="relative aspect-[4/5] overflow-hidden rounded-4xl bg-ink-800">
                  <Image src={img.image_url} alt={img.alt_text || `${project.title} — image ${i + 1}`} fill sizes="(min-width: 640px) 50vw, 100vw" className="object-cover" />
                </div>
                {img.caption && <figcaption className="mt-3 text-sm text-smoke">{img.caption}</figcaption>}
              </figure>
            </Reveal>
          ))}
        </div>
      )}

      <div className="mt-16 flex flex-col gap-4 border-t border-white/10 pt-10 sm:flex-row sm:items-center sm:justify-between">
        {next ? (
          <Link href={`/projects/${next.slug}`} className="group flex items-center gap-4">
            <span className="text-sm text-smoke">Next</span>
            <span className="text-2xl font-bold tracking-tight group-hover:text-ember-300">{next.title}</span>
            <span className="grid size-10 place-items-center rounded-full ring-1 ring-white/15 transition-colors group-hover:bg-ember-500 group-hover:text-ink-950">
              <ArrowUpRight size={16} />
            </span>
          </Link>
        ) : (
          <span />
        )}
        <PillLink href="/#contact" variant="accent">
          Start a project
        </PillLink>
      </div>
    </article>
  );
}
