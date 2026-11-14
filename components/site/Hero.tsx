"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type PointerEvent } from "react";
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { PillLink } from "@/components/ui/PillLink";
import { Emphasis } from "./RichText";

type Props = {
  name: string;
  workplace: string;
  headline: string;
  intro: string;
  photo: string | null;
  backdrop: string | null;
  resumeUrl: string | null;
};

const ease = [0.16, 1, 0.3, 1] as const;

/**
 * Layered banner: the portrait sits in front, the editor artwork floats behind it
 * at low opacity. The artwork responds to the pointer (desktop) or a tap (touch),
 * and drifts gently while scrolling. Under prefers-reduced-motion it only changes
 * opacity — no movement.
 */
export function Hero({ name, workplace, headline, intro, photo, backdrop, resumeUrl }: Props) {
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const releaseTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const [active, setActive] = useState(false);

  // Pointer position within the visual, -0.5 … 0.5, smoothed by a spring.
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 90, damping: 18, mass: 0.6 });
  const sy = useSpring(py, { stiffness: 90, damping: 18, mass: 0.6 });

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const drift = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -48]);

  const bgX = useTransform(sx, [-0.5, 0.5], [22, -22]);
  const bgY = useTransform([sy, drift], ([y, d]: number[]) => y * -36 + d);
  const bgRotate = useTransform(sx, [-0.5, 0.5], [-2.5, 2.5]);
  const fgX = useTransform(sx, [-0.5, 0.5], [-6, 6]);

  useEffect(() => () => clearTimeout(releaseTimer.current), []);

  const track = (e: PointerEvent<HTMLDivElement>) => {
    if (reduce) return;
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
  };
  const reset = () => {
    setActive(false);
    px.set(0);
    py.set(0);
  };

  return (
    <section ref={sectionRef} id="home" aria-label="Introduction" className="container-page pt-20 sm:pt-24">
      <div className="relative isolate overflow-hidden rounded-5xl bg-ink-900 ring-1 ring-white/[0.06]">
        {/* Soft colour fields */}
        <div className="pointer-events-none absolute -left-40 -top-48 -z-10 size-[34rem] rounded-full bg-ember-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 right-0 -z-10 size-[36rem] rounded-full bg-iris-500/20 blur-3xl" />

        <div className="grid items-end lg:grid-cols-12">
          {/* Copy */}
          <motion.div
            className="px-6 pb-2 pt-12 sm:px-10 sm:pt-16 lg:col-span-6 lg:self-center lg:py-20 lg:pl-14 lg:pr-4"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease }}
          >
            {workplace && (
              <p className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/[0.06] px-3.5 py-1.5 text-[13px] font-medium text-mist ring-1 ring-inset ring-white/10">
                <span className="size-1.5 rounded-full bg-iris-400" aria-hidden="true" />
                Currently at <span className="text-bone">{workplace}</span>
              </p>
            )}
            <p className="text-lg font-medium text-mist">
              Hi, I&apos;m <span className="text-bone">{name}</span>
            </p>
            <h1 className="mt-3 text-[clamp(2.5rem,6vw,4.5rem)] font-extrabold leading-[1.04] tracking-[-0.035em] text-balance text-bone">
              <Emphasis text={headline} accentClassName="text-ember-400" />
            </h1>
            {intro && <p className="mt-6 max-w-md text-base leading-relaxed text-mist text-pretty sm:text-lg">{intro}</p>}
            <div className="mt-8 flex flex-wrap gap-3">
              <PillLink href="/#work" variant="accent">
                View my work
              </PillLink>
              {resumeUrl && (
                <PillLink href="/#details" variant="outline">
                  Résumé
                </PillLink>
              )}
            </div>
          </motion.div>

          {/* Layered visual */}
          <div
            className="relative h-[25rem] touch-pan-y select-none sm:h-[32rem] lg:col-span-6 lg:h-[40rem]"
            onPointerEnter={(e) => e.pointerType === "mouse" && setActive(true)}
            onPointerMove={track}
            onPointerLeave={(e) => e.pointerType === "mouse" && reset()}
            onPointerDown={(e) => {
              if (e.pointerType === "mouse") return;
              // Touch: a tap "lights up" the artwork, then it settles back.
              track(e);
              setActive(true);
              clearTimeout(releaseTimer.current);
              releaseTimer.current = setTimeout(reset, 1800);
            }}
          >
            {backdrop && (
              <motion.div
                aria-hidden="true"
                className="absolute inset-x-[2%] top-[2%] h-[92%] sm:inset-x-[6%] lg:inset-x-[1%]"
                style={{ x: bgX, y: bgY, rotate: bgRotate }}
                animate={{
                  opacity: active ? 0.5 : 0.26,
                  scale: active && !reduce ? 1.05 : 1,
                  filter: active ? "saturate(1.1)" : "saturate(0.7)",
                }}
                transition={{ duration: 0.7, ease }}
              >
                <Image src={backdrop} alt="" fill sizes="(min-width: 1024px) 36vw, 70vw" className="object-contain" />
              </motion.div>
            )}

            {photo && (
              <motion.div
                className="absolute inset-x-0 bottom-0 mx-auto h-[96%] max-w-[min(100%,31rem)]"
                style={{ x: fgX }}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.1, ease, delay: 0.15 }}
              >
                <Image
                  src={photo}
                  alt={`Portrait of ${name}`}
                  fill
                  preload
                  sizes="(min-width: 1024px) 34vw, (min-width: 640px) 60vw, 90vw"
                  className="object-contain object-bottom drop-shadow-[0_24px_48px_rgba(0,0,0,0.35)]"
                />
              </motion.div>
            )}
            {/* Blend the bottom edge of the photo into the card */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-ink-900 to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
}
