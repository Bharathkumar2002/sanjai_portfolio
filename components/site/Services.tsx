import type { Service } from "@/lib/types";
import { pad2 } from "@/lib/utils";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHeading } from "./SectionHeading";

export function Services({ services }: { services: Service[] }) {
  if (services.length === 0) return null;

  return (
    <section id="services" aria-labelledby="services-title" className="container-page py-16 sm:py-24">
      <SectionHeading eyebrow="What I do" title="Services" titleId="services-title" />
      <ul className="mt-12 grid gap-4 sm:mt-16 sm:grid-cols-2 xl:grid-cols-4">
        {services.map((service, i) => (
          <li key={service.id}>
            <Reveal delay={(i % 4) * 0.06} className="h-full">
              <article className="flex h-full flex-col rounded-4xl bg-ink-900 p-7 ring-1 ring-white/[0.06]">
                <span className="text-sm font-semibold tabular-nums text-ember-400">{pad2(i + 1)}</span>
                <h3 className="mt-8 text-xl font-bold tracking-tight text-bone">{service.title}</h3>
                <p className="mt-3 flex-1 text-[15px] leading-relaxed text-mist">{service.description || service.short_description}</p>
                {service.deliverables.length > 0 && (
                  <ul className="mt-6 flex flex-wrap gap-2" aria-label={`${service.title} deliverables`}>
                    {service.deliverables.slice(0, 4).map((d) => (
                      <li key={d} className="rounded-full bg-white/[0.05] px-3 py-1 text-xs font-medium text-mist ring-1 ring-inset ring-white/10">
                        {d}
                      </li>
                    ))}
                  </ul>
                )}
              </article>
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
}
