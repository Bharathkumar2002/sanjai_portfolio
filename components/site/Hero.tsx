"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { PillLink } from "@/components/ui/PillLink";
import { Emphasis } from "./RichText";
import { pad2 } from "@/lib/utils";

type Props = {
  greeting: string;
  headline: string;
  tagline: string;
  intro: string;
  image: string | null;
  imageAlt: string;
  expertise: string[];
};

const ease = [0.16, 1, 0.3, 1] as const;

export function Hero({ greeting, headline, tagline, intro, image, imageAlt, expertise }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "-18%"]);

  const lines = headline.split(/\r?\n/);

  return (
    <div
      ref={ref}
      className="grain relative isolate flex min-h-[44rem] flex-col overflow-hidden rounded-4xl bg-[radial-gradient(130%_95%_at_8%_0%,#ff9a5c_0%,#ff5f1f_32%,#e23a14_62%,#8f1909_100%)] lg:min-h-[max(42rem,min(100svh-1.5rem,58rem))]"
    >
      {/* Portrait: grayscale photo multiplied into the gradient = duotone, whatever is uploaded */}
      {image && (
        <motion.div
          style={{ y: imageY }}
          className="absolute inset-x-0 bottom-0 -z-10 h-[62%] mix-blend-multiply sm:left-[22%] lg:left-[38%] lg:h-full"
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.6, ease }}
        >
          <Image
            src={image}
            alt={imageAlt}
            fill
            preload
            sizes="(min-width: 1024px) 62vw, (min-width: 640px) 78vw, 100vw"
            className="object-cover object-[50%_20%] contrast-[1.15] grayscale [mask-image:linear-gradient(to_bottom,transparent,black_30%)] lg:[mask-image:linear-gradient(to_right,transparent,black_35%,black_85%,transparent)]"
          />
        </motion.div>
      )}
      {/* Depth: darker floor and soft highlight */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-2/3 bg-gradient-to-t from-black/60 via-black/15 to-transparent" />
      <div className="pointer-events-none absolute -left-32 -top-32 -z-10 size-[28rem] rounded-full bg-[#ffc49a]/30 blur-3xl" />

      <motion.div
        style={{ y: textY }}
        className="relative flex flex-1 flex-col justify-center px-6 pb-10 pt-32 sm:px-10 lg:px-14 lg:pt-36"
      >
        <div className="grid items-end gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <motion.p
              className="mb-4 text-base font-medium text-white/90 sm:text-lg"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease, delay: 0.1 }}
            >
              {greeting}
            </motion.p>
            <h1 className="font-display text-[clamp(3.6rem,13vw,10.5rem)] font-bold leading-[0.86] tracking-[-0.055em] text-white">
              {lines.map((line, i) => (
                <span key={i} className="block overflow-hidden pb-[0.06em]">
                  <motion.span
                    className="block"
                    initial={{ y: "105%" }}
                    animate={{ y: "0%" }}
                    transition={{ duration: 1.1, ease, delay: 0.2 + i * 0.12 }}
                  >
                    <Emphasis text={line} accentClassName="pr-[0.06em] tracking-[-0.03em]" />
                  </motion.span>
                </span>
              ))}
            </h1>
          </div>

          <motion.div
            className="max-w-sm lg:col-span-4 lg:col-start-9 lg:pb-4"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease, delay: 0.55 }}
          >
            <p className="font-display text-2xl font-semibold leading-tight tracking-tight text-white text-balance sm:text-[1.7rem]">
              {tagline}
            </p>
            <p className="mt-4 text-[15px] leading-relaxed text-white/80 text-pretty">{intro}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <PillLink href="/#projects" variant="light">
                Explore My Work
              </PillLink>
              <PillLink href="/#contact" variant="outline">
                Let&apos;s Collaborate
              </PillLink>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Expertise strip — managed through Services in the dashboard */}
      {expertise.length > 0 && (
        <motion.div
          className="relative border-t border-white/15"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
        >
          <h2 className="sr-only">Areas of expertise</h2>
          <ol className="scrollbar-none flex snap-x snap-mandatory overflow-x-auto px-6 sm:px-10 lg:grid lg:grid-flow-col lg:auto-cols-fr lg:px-14">
            {expertise.map((title, i) => (
              <li
                key={title}
                className="min-w-[11.5rem] shrink-0 snap-start border-white/15 py-5 pr-6 lg:min-w-0 lg:border-l lg:pl-5 lg:first:border-l-0 lg:first:pl-0"
              >
                <span className="text-[11px] font-semibold tracking-wider text-[#ffd2b5]">#{pad2(i + 1)}</span>
                <span className="mt-1 block text-sm font-medium text-white">{title}</span>
              </li>
            ))}
          </ol>
        </motion.div>
      )}
    </div>
  );
}
