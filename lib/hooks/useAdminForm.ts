"use client";

import { useActionState, useEffect, useRef, useState, useTransition, type FormEvent } from "react";
import { initialActionState, type ActionState } from "@/lib/types";
import { useToast } from "@/components/admin/ToastProvider";

type FormAction = (prev: ActionState, formData: FormData) => Promise<ActionState>;

/**
 * Wires an admin form to a server action:
 *  - submits without React's automatic form reset, so edits survive validation errors;
 *  - surfaces results as toasts;
 *  - warns before leaving the page with unsaved changes.
 */
export function useAdminForm(action: FormAction) {
  const [state, dispatch, pending] = useActionState(action, initialActionState);
  const [, startTransition] = useTransition();
  const [dirty, setDirty] = useState(false);
  const { push } = useToast();
  const lastNonce = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (!state.nonce || state.nonce === lastNonce.current || !state.message) return;
    lastNonce.current = state.nonce;
    push(state.status === "success" ? "success" : "error", state.message);
  }, [state, push]);

  useEffect(() => {
    if (!dirty) return;
    const handler = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setDirty(false);
    startTransition(() => dispatch(formData));
  };

  const err = (name: string) => state.fieldErrors?.[name]?.[0];

  return { state, pending, onSubmit, err, markDirty: () => setDirty(true) };
}
