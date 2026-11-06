"use client";

import { useActionState } from "react";
import { signIn } from "@/lib/actions/admin/auth";
import { initialActionState } from "@/lib/types";
import { TextField } from "./fields";
import { Spinner } from "@/components/ui/icons";

export function LoginForm({ next }: { next?: string }) {
  const [state, action, pending] = useActionState(signIn, initialActionState);
  const err = (n: string) => state.fieldErrors?.[n]?.[0];

  return (
    <form action={action} className="mt-8 grid gap-5">
      {next && <input type="hidden" name="next" value={next} />}
      <TextField name="email" label="Email" type="email" autoComplete="username" required defaultValue={state.values?.email} error={err("email")} />
      <TextField name="password" label="Password" type="password" autoComplete="current-password" required error={err("password")} />
      {state.status === "error" && state.message && !state.fieldErrors && (
        <p role="alert" className="rounded-xl bg-red-500/10 px-3.5 py-2.5 text-sm text-red-200">
          {state.message}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-ember-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-ember-600 disabled:opacity-60"
      >
        {pending && <Spinner size={16} />}
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
