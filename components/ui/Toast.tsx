"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { ActionState } from "@/lib/types";
import { cn } from "@/lib/utils";
import { AlertIcon, CheckIcon, CloseIcon } from "./icons";

/** Shows the latest action result as a toast. Each new result (nonce) shows again. */
export function ActionToast({ state, duration = 6000 }: { state: ActionState; duration?: number }) {
  const [dismissed, setDismissed] = useState<number | undefined>(undefined);
  const visible = state.status !== "idle" && Boolean(state.message) && state.nonce !== dismissed;

  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(() => setDismissed(state.nonce), duration);
    return () => clearTimeout(t);
  }, [visible, state.nonce, duration]);

  const success = state.status === "success";

  return (
    <div aria-live="polite" role="status" className="pointer-events-none fixed inset-x-4 bottom-4 z-[60] flex justify-center sm:inset-x-auto sm:right-6 sm:bottom-6">
      <AnimatePresence>
        {visible && (
          <motion.div
            key={state.nonce}
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-2xl bg-ink-800/95 p-4 text-sm shadow-2xl ring-1 ring-white/10 backdrop-blur-xl"
          >
            <span
              className={cn(
                "grid size-7 shrink-0 place-items-center rounded-full",
                success ? "bg-emerald-500/15 text-emerald-400" : "bg-red-500/15 text-red-400",
              )}
            >
              {success ? <CheckIcon size={16} /> : <AlertIcon size={16} />}
            </span>
            <p className="flex-1 pt-1 leading-snug text-bone">{state.message}</p>
            <button
              type="button"
              onClick={() => setDismissed(state.nonce)}
              className="rounded-full p-1 text-white/50 hover:text-white"
              aria-label="Dismiss notification"
            >
              <CloseIcon size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
