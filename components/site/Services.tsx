import type { Service } from "@/lib/types";
import { Reveal } from "@/components/motion/Reveal";
import { PillLink } from "@/components/ui/PillLink";
import { SectionHeading } from "./SectionHeading";
import { ServicesExplorer } from "./ServicesExplorer";

export function Services({ services }: { services: Service[] }) {
  return (
    <section id="services" aria-labelledby="services-title" className="container-page py-12 sm:py-16">
      <div className="rounded-5xl bg-ink-900 px-5 py-16 ring-1 ring-white/5 sm:px-10 sm:py-24 lg:px-14">
        <SectionHeading
          eyebrow="What I Do"
          title="Services built to make your brand *unforgettable*"
          titleId="services-title"
          aside={
            <p className="text-[15px] leading-relaxed text-mist">
              Every engagement is tailored, but these are the disciplines I bring to the table — individually or as one connected system.
            </p>
          }
        />

        <div className="mt-14 sm:mt-20">
          {services.length > 0 ? (
            <ServicesExplorer services={services} />
          ) : (
            <p className="rounded-3xl border border-dashed border-white/15 p-10 text-mist">
              Services are being updated. Get in touch to discuss what you need.
            </p>
          )}
        </div>

        <Reveal className="mt-16 sm:mt-24">
          <div className="grain relative flex flex-col items-start justify-between gap-8 overflow-hidden rounded-4xl bg-[radial-gradient(120%_140%_at_0%_0%,#ff8a4c_0%,#ff5f1f_40%,#c92a12_100%)] p-8 sm:p-12 lg:flex-row lg:items-center">
            <div>
              <p className="font-display text-[clamp(1.9rem,4vw,3.2rem)] font-semibold leading-[1.02] tracking-[-0.04em] text-white text-balance">
                Have a project in mind?
              </p>
              <p className="mt-3 max-w-lg text-white/85">
                Tell me about your brand and your goals, and I&apos;ll get back to you with ideas and next steps.
              </p>
            </div>
            <PillLink href="/#contact" variant="dark" size="lg" className="shrink-0">
              Start a project
            </PillLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
