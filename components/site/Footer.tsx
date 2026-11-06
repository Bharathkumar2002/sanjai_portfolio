import Link from "next/link";
import type { SiteSettings } from "@/lib/types";
import { NAV_LINKS, socialLinks } from "@/lib/social";
import { PillLink } from "@/components/ui/PillLink";
import { BackToTop } from "./BackToTop";

export function Footer({ settings: s }: { settings: SiteSettings }) {
  const socials = socialLinks(s);
  const year = new Date().getFullYear();

  return (
    <footer className="container-page pb-4 pt-8 sm:pb-6">
      <div className="relative overflow-hidden rounded-5xl bg-ink-900 px-6 pt-12 ring-1 ring-white/5 sm:px-10 sm:pt-16 lg:px-14">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <p className="font-display text-[clamp(2rem,4.4vw,3.6rem)] font-semibold leading-[1] tracking-[-0.04em] text-balance">
              Got an idea? <span className="text-smoke">Let&apos;s make it </span>
              <em className="font-serif font-normal italic text-ember-400">unforgettable.</em>
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <PillLink href="/#contact" variant="accent">
                Let&apos;s Talk
              </PillLink>
              {s.contact_email && (
                <a href={`mailto:${s.contact_email}`} className="text-sm text-mist underline-offset-4 hover:text-white hover:underline">
                  {s.contact_email}
                </a>
              )}
            </div>
          </div>

          <nav aria-label="Footer" className="lg:col-span-2 lg:col-start-8">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-smoke">Navigate</p>
            <ul className="space-y-2.5 text-[15px]">
              {NAV_LINKS.map((l) => (
                <li key={l.id}>
                  <Link href={l.href} className="text-mist transition-colors hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/projects" className="text-mist transition-colors hover:text-white">
                  All work
                </Link>
              </li>
            </ul>
          </nav>

          {socials.length > 0 && (
            <div className="lg:col-span-2">
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-smoke">Follow</p>
              <ul className="space-y-2.5 text-[15px]">
                {socials.map((l) => (
                  <li key={l.label}>
                    <a href={l.href} target="_blank" rel="noopener noreferrer" className="text-mist transition-colors hover:text-white">
                      {l.label} ↗
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex items-start lg:col-span-1 lg:justify-end">
            <BackToTop />
          </div>
        </div>

        {/* Oversized wordmark */}
        <p
          aria-hidden="true"
          className="pointer-events-none mt-16 select-none whitespace-nowrap text-center font-display text-[clamp(4.5rem,22vw,20rem)] font-bold leading-[0.75] tracking-[-0.07em] text-transparent bg-gradient-to-b from-white/15 to-white/0 bg-clip-text"
        >
          {s.brand_name}
        </p>

        <div className="relative -mx-6 flex flex-col gap-2 border-t border-white/5 px-6 py-6 text-xs text-smoke sm:-mx-10 sm:flex-row sm:items-center sm:justify-between sm:px-10 lg:-mx-14 lg:px-14">
          <p>
            © {year} {s.designer_name}. All rights reserved.
          </p>
          <p>{s.role_title}{s.location ? ` · ${s.location}` : ""}</p>
        </div>
      </div>
    </footer>
  );
}
