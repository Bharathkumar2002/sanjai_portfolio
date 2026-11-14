import { Hero } from "@/components/site/Hero";
import { Work } from "@/components/site/Work";
import { ClientsStrip } from "@/components/site/ClientsStrip";
import { About } from "@/components/site/About";
import { Services } from "@/components/site/Services";
import { Contact } from "@/components/site/Contact";
import { getClients, getPublishedProjects, getServices, getSiteSettings } from "@/lib/data/public";
import { isPlaceholder } from "@/lib/data/defaults";
import { siteUrl } from "@/lib/supabase/env";
import { socialLinks } from "@/lib/social";

export default async function HomePage() {
  const [settings, services, clients, projects] = await Promise.all([
    getSiteSettings(),
    getServices(),
    getClients(),
    getPublishedProjects(),
  ]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: isPlaceholder(settings.designer_name) ? undefined : settings.designer_name,
    jobTitle: settings.role_title,
    worksFor: settings.workplace ? { "@type": "Organization", name: settings.workplace } : undefined,
    url: siteUrl,
    email: settings.contact_email || undefined,
    sameAs: socialLinks(settings).map((l) => l.href),
    knowsAbout: services.map((s) => s.title),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <Hero
        name={settings.designer_name}
        workplace={settings.workplace}
        headline={settings.hero_headline}
        intro={settings.hero_intro}
        photo={settings.hero_image}
        backdrop={settings.hero_background_image}
        resumeUrl={settings.resume_url}
      />
      <Work projects={projects} />
      {clients.length > 0 && (
        <div className="container-page">
          <div className="rounded-4xl bg-ink-900 ring-1 ring-white/[0.06]">
            <ClientsStrip clients={clients} />
          </div>
        </div>
      )}
      <About settings={settings} />
      <Services services={services} />
      <Contact settings={settings} projectTypes={services.map((s) => s.title)} />
    </>
  );
}
