import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

export const inputClass =
  "w-full rounded-xl bg-ink-800 px-3.5 py-2.5 text-sm text-bone placeholder:text-smoke ring-1 ring-inset ring-white/10 outline-none transition-shadow focus:ring-2 focus:ring-ember-500 aria-[invalid=true]:ring-red-400/70";

type FieldShellProps = {
  id: string;
  label: string;
  hint?: ReactNode;
  error?: string;
  children: ReactNode;
  className?: string;
};

export function FieldShell({ id, label, hint, error, children, className }: FieldShellProps) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-bone">
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 text-xs text-red-300">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="mt-1.5 text-xs text-smoke">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

const describedBy = (id: string, error?: string, hint?: ReactNode) =>
  error ? `${id}-error` : hint ? `${id}-hint` : undefined;

type TextFieldProps = Omit<ComponentProps<"input">, "id"> & {
  name: string;
  label: string;
  hint?: ReactNode;
  error?: string;
  wrapperClassName?: string;
};

export function TextField({ name, label, hint, error, wrapperClassName, className, ...props }: TextFieldProps) {
  const id = `f-${name}`;
  return (
    <FieldShell id={id} label={label} hint={hint} error={error} className={wrapperClassName}>
      <input
        id={id}
        name={name}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, error, hint)}
        className={cn(inputClass, className)}
        {...props}
      />
    </FieldShell>
  );
}

type TextAreaProps = Omit<ComponentProps<"textarea">, "id"> & {
  name: string;
  label: string;
  hint?: ReactNode;
  error?: string;
  wrapperClassName?: string;
};

export function TextAreaField({ name, label, hint, error, wrapperClassName, className, rows = 4, ...props }: TextAreaProps) {
  const id = `f-${name}`;
  return (
    <FieldShell id={id} label={label} hint={hint} error={error} className={wrapperClassName}>
      <textarea
        id={id}
        name={name}
        rows={rows}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, error, hint)}
        className={cn(inputClass, "resize-y leading-relaxed", className)}
        {...props}
      />
    </FieldShell>
  );
}

export function ToggleField({
  name,
  label,
  description,
  defaultChecked,
}: {
  name: string;
  label: string;
  description?: string;
  defaultChecked?: boolean;
}) {
  const id = `f-${name}`;
  return (
    <label htmlFor={id} className="flex cursor-pointer items-start justify-between gap-4 rounded-2xl bg-ink-800/60 p-4 ring-1 ring-inset ring-white/5">
      <span>
        <span className="block text-sm font-medium text-bone">{label}</span>
        {description && <span className="mt-0.5 block text-xs text-smoke">{description}</span>}
      </span>
      <span className="relative mt-0.5 inline-flex shrink-0">
        <input id={id} name={name} type="checkbox" defaultChecked={defaultChecked} className="peer sr-only" />
        <span className="h-6 w-11 rounded-full bg-ink-600 transition-colors peer-checked:bg-ember-500 peer-focus-visible:ring-2 peer-focus-visible:ring-ember-300" />
        <span className="absolute left-0.5 top-0.5 size-5 rounded-full bg-white shadow transition-transform peer-checked:translate-x-5" />
      </span>
    </label>
  );
}

export function FormSection({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  return (
    <section className="grid gap-6 border-b border-white/[0.06] py-8 first:pt-0 last:border-0 lg:grid-cols-3">
      <div>
        <h2 className="font-display text-lg font-semibold tracking-tight">{title}</h2>
        {description && <p className="mt-1 text-sm text-smoke">{description}</p>}
      </div>
      <div className="grid gap-5 lg:col-span-2">{children}</div>
    </section>
  );
}
