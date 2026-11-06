"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp, EditIcon, Spinner, TrashIcon } from "@/components/ui/icons";

export function IconButton({
  label,
  onClick,
  disabled,
  tone = "default",
  active,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  tone?: "default" | "danger";
  active?: boolean;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      aria-pressed={active}
      className={cn(
        "grid size-9 place-items-center rounded-xl transition-colors disabled:pointer-events-none disabled:opacity-30",
        tone === "danger" ? "text-red-300 hover:bg-red-500/10" : "text-mist hover:bg-white/10 hover:text-white",
        active && "text-ember-400",
      )}
    >
      {children}
    </button>
  );
}

export function OrderButtons({
  name,
  index,
  total,
  onMove,
  disabled,
}: {
  name: string;
  index: number;
  total: number;
  onMove: (dir: "up" | "down") => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex">
      <IconButton label={`Move ${name} up`} onClick={() => onMove("up")} disabled={disabled || index === 0}>
        <ChevronUp size={16} />
      </IconButton>
      <IconButton label={`Move ${name} down`} onClick={() => onMove("down")} disabled={disabled || index === total - 1}>
        <ChevronDown size={16} />
      </IconButton>
    </div>
  );
}

export function EditLink({ href, name }: { href: string; name: string }) {
  return (
    <Link href={href} aria-label={`Edit ${name}`} title="Edit" className="grid size-9 place-items-center rounded-xl text-mist transition-colors hover:bg-white/10 hover:text-white">
      <EditIcon size={16} />
    </Link>
  );
}

export function DeleteButton({ name, onDelete, busy }: { name: string; onDelete: () => void; busy?: boolean }) {
  return (
    <IconButton label={`Delete ${name}`} onClick={onDelete} tone="danger" disabled={busy}>
      {busy ? <Spinner size={16} /> : <TrashIcon size={16} />}
    </IconButton>
  );
}
