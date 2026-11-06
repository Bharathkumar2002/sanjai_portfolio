"use client";

import { useState, useTransition } from "react";
import type { ActionState } from "@/lib/types";
import { useToast } from "@/components/admin/ToastProvider";

/**
 * Runs a server action from a button, tracks which item is busy and toasts the result.
 * Actions call revalidatePath, so the list re-renders with fresh data automatically.
 */
export function useRunAction() {
  const [isPending, startTransition] = useTransition();
  const [busyKey, setBusyKey] = useState<string | null>(null);
  const { push } = useToast();

  const run = (key: string, fn: () => Promise<ActionState>, opts: { confirm?: string; quiet?: boolean } = {}) => {
    if (opts.confirm && !window.confirm(opts.confirm)) return;
    setBusyKey(key);
    startTransition(async () => {
      try {
        const result = await fn();
        if (result.message && (result.status === "error" || !opts.quiet)) {
          push(result.status === "error" ? "error" : "success", result.message);
        }
      } catch {
        push("error", "Something went wrong. Please try again.");
      } finally {
        setBusyKey(null);
      }
    });
  };

  return { run, isPending, isBusy: (key: string) => isPending && busyKey === key };
}
