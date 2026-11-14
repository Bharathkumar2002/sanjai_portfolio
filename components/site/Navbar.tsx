"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { NAV_LINKS, type SocialLink } from "@/lib/social";
import { cn } from "@/lib/utils";
import { PillLink } from "@/components/ui/PillLink";
import { CloseIcon, MenuIcon } from "@/components/ui/icons";

type Props = { brandName: string; socials: SocialLink[]; email: string };

export function Navbar({ brandName, socials, email }: Props) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("home");
  const toggleRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 24);
    setHidden(y > 480 && y > prev + 4);
    if (y < prev - 4) setHidden(false);
  });

  // Highlight the section currently in view (home page only).
  useEffect(() => {
    if (!isHome) return;
    const sections = NAV_LINKS.map((l) => document.getElementById(l.id)).filter(Boolean) as HTMLElement[];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => e.isIntersecting && setActive(e.target.id));
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [isHome]);

  // Mobile menu: lock scroll, close on Escape, manage focus.
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    firstLinkRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    const toggle = toggleRef.current;
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
      toggle?.focus();
    };
  }, [open]);

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-0 z-50"
        animate={{ y: hidden && !open ? "-110%" : "0%" }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="container-page pt-3 sm:pt-4">
          <nav
            aria-label="Main"
            className={cn(
              "flex items-center justify-between rounded-full py-2 pl-5 pr-2 transition-[background-color,box-shadow,backdrop-filter] duration-500 sm:pl-7",
              scrolled || open
                ? "bg-ink-950/70 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.6)] ring-1 ring-white/10 backdrop-blur-xl"
                : "bg-transparent",
            )}
          >
            <Link
              href="/"
              className="font-display text-lg font-bold tracking-tight text-white"
              onClick={() => setOpen(false)}
            >
              {brandName}
              <span className="text-ember-400">.</span>
            </Link>

            <ul className="hidden items-center gap-1 md:flex">
              {NAV_LINKS.map((link) => {
                const isActive = isHome ? active === link.id : link.id === "work" && pathname.startsWith("/projects");
                return (
                  <li key={link.id}>
                    <Link
                      href={link.href}
                      aria-current={isActive ? "true" : undefined}
                      className={cn(
                        "relative rounded-full px-3.5 py-2 text-[13px] font-medium transition-colors",
                        isActive ? "text-white" : "text-white/70 hover:text-white",
                      )}
                    >
                      {isActive && (
                        <motion.span
                          layoutId="nav-active"
                          className="absolute inset-0 rounded-full bg-white/10"
                          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                      <span className="relative">{link.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="flex items-center gap-2">
              <span className="hidden sm:block">
                <PillLink href="/#contact" size="sm">
                  Let&apos;s Talk
                </PillLink>
              </span>
              <button
                ref={toggleRef}
                type="button"
                onClick={() => setOpen((o) => !o)}
                aria-expanded={open}
                aria-controls="mobile-menu"
                aria-label={open ? "Close menu" : "Open menu"}
                className="grid size-10 place-items-center rounded-full bg-white/10 text-white backdrop-blur-md transition-colors hover:bg-white/20 md:hidden"
              >
                {open ? <CloseIcon /> : <MenuIcon />}
              </button>
            </div>
          </nav>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            className="fixed inset-0 z-40 flex flex-col bg-ink-950 px-4 pb-8 pt-28 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="pointer-events-none absolute -right-24 -top-24 size-80 rounded-full bg-ember-500/25 blur-3xl" />
            <ul className="relative space-y-1">
              {NAV_LINKS.map((link, i) => (
                <motion.li
                  key={link.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 + i * 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link
                    ref={i === 0 ? firstLinkRef : undefined}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="flex items-baseline gap-4 py-2 font-display text-5xl font-semibold tracking-tight text-white"
                  >
                    <span className="text-xs font-medium text-ember-400">0{i + 1}</span>
                    {link.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
            <motion.div
              className="relative mt-auto space-y-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
            >
              {email && (
                <a href={`mailto:${email}`} className="block text-lg text-white/80 underline-offset-4 hover:underline">
                  {email}
                </a>
              )}
              <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-white/60">
                {socials.map((s) => (
                  <li key={s.label}>
                    <a href={s.href} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                      {s.label} ↗
                    </a>
                  </li>
                ))}
              </ul>
              <PillLink href="/#contact" variant="accent" size="lg" onClick={() => setOpen(false)}>
                Let&apos;s Talk
              </PillLink>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
