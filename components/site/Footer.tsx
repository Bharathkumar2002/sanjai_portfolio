import Link from "next/link";
import type { SiteSettings } from "@/lib/types";
import { NAV_LINKS, socialLinks } from "@/lib/social";
import { BackToTop } from "./BackToTop";

export function Footer({ settings: s }: { settings: SiteSettings }) {
  const socials = socialLinks(s);
  const year = new Date().getFullYear();

  return (
    <footer className="container-page pb-6 pt-4">
      <div className="rounded-4xl bg-ink-900 px-6 py-10 ring-1 ring-white/[0.06] sm:px-10">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div>
            <Link href="/" className="text-lg font-bold tracking-tight">
              {s.designer_name}
              <span className="text-ember-400">.</span>
            </Link>
            <p className="mt-2 text-sm text-smoke">
              {[s.role_title, s.workplace && `at ${s.workplace}`].filter(Boolean).join(" ")}
            </p>
          </div>

          <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-1 text-sm">
            {NAV_LINKS.map((l) => (
              <Link key={l.id} href={l.href} className="inline-flex min-h-10 items-center text-mist transition-colors hover:text-white sm:min-h-8">
                {l.label}
              </Link>
            ))}
            {s.resume_url && (
              <Link href="/#details" className="inline-flex min-h-10 items-center text-mist transition-colors hover:text-white sm:min-h-8">
                Résumé
              </Link>
            )}
            {socials.map((l) => (
              <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-10 items-center text-mist transition-colors hover:text-white sm:min-h-8">
                {l.label} ↗
              </a>
            ))}
          </nav>

          <BackToTop />
        </div>
        <p className="mt-10 border-t border-white/[0.06] pt-6 text-xs text-smoke">
          © {year} {s.designer_name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
