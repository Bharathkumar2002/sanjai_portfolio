"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { signOut } from "@/lib/actions/admin/auth";
import { cn } from "@/lib/utils";
import { CloseIcon, ExternalIcon, GridIcon, InboxIcon, LayersIcon, LogoutIcon, MenuIcon, SparkIcon, TextIcon, UsersIcon } from "@/components/ui/icons";

const NAV = [
  { href: "/admin", label: "Overview", icon: GridIcon, exact: true },
  { href: "/admin/projects", label: "Projects", icon: LayersIcon },
  { href: "/admin/services", label: "Services", icon: SparkIcon },
  { href: "/admin/clients", label: "Clients", icon: UsersIcon },
  { href: "/admin/content", label: "Website content", icon: TextIcon },
  { href: "/admin/messages", label: "Messages", icon: InboxIcon },
];

export function Sidebar({ brandName, email, unread }: { brandName: string; email?: string; unread: number }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const nav = (
    <nav aria-label="Dashboard" className="flex flex-1 flex-col gap-1">
      {NAV.map(({ href, label, icon: Icon, exact }) => {
        const active = exact ? pathname === href : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            onClick={() => setOpen(false)}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
              active ? "bg-white/10 text-white" : "text-mist hover:bg-white/5 hover:text-white",
            )}
          >
            <Icon size={18} />
            <span className="flex-1">{label}</span>
            {href === "/admin/messages" && unread > 0 && (
              <span className="rounded-full bg-ember-500 px-2 py-0.5 text-[11px] font-semibold text-white" aria-label={`${unread} unread`}>
                {unread}
              </span>
            )}
          </Link>
        );
      })}
      <div className="mt-auto space-y-1 border-t border-white/[0.06] pt-4">
        <a href="/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-mist hover:bg-white/5 hover:text-white">
          <ExternalIcon size={18} /> View website
        </a>
        <form action={signOut}>
          <button type="submit" className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-mist hover:bg-white/5 hover:text-white">
            <LogoutIcon size={18} /> Sign out
          </button>
        </form>
        {email && <p className="truncate px-3 pt-2 text-xs text-smoke">{email}</p>}
      </div>
    </nav>
  );

  const brand = (
    <Link href="/admin" className="font-display text-lg font-bold tracking-tight">
      {brandName}
      <span className="text-ember-400">.</span> <span className="text-sm font-medium text-smoke">Studio</span>
    </Link>
  );

  return (
    <>
      {/* Mobile top bar */}
      <div className="sticky top-0 z-30 flex items-center justify-between border-b border-white/[0.06] bg-ink-950/90 px-4 py-3 backdrop-blur-xl lg:hidden">
        {brand}
        <button type="button" onClick={() => setOpen(true)} aria-label="Open navigation" aria-expanded={open} className="grid size-10 place-items-center rounded-xl bg-white/5">
          <MenuIcon />
        </button>
      </div>
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden" role="dialog" aria-modal="true" aria-label="Dashboard navigation">
          <button type="button" className="absolute inset-0 bg-black/60" aria-label="Close navigation" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 left-0 flex w-72 flex-col gap-6 bg-ink-900 p-4">
            <div className="flex items-center justify-between">
              {brand}
              <button type="button" onClick={() => setOpen(false)} aria-label="Close navigation" className="grid size-9 place-items-center rounded-xl hover:bg-white/10">
                <CloseIcon />
              </button>
            </div>
            {nav}
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col gap-8 border-r border-white/[0.06] bg-ink-900/50 p-5 lg:flex">
        {brand}
        {nav}
      </aside>
    </>
  );
}
