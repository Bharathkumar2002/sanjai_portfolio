import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { getSiteSettings } from "@/lib/data/public";
import { socialLinks } from "@/lib/social";
import { isSupabaseConfigured } from "@/lib/supabase/env";

// Public pages are statically generated and refreshed at most every 10 minutes.
// Dashboard edits revalidate them immediately (see lib/actions/admin/*).
export const revalidate = 600;

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings();

  return (
    <>
      <a
        href="#main"
        className="fixed left-4 top-4 z-[100] -translate-y-24 rounded-full bg-bone px-5 py-2.5 text-sm font-medium text-ink-950 transition-transform focus:translate-y-0"
      >
        Skip to content
      </a>
      <Navbar brandName={settings.designer_name} socials={socialLinks(settings)} email={settings.contact_email} />
      <main id="main" tabIndex={-1} className="outline-none">
        {children}
      </main>
      <Footer settings={settings} />
      {!isSupabaseConfigured && (
        <p className="fixed bottom-4 right-4 z-40 rounded-full bg-ink-800/90 px-3.5 py-1.5 text-[11px] font-medium text-mist ring-1 ring-white/10 backdrop-blur">
          Preview mode · placeholder content
        </p>
      )}
    </>
  );
}
