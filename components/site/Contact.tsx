import Image from "next/image";
import type { SiteSettings } from "@/lib/types";
import { isPlaceholder } from "@/lib/data/defaults";
import { socialLinks } from "@/lib/social";
import { telHref } from "@/lib/utils";
import { Reveal } from "@/components/motion/Reveal";
import { MailIcon, PhoneIcon } from "@/components/ui/icons";
import { ContactForm } from "./ContactForm";

export function Contact({ settings: s, projectTypes }: { settings: SiteSettings; projectTypes: string[] }) {
  const socials = socialLinks(s);
  const photo = s.contact_image ?? s.hero_image;
  const phoneHref = telHref(s.contact_phone);

  return (
    <section id="contact" aria-labelledby="contact-title" className="container-page py-16 sm:py-24">
      <div className="grid gap-4 lg:grid-cols-12">
        <Reveal className="lg:col-span-5">
          <div className="relative isolate flex h-full min-h-[34rem] flex-col overflow-hidden rounded-4xl bg-[linear-gradient(160deg,#ff7a6b_0%,#ff5a4e_50%,#c06be0_100%)] p-8 sm:p-10">
            <p className="text-sm font-semibold text-ink-950/70">Contact</p>
            <h2 id="contact-title" className="mt-3 max-w-xs text-[clamp(2.2rem,4.4vw,3.4rem)] font-extrabold leading-[1.02] tracking-[-0.035em] text-ink-950 text-balance">
              Let&apos;s make something great.
            </h2>

            <ul className="relative z-10 mt-8 space-y-3 text-[15px] font-semibold text-ink-950">
              {s.contact_email && (
                <li>
                  <a href={`mailto:${s.contact_email}`} className="inline-flex items-center gap-3 rounded-full bg-white/25 px-4 py-2 backdrop-blur-sm hover:bg-white/40">
                    <MailIcon size={18} /> <span className="break-all">{s.contact_email}</span>
                  </a>
                </li>
              )}
              {s.contact_phone && !isPlaceholder(s.contact_phone) && (
                <li>
                  {phoneHref ? (
                    <a href={phoneHref} className="inline-flex items-center gap-3 rounded-full bg-white/25 px-4 py-2 backdrop-blur-sm hover:bg-white/40">
                      <PhoneIcon size={18} /> {s.contact_phone}
                    </a>
                  ) : (
                    <span className="inline-flex items-center gap-3 rounded-full bg-white/25 px-4 py-2">
                      <PhoneIcon size={18} /> {s.contact_phone}
                    </span>
                  )}
                </li>
              )}
            </ul>

            {socials.length > 0 && (
              <ul className="relative z-10 mt-4 flex flex-wrap gap-2" aria-label="Social profiles">
                {socials.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} target="_blank" rel="noopener noreferrer" className="inline-flex rounded-full px-3 py-1.5 text-[13px] font-semibold text-ink-950 ring-1 ring-inset ring-ink-950/30 hover:bg-ink-950 hover:text-bone">
                      {link.label} ↗
                    </a>
                  </li>
                ))}
              </ul>
            )}

            {photo && (
              <div className="pointer-events-none absolute -bottom-2 -right-8 -z-10 h-[62%] w-[78%] sm:w-[70%] lg:w-[82%]">
                <Image src={photo} alt="" fill sizes="(min-width: 1024px) 30vw, 70vw" className="object-contain object-bottom drop-shadow-[0_20px_40px_rgba(0,0,0,0.35)]" />
              </div>
            )}
          </div>
        </Reveal>

        <Reveal delay={0.08} className="lg:col-span-7">
          <div className="h-full rounded-4xl bg-ink-900 p-6 ring-1 ring-white/[0.06] sm:p-10 lg:p-12">
            <p className="mb-8 max-w-md text-[15px] leading-relaxed text-mist">
              Tell me a little about your project and I&apos;ll get back to you personally.
            </p>
            <ContactForm projectTypes={projectTypes} />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
