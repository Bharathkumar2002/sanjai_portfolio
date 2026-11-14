import type { ReactNode } from "react";
import type { SiteSettings } from "@/lib/types";
import { isPlaceholder } from "@/lib/data/defaults";
import { cn, formatBytes, formatDate, resumeDownloadHref, telHref } from "@/lib/utils";
import { Reveal } from "@/components/motion/Reveal";
import { DownloadIcon, ExternalIcon, FileIcon } from "@/components/ui/icons";
import { Prose } from "./RichText";
import { SectionHeading } from "./SectionHeading";

function Value({ value, href }: { value: string; href?: string | null }) {
  if (isPlaceholder(value)) return <span className="italic text-smoke">{value || "—"}</span>;
  return href ? (
    <a href={href} className="underline-offset-4 hover:text-ember-300 hover:underline">
      {value}
    </a>
  ) : (
    <>{value}</>
  );
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid grid-cols-[7.5rem_1fr] gap-4 py-3.5 sm:grid-cols-[9rem_1fr]">
      <dt className="text-sm text-smoke">{label}</dt>
      <dd className="min-w-0 break-words text-[15px] font-medium text-bone">{children}</dd>
    </div>
  );
}

/** About + Details: bio on the left, key facts and the résumé on the right. */
export function About({ settings: s }: { settings: SiteSettings }) {
  const resumeMeta = [
    "PDF",
    formatBytes(s.resume_size_bytes),
    s.resume_updated_at ? `Updated ${formatDate(s.resume_updated_at)}` : "",
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <section id="about" aria-labelledby="about-title" className="container-page py-16 sm:py-24">
      <SectionHeading
        eyebrow="About"
        title={s.about_headline}
        titleId="about-title"
        aside={s.about_intro ? <p className="text-[15px] leading-relaxed text-mist">{s.about_intro}</p> : undefined}
      />

      <div className="mt-12 grid gap-6 sm:mt-16 lg:grid-cols-12 lg:gap-10">
        <Reveal className="lg:col-span-7">
          <Prose text={s.about_bio} className="text-lg leading-relaxed text-mist [&>p:first-child]:text-bone sm:text-xl" />
        </Reveal>

        <Reveal delay={0.08} className="lg:col-span-5">
          <div id="details" className="scroll-mt-28 rounded-4xl bg-ink-900 p-6 ring-1 ring-white/[0.06] sm:p-8">
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-smoke">Details</h3>
            <dl className="mt-3 divide-y divide-white/[0.06]">
              <Row label="Name"><Value value={s.designer_name} /></Row>
              {s.role_title && <Row label="Role"><Value value={s.role_title} /></Row>}
              <Row label="Currently at"><Value value={s.workplace} /></Row>
              <Row label="Mobile"><Value value={s.contact_phone} href={telHref(s.contact_phone)} /></Row>
              {s.contact_email && <Row label="Email"><Value value={s.contact_email} href={`mailto:${s.contact_email}`} /></Row>}
              {s.location && <Row label="Based in"><Value value={s.location} /></Row>}
              {s.availability && <Row label="Availability"><Value value={s.availability} /></Row>}
            </dl>

            <div id="resume" className="mt-6 rounded-3xl bg-ink-850 p-5 ring-1 ring-inset ring-white/[0.06]">
              <div className="flex items-center gap-4">
                <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-iris-500/15 text-iris-300">
                  <FileIcon size={22} />
                </span>
                <div className="min-w-0">
                  <p className="font-semibold text-bone">Résumé</p>
                  <p className="truncate text-sm text-smoke">{s.resume_url ? resumeMeta : "Coming soon"}</p>
                </div>
              </div>
              {s.resume_url && (
                <div className="mt-5 grid grid-cols-2 gap-3">
                  <a
                    href={s.resume_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      "inline-flex items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition-colors",
                      "bg-white/[0.06] text-bone ring-1 ring-inset ring-white/15 hover:bg-white/10",
                    )}
                  >
                    <ExternalIcon size={16} /> View
                    <span className="sr-only">résumé (opens in a new tab)</span>
                  </a>
                  <a
                    href={resumeDownloadHref(s.resume_url, s.resume_file_name)}
                    download={s.resume_file_name || "resume.pdf"}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-ember-500 px-4 py-2.5 text-sm font-semibold text-ink-950 transition-colors hover:bg-ember-400"
                  >
                    <DownloadIcon size={16} /> Download
                    <span className="sr-only">résumé as PDF</span>
                  </a>
                </div>
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
