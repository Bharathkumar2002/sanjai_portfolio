"use client";

import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Service } from "@/lib/types";
import { cn, pad2 } from "@/lib/utils";
import { PlusIcon } from "@/components/ui/icons";
import { useMediaQuery } from "@/lib/hooks/useMediaQuery";

const ease = [0.16, 1, 0.3, 1] as const;

export function ServicesExplorer({ services }: { services: Service[] }) {
  const [active, setActive] = useState(0);
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const current = services[active];

  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
      <ul className="lg:col-span-7">
        {services.map((service, i) => {
          const isOpen = i === active;
          return (
            <li key={service.id} className="border-b border-white/10 first:border-t">
              <h3>
                <button
                  type="button"
                  id={`service-${service.id}`}
                  aria-expanded={isOpen}
                  aria-controls={`service-panel-${service.id}`}
                  onClick={() => setActive(i)}
                  className="group flex w-full items-center gap-5 py-6 text-left sm:gap-8 sm:py-8"
                >
                  <span
                    className={cn(
                      "w-8 shrink-0 text-sm font-medium tabular-nums transition-colors",
                      isOpen ? "text-ember-400" : "text-smoke",
                    )}
                  >
                    {pad2(i + 1)}
                  </span>
                  <span
                    className={cn(
                      "flex-1 font-display text-[clamp(1.6rem,3.6vw,2.75rem)] font-semibold leading-none tracking-[-0.035em] transition-colors duration-300",
                      isOpen ? "text-white" : "text-white/40 group-hover:text-white/80",
                    )}
                  >
                    {service.title}
                  </span>
                  <span
                    className={cn(
                      "grid size-10 shrink-0 place-items-center rounded-full ring-1 transition-all duration-500 ease-out-expo",
                      isOpen ? "rotate-45 bg-ember-500 text-white ring-ember-500" : "text-white/70 ring-white/20 group-hover:ring-white/50",
                    )}
                    aria-hidden="true"
                  >
                    <PlusIcon size={18} />
                  </span>
                </button>
              </h3>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    id={`service-panel-${service.id}`}
                    role="region"
                    aria-labelledby={`service-${service.id}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.55, ease }}
                    className="overflow-hidden"
                  >
                    <div className="space-y-6 pb-8 pl-[3.25rem] sm:pl-16">
                      {service.image_url && !isDesktop && (
                        <div className="relative aspect-[16/10] overflow-hidden rounded-3xl bg-ink-800">
                          <Image src={service.image_url} alt="" fill sizes="(min-width: 640px) 80vw, 70vw" className="object-cover" />
                        </div>
                      )}
                      <p className="max-w-xl text-[15px] leading-relaxed text-mist text-pretty">{service.description}</p>
                      {service.deliverables.length > 0 && (
                        <div>
                          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-smoke">Deliverables</p>
                          <ul className="flex flex-wrap gap-2">
                            {service.deliverables.map((d) => (
                              <li key={d} className="rounded-full bg-white/5 px-3.5 py-1.5 text-[13px] text-bone ring-1 ring-inset ring-white/10">
                                {d}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          );
        })}
      </ul>

      {/* Desktop preview of the active service */}
      <div className="hidden lg:col-span-5 lg:block">
        <div className="sticky top-28 aspect-[4/5] overflow-hidden rounded-4xl bg-ink-800 ring-1 ring-white/5">
          <AnimatePresence mode="popLayout" initial={false}>
            {current && (
              <motion.div
                key={current.id}
                className="absolute inset-0"
                initial={{ opacity: 0, scale: 1.08 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.9, ease }}
              >
                {current.image_url ? (
                  <Image src={current.image_url} alt="" fill sizes="40vw" className="object-cover" />
                ) : (
                  <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_10%_0%,#ff8a4c,#e23a14_55%,#5c1006)]" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-8">
                  <p className="text-sm font-medium text-ember-300">{pad2(active + 1)} / {pad2(services.length)}</p>
                  <p className="mt-2 font-display text-3xl font-semibold tracking-tight text-white">{current.title}</p>
                  {current.short_description && <p className="mt-1 text-white/70">{current.short_description}</p>}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
