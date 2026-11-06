import type { SiteSettings } from "@/lib/types";
import { socialLinks } from "@/lib/social";
import { Reveal } from "@/components/motion/Reveal";
import { MailIcon, PinIcon } from "@/components/ui/icons";
import { ContactForm } from "./ContactForm";

export function Contact({ settings: s, projectTypes }: { settings: SiteSettings; projectTypes: string[] }) {
  const socials = socialLinks(s);

  return (
    <section id="contact" aria-labelledby="contact-title" className="container-page pb-16 pt-12 sm:pb-24 sm:pt-16">
      <div className="grid gap-4 lg:grid-cols-12">
        <Reveal className="lg:col-span-5">
          <div className="grain relative flex h-full min-h-[30rem] flex-col justify-between overflow-hidden rounded-4xl bg-[radial-gradient(140%_100%_at_0%_0%,#ff9a5c_0%,#ff5f1f_38%,#d42a16_75%,#8f1909_100%)] p-8 sm:p-10 lg:p-12">
            <div>
              <p className="text-sm font-medium text-white/85">Contact</p>
              <h2 id="contact-title" className="mt-4 font-display text-[clamp(2.5rem,5vw,4.2rem)] font-semibold leading-[0.98] tracking-[-0.045em] text-white text-balance">
                Let&apos;s create something <em className="font-serif font-normal italic">remarkable.</em>
              </h2>
              {s.availability && (
                <p className="mt-6 inline-flex items-center gap-2 rounded-full bg-black/20 px-3.5 py-1.5 text-[13px] text-white backdrop-blur-md">
                  <span className="size-1.5 rounded-full bg-white" aria-hidden="true" />
                  {s.availability}
                </p>
              )}
            </div>

            <div className="mt-12 space-y-6">
              {s.contact_email && (
                <a href={`mailto:${s.contact_email}`} className="group flex items-center gap-3 text-white">
                  <span className="grid size-11 place-items-center rounded-full bg-white/15 transition-colors group-hover:bg-white group-hover:text-ember-600">
                    <MailIcon size={18} />
                  </span>
                  <span className="break-all font-display text-xl font-medium tracking-tight underline-offset-4 group-hover:underline sm:text-2xl">
                    {s.contact_email}
                  </span>
                </a>
              )}
              {(s.location || s.contact_phone) && (
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/85">
                  {s.location && (
                    <span className="inline-flex items-center gap-2">
                      <PinIcon size={16} /> {s.location}
                    </span>
                  )}
                  {s.contact_phone && <a href={`tel:${s.contact_phone.replace(/[^+\d]/g, "")}`} className="hover:underline">{s.contact_phone}</a>}
                </div>
              )}
              {socials.length > 0 && (
                <ul className="flex flex-wrap gap-2" aria-label="Social profiles">
                  {socials.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex rounded-full bg-black/20 px-4 py-2 text-[13px] font-medium text-white ring-1 ring-inset ring-white/20 backdrop-blur-md transition-colors hover:bg-white hover:text-ink-950"
                      >
                        {link.label} ↗
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.08} className="lg:col-span-7">
          <div className="h-full rounded-4xl bg-ink-900 p-6 ring-1 ring-white/5 sm:p-10 lg:p-12">
            <p className="mb-8 max-w-md text-[15px] leading-relaxed text-mist">
              Share a few details about your project and I&apos;ll get back to you personally.
            </p>
            <ContactForm projectTypes={projectTypes} />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
