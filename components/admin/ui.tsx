import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { PlusIcon } from "@/components/ui/icons";

export function PageHeader({
  title,
  description,
  action,
  back,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  back?: { href: string; label: string };
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {back && (
          <Link href={back.href} className="mb-3 inline-block text-sm text-mist hover:text-white">
            ← {back.label}
          </Link>
        )}
        <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1>
        {description && <p className="mt-2 max-w-2xl text-sm text-mist">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function Card({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("rounded-3xl bg-ink-900 ring-1 ring-white/[0.06]", className)} {...props} />;
}

export function Badge({ tone = "neutral", children }: { tone?: "neutral" | "success" | "accent" | "muted"; children: ReactNode }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium",
        tone === "neutral" && "bg-white/10 text-bone",
        tone === "success" && "bg-emerald-500/15 text-emerald-300",
        tone === "accent" && "bg-ember-500/15 text-ember-300",
        tone === "muted" && "bg-white/5 text-smoke",
      )}
    >
      {children}
    </span>
  );
}

export function PrimaryLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 self-start rounded-full bg-ember-500 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-ember-600"
    >
      <PlusIcon size={16} />
      {children}
    </Link>
  );
}

export function EmptyState({ title, description, action }: { title: string; description: string; action?: ReactNode }) {
  return (
    <Card className="flex flex-col items-center gap-3 border border-dashed border-white/10 px-6 py-16 text-center">
      <p className="font-display text-xl font-semibold">{title}</p>
      <p className="max-w-sm text-sm text-mist">{description}</p>
      {action && <div className="mt-3">{action}</div>}
    </Card>
  );
}

export function ErrorNotice({ message }: { message: string }) {
  return (
    <Card className="border border-red-500/30 bg-red-500/5 p-6 text-sm text-red-200">
      <p className="font-medium">Something went wrong</p>
      <p className="mt-1 text-red-200/80">{message}</p>
    </Card>
  );
}
