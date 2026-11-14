"use client";

import { useState } from "react";
import { deleteMessage, setMessageRead } from "@/lib/actions/admin/messages";
import { useRunAction } from "@/lib/hooks/useRunAction";
import type { ContactMessage } from "@/lib/types";
import { cn, formatDate } from "@/lib/utils";
import { Badge, Card } from "./ui";
import { DeleteButton } from "./RowControls";
import { ChevronDown, MailIcon } from "@/components/ui/icons";

export function MessagesList({ messages }: { messages: ContactMessage[] }) {
  const { run, isBusy } = useRunAction();
  const [openId, setOpenId] = useState<string | null>(null);

  const toggle = (m: ContactMessage) => {
    const opening = openId !== m.id;
    setOpenId(opening ? m.id : null);
    if (opening && !m.is_read) run(`read-${m.id}`, () => setMessageRead(m.id, true), { quiet: true });
  };

  return (
    <Card className="divide-y divide-white/[0.06] overflow-hidden">
      {messages.map((m) => {
        const open = openId === m.id;
        return (
          <article key={m.id} className={cn(!m.is_read && "bg-ember-500/[0.04]")}>
            <button
              type="button"
              onClick={() => toggle(m)}
              aria-expanded={open}
              aria-controls={`msg-${m.id}`}
              className="flex w-full items-start gap-4 p-4 text-left hover:bg-white/[0.02] sm:items-center"
            >
              <span className={cn("mt-1.5 size-2 shrink-0 rounded-full sm:mt-0", m.is_read ? "bg-transparent" : "bg-ember-500")} aria-hidden="true" />
              <span className="grid min-w-0 flex-1 gap-0.5 sm:grid-cols-[12rem_1fr] sm:gap-4">
                <span className={cn("truncate text-sm", m.is_read ? "text-mist" : "font-semibold text-bone")}>{m.name}</span>
                <span className="min-w-0 truncate text-sm">
                  <span className={m.is_read ? "text-mist" : "font-medium text-bone"}>{m.subject}</span>
                  <span className="text-smoke"> — {m.message}</span>
                </span>
              </span>
              <span className="hidden shrink-0 text-xs text-smoke sm:block">{formatDate(m.created_at, { dateStyle: "medium" })}</span>
              <ChevronDown size={16} className={cn("mt-0.5 shrink-0 text-smoke transition-transform sm:mt-0", open && "rotate-180")} />
              <span className="sr-only">{m.is_read ? "Read" : "Unread"}</span>
            </button>
            {open && (
              <div id={`msg-${m.id}`} className="border-t border-white/[0.06] bg-ink-850 px-4 py-5 sm:px-10">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                  <a href={`mailto:${m.email}?subject=${encodeURIComponent(`Re: ${m.subject}`)}`} className="inline-flex items-center gap-1.5 text-ember-300 hover:underline">
                    <MailIcon size={15} /> {m.email}
                  </a>
                  {m.project_type && <Badge>{m.project_type}</Badge>}
                  <span className="text-xs text-smoke">{formatDate(m.created_at, { dateStyle: "full", timeStyle: "short" })}</span>
                </div>
                <p className="mt-4 whitespace-pre-wrap text-[15px] leading-relaxed text-bone">{m.message}</p>
                <div className="mt-5 flex items-center gap-2">
                  <a
                    href={`mailto:${m.email}?subject=${encodeURIComponent(`Re: ${m.subject}`)}`}
                    className="rounded-full bg-ember-500 px-4 py-2 text-xs font-medium text-ink-950 hover:bg-ember-400"
                  >
                    Reply by email
                  </a>
                  <button
                    type="button"
                    disabled={isBusy(`read-${m.id}`)}
                    onClick={() => run(`read-${m.id}`, () => setMessageRead(m.id, !m.is_read))}
                    className="rounded-full px-4 py-2 text-xs font-medium text-mist ring-1 ring-white/15 hover:text-white disabled:opacity-50"
                  >
                    Mark as {m.is_read ? "unread" : "read"}
                  </button>
                  <span className="ml-auto">
                    <DeleteButton
                      name={`message from ${m.name}`}
                      busy={isBusy(`del-${m.id}`)}
                      onDelete={() => run(`del-${m.id}`, () => deleteMessage(m.id), { confirm: `Delete this message from ${m.name}?` })}
                    />
                  </span>
                </div>
              </div>
            )}
          </article>
        );
      })}
    </Card>
  );
}
