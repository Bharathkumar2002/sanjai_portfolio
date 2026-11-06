import { Hero } from "@/components/site/Hero";
import { ClientsStrip } from "@/components/site/ClientsStrip";
import { About } from "@/components/site/About";
import { FeaturedProjects } from "@/components/site/FeaturedProjects";
import { Services } from "@/components/site/Services";
import { Contact } from "@/components/site/Contact";
import { getClients, getFeaturedProjects, getServices, getSiteSettings } from "@/lib/data/public";
import { siteUrl } from "@/lib/supabase/env";
import { socialLinks } from "@/lib/social";

export default async function HomePage() {
  const [settings, services, clients, featured] = await Promise.all([
    getSiteSettings(),
    getServices(),
    getClients(),
    getFeaturedProjects(5),
  ]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: settings.designer_name,
    jobTitle: settings.role_title,
    url: siteUrl,
    email: settings.contact_email || undefined,
    image: settings.hero_image || undefined,
    sameAs: socialLinks(settings).map((l) => l.href),
    knowsAbout: services.map((s) => s.title),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <section id="home" aria-label="Introduction" className="container-page pt-3 sm:pt-4">
        <div className="rounded-4xl bg-ink-900 ring-1 ring-white/5">
          <Hero
            greeting={settings.hero_greeting}
            headline={settings.hero_headline}
            tagline={settings.hero_tagline}
            intro={settings.hero_intro}
            image={settings.hero_image}
            imageAlt={`Portrait of ${settings.designer_name}`}
            expertise={services.map((s) => s.title)}
          />
          <ClientsStrip clients={clients} />
        </div>
      </section>

      <About settings={settings} />
      <FeaturedProjects projects={featured} />
      <Services services={services} />
      <Contact settings={settings} projectTypes={services.map((s) => s.title)} />
    </>
  );
}
