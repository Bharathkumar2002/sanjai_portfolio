import Image from "next/image";
import type { SiteSettings } from "@/lib/types";
import { Reveal } from "@/components/motion/Reveal";
import { CountUp } from "@/components/motion/CountUp";
import { PillLink } from "@/components/ui/PillLink";
import { cn } from "@/lib/utils";
import { Emphasis, Prose } from "./RichText";

export function About({ settings: s }: { settings: SiteSettings }) {
  const stats = [
    { value: s.years_experience, suffix: "+", label: "Years of experience" },
    { value: s.projects_completed, suffix: "+", label: "Projects delivered" },
    { value: s.clients_served, suffix: "", label: "Brands partnered with" },
  ].filter((x): x is { value: number; suffix: string; label: string } => typeof x.value === "number" && x.value > 0);

  return (
    <section id="about" aria-labelledby="about-title" className="container-page pb-12 pt-24 sm:pb-16 sm:pt-32 lg:pt-40">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
        <Reveal className="lg:col-span-6">
          <p className="mb-5 text-sm font-medium text-ember-500">{s.about_eyebrow}</p>
          <h2
            id="about-title"
            className="font-display text-[clamp(2.4rem,5.2vw,4.4rem)] font-semibold leading-[1.02] tracking-[-0.04em] text-balance"
          >
            <Emphasis text={s.about_headline} accentClassName="text-ember-400" />
          </h2>
          {s.about_intro && <p className="mt-7 max-w-xl text-lg leading-relaxed text-mist text-pretty">{s.about_intro}</p>}
        </Reveal>

        <Reveal delay={0.1} className="flex flex-col gap-8 lg:col-span-5 lg:col-start-8 lg:pt-12">
          <Prose
            text={s.about_bio}
            className="font-display text-xl font-medium leading-snug tracking-tight text-bone sm:text-[1.45rem]"
          />
          <Prose text={s.about_experience} className="text-[15px] leading-relaxed text-mist" />
          <div className="flex flex-wrap items-center gap-x-6 gap-y-4 pt-2">
            <PillLink href="/#contact" variant="accent">
              Let&apos;s Build Something Together
            </PillLink>
            {s.availability && (
              <span className="flex items-center gap-2 text-xs text-smoke">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-60 motion-reduce:animate-none" />
                  <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
                </span>
                {s.availability}
              </span>
            )}
          </div>
        </Reveal>
      </div>

      {/* Bento: portrait · philosophy · stats */}
      <div className="mt-16 grid gap-4 sm:mt-20 lg:grid-cols-12 lg:grid-rows-[auto_auto]">
        {s.about_image && (
          <Reveal className="lg:col-span-5 lg:row-span-2">
            <div className="group relative aspect-[4/5] overflow-hidden rounded-4xl bg-ink-800 lg:aspect-auto lg:h-full lg:min-h-[32rem]">
              <Image
                src={s.about_image}
                alt={`${s.designer_name} at work`}
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover grayscale transition-[filter,transform] duration-1000 ease-out-expo group-hover:scale-[1.03] group-hover:grayscale-0"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-6 pt-24">
                <p className="font-display text-lg font-semibold">{s.designer_name}</p>
                <p className="text-sm text-white/70">{s.role_title}</p>
              </div>
            </div>
          </Reveal>
        )}

        {s.about_philosophy && (
          <Reveal delay={0.05} className={s.about_image ? "lg:col-span-7" : "lg:col-span-12"}>
            <figure className="relative h-full overflow-hidden rounded-4xl bg-ink-850 p-8 ring-1 ring-white/5 sm:p-10 lg:p-12">
              <div className="pointer-events-none absolute -right-20 -top-20 size-64 rounded-full bg-ember-500/15 blur-3xl" />
              <figcaption className="text-xs font-semibold uppercase tracking-[0.2em] text-smoke">Design philosophy</figcaption>
              <blockquote className="relative mt-6 font-serif text-[clamp(1.7rem,3.2vw,2.6rem)] italic leading-[1.15] text-bone text-balance">
                “{s.about_philosophy}”
              </blockquote>
            </figure>
          </Reveal>
        )}

        {stats.length > 0 && (
          <div
            className={cn(
              "grid grid-cols-1 gap-4",
              ["", "sm:grid-cols-1", "sm:grid-cols-2", "sm:grid-cols-3"][stats.length],
              s.about_image ? "lg:col-span-7" : "lg:col-span-12",
            )}
          >
            {stats.map((stat, i) => (
              <Reveal key={stat.label} delay={0.1 + i * 0.06}>
                <div className="flex h-full flex-col justify-between gap-10 rounded-4xl bg-ink-850 p-7 ring-1 ring-white/5">
                  <p className="font-display text-6xl font-bold tracking-[-0.05em] text-white">
                    <CountUp value={stat.value} suffix={stat.suffix} />
                  </p>
                  <p className="text-sm text-mist">{stat.label}</p>
                </div>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
