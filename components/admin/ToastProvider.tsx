"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { AlertIcon, CheckIcon, CloseIcon } from "@/components/ui/icons";

type Toast = { id: number; status: "success" | "error"; message: string };
type ToastApi = { push: (status: Toast["status"], message: string) => void };

const ToastContext = createContext<ToastApi>({ push: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const counter = useRef(0);
  const timers = useRef(new Map<number, ReturnType<typeof setTimeout>>());

  const dismiss = useCallback((id: number) => {
    setToasts((t) => t.filter((x) => x.id !== id));
    clearTimeout(timers.current.get(id));
    timers.current.delete(id);
  }, []);

  const push = useCallback(
    (status: Toast["status"], message: string) => {
      const id = ++counter.current;
      setToasts((t) => [...t.slice(-3), { id, status, message }]);
      timers.current.set(id, setTimeout(() => dismiss(id), status === "error" ? 8000 : 4000));
    },
    [dismiss],
  );

  useEffect(() => {
    const map = timers.current;
    return () => map.forEach(clearTimeout);
  }, []);

  return (
    <ToastContext.Provider value={{ push }}>
      {children}
      {/* Top-right so toasts never cover the sticky save bar at the bottom of forms */}
      <div role="status" aria-live="polite" className="pointer-events-none fixed inset-x-4 top-4 z-[60] flex flex-col items-center gap-2 sm:inset-x-auto sm:right-6 sm:top-6 sm:items-end">
        <AnimatePresence initial={false}>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, y: 16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-2xl bg-ink-800/95 p-3.5 text-sm shadow-2xl ring-1 ring-white/10 backdrop-blur-xl"
            >
              <span
                className={cn(
                  "grid size-6 shrink-0 place-items-center rounded-full",
                  t.status === "success" ? "bg-emerald-500/15 text-emerald-400" : "bg-red-500/15 text-red-400",
                )}
              >
                {t.status === "success" ? <CheckIcon size={14} /> : <AlertIcon size={14} />}
              </span>
              <p className="flex-1 pt-0.5 text-bone">{t.message}</p>
              <button type="button" onClick={() => dismiss(t.id)} aria-label="Dismiss" className="text-white/40 hover:text-white">
                <CloseIcon size={16} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
