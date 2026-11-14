"use client";

import { useActionState, useEffect, useRef, type ReactNode } from "react";
import { submitContact } from "@/lib/actions/contact";
import { initialActionState } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ActionToast } from "@/components/ui/Toast";
import { ArrowUpRight, Spinner } from "@/components/ui/icons";

const inputClass =
  "w-full rounded-2xl bg-ink-800 px-4 py-3.5 text-[15px] text-bone placeholder:text-smoke ring-1 ring-inset ring-white/10 transition-shadow outline-none focus:ring-2 focus:ring-ember-500 aria-[invalid=true]:ring-red-400/70";

function Field({
  id,
  label,
  error,
  children,
  className,
}: {
  id: string;
  label: string;
  error?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-2 block text-xs font-medium uppercase tracking-[0.14em] text-mist">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="mt-2 text-xs text-red-300">
          {error}
        </p>
      )}
    </div>
  );
}

export function ContactForm({ projectTypes }: { projectTypes: string[] }) {
  const [state, formAction, pending] = useActionState(submitContact, initialActionState);
  const startedRef = useRef<HTMLInputElement>(null);
  const v = state.values ?? {};
  const err = (name: string) => state.fieldErrors?.[name]?.[0];
  const a11y = (name: string) => ({
    "aria-invalid": err(name) ? true : undefined,
    "aria-describedby": err(name) ? `${name}-error` : undefined,
  });

  // Time-to-fill spam check; reset after every submission.
  useEffect(() => {
    if (startedRef.current) startedRef.current.value = String(Date.now());
  }, [state.nonce]);

  return (
    <>
      <form action={formAction} noValidate={false} className="grid gap-5 sm:grid-cols-2" aria-describedby="contact-form-note">
        <Field id="name" label="Name" error={err("name")}>
          <input id="name" name="name" required minLength={2} maxLength={120} autoComplete="name" placeholder="Your name" defaultValue={v.name} className={inputClass} {...a11y("name")} />
        </Field>
        <Field id="email" label="Email" error={err("email")}>
          <input id="email" name="email" type="email" required maxLength={254} autoComplete="email" placeholder="you@company.com" defaultValue={v.email} className={inputClass} {...a11y("email")} />
        </Field>
        <Field id="subject" label="Subject" error={err("subject")}>
          <input id="subject" name="subject" required minLength={2} maxLength={160} placeholder="What's it about?" defaultValue={v.subject} className={inputClass} {...a11y("subject")} />
        </Field>
        <Field id="project_type" label="Project type" error={err("project_type")}>
          <div className="relative">
            <select id="project_type" name="project_type" defaultValue={v.project_type ?? ""} className={cn(inputClass, "appearance-none pr-10")} {...a11y("project_type")}>
              <option value="">Select a project type</option>
              {projectTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
              <option value="Other">Something else</option>
            </select>
            <svg className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-mist" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="m6 9 6 6 6-6" />
            </svg>
          </div>
        </Field>
        <Field id="message" label="Message" error={err("message")} className="sm:col-span-2">
          <textarea id="message" name="message" required minLength={10} maxLength={5000} rows={6} placeholder="Tell me about your brand, goals and timeline…" defaultValue={v.message} className={cn(inputClass, "resize-y")} {...a11y("message")} />
        </Field>

        {/* Spam traps — invisible to people */}
        <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
          <label htmlFor="website">Leave this field empty</label>
          <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
        </div>
        <input ref={startedRef} type="hidden" name="started_at" defaultValue="" />

        <div className="flex flex-col-reverse items-start justify-between gap-4 sm:col-span-2 sm:flex-row sm:items-center">
          <p id="contact-form-note" className="text-xs text-smoke">
            Your details are only used to reply to your enquiry.
          </p>
          <button
            type="submit"
            disabled={pending}
            className="group inline-flex items-center gap-3 rounded-full bg-ember-500 py-2 pl-6 pr-2 text-[15px] font-semibold text-ink-950 transition-colors hover:bg-ember-400 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {pending ? "Sending…" : "Send message"}
            <span className="grid size-10 place-items-center rounded-full bg-ink-950 text-ember-400 transition-transform duration-500 group-hover:rotate-45 motion-reduce:transition-none">
              {pending ? <Spinner size={16} /> : <ArrowUpRight size={18} />}
            </span>
          </button>
        </div>
        {state.status === "error" && state.message && (
          <p className="text-sm text-red-300 sm:col-span-2">{state.message}</p>
        )}
      </form>
      <ActionToast state={state} />
    </>
  );
}
