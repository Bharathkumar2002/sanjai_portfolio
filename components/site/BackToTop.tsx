"use client";

import { motion } from "framer-motion";
import { ArrowUp } from "@/components/ui/icons";

export function BackToTop() {
  return (
    <motion.button
      type="button"
      onClick={() => {
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
        document.getElementById("main")?.focus({ preventScroll: true });
      }}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.94 }}
      className="group flex items-center gap-3 text-sm text-mist hover:text-white lg:flex-col"
      aria-label="Back to top"
    >
      <span className="grid size-12 place-items-center rounded-full ring-1 ring-white/15 transition-colors group-hover:bg-ember-500 group-hover:ring-ember-500">
        <ArrowUp size={18} />
      </span>
      <span className="lg:sr-only">Back to top</span>
    </motion.button>
  );
}
