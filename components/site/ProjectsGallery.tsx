"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { ProjectSummary } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ProjectCard } from "./ProjectCard";

export function ProjectsGallery({ projects }: { projects: ProjectSummary[] }) {
  const categories = useMemo(() => ["All", ...Array.from(new Set(projects.map((p) => p.category)))], [projects]);
  const [filter, setFilter] = useState("All");
  const visible = filter === "All" ? projects : projects.filter((p) => p.category === filter);

  return (
    <>
      {categories.length > 2 && (
        <div role="group" aria-label="Filter projects by category" className="scrollbar-none -mx-4 mb-10 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0">
          {categories.map((c) => {
            const count = c === "All" ? projects.length : projects.filter((p) => p.category === c).length;
            const active = filter === c;
            return (
              <button
                key={c}
                type="button"
                aria-pressed={active}
                onClick={() => setFilter(c)}
                className={cn(
                  "relative shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  active ? "text-ink-950" : "text-mist ring-1 ring-inset ring-white/15 hover:text-white hover:ring-white/30",
                )}
              >
                {active && (
                  <motion.span layoutId="filter-pill" className="absolute inset-0 rounded-full bg-bone" transition={{ type: "spring", bounce: 0.15, duration: 0.5 }} />
                )}
                <span className="relative">
                  {c} <span className={active ? "text-ink-950/50" : "text-smoke"}>{count}</span>
                </span>
              </button>
            );
          })}
        </div>
      )}

      <p className="sr-only" aria-live="polite">
        Showing {visible.length} {visible.length === 1 ? "project" : "projects"}
        {filter !== "All" ? ` in ${filter}` : ""}
      </p>

      <motion.ul layout className="grid gap-4 sm:grid-cols-2 lg:gap-5 xl:grid-cols-3">
        <AnimatePresence mode="popLayout" initial={false}>
          {visible.map((project, i) => (
            <motion.li
              key={project.id}
              layout
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <ProjectCard
                project={project}
                eager={i < 3}
                className="aspect-[4/5]"
                sizes="(min-width: 1280px) 33vw, (min-width: 640px) 50vw, 100vw"
              />
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>
    </>
  );
}
