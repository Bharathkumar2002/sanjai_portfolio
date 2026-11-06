"use client";

import Image from "next/image";
import Link from "next/link";
import { deleteService, moveService, setServicePublished } from "@/lib/actions/admin/services";
import { useRunAction } from "@/lib/hooks/useRunAction";
import type { Service } from "@/lib/types";
import { Badge, Card } from "./ui";
import { DeleteButton, EditLink, IconButton, OrderButtons } from "./RowControls";
import { EyeIcon, EyeOffIcon, ImageIcon } from "@/components/ui/icons";

export function ServicesTable({ services }: { services: Service[] }) {
  const { run, isPending, isBusy } = useRunAction();

  return (
    <Card className="divide-y divide-white/[0.06]">
      {services.map((s, i) => (
        <div key={s.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
          <div className="flex min-w-0 flex-1 items-center gap-4">
            <div className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-ink-800">
              {s.image_url ? (
                <Image src={s.image_url} alt="" fill unoptimized sizes="56px" className="object-cover" />
              ) : (
                <span className="grid h-full place-items-center text-white/20"><ImageIcon size={20} /></span>
              )}
            </div>
            <div className="min-w-0">
              <Link href={`/admin/services/${s.id}`} className="block truncate font-medium text-bone hover:text-ember-300">
                {s.title}
              </Link>
              <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-smoke">
                <span>{s.deliverables.length} deliverables</span>
                {s.is_published ? <Badge tone="success">Visible</Badge> : <Badge tone="muted">Hidden</Badge>}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-0.5 self-end sm:self-auto">
            <OrderButtons name={s.title} index={i} total={services.length} disabled={isPending} onMove={(dir) => run(`move-${s.id}`, () => moveService(s.id, dir), { quiet: true })} />
            <IconButton
              label={s.is_published ? `Hide ${s.title}` : `Show ${s.title}`}
              disabled={isBusy(`pub-${s.id}`)}
              onClick={() => run(`pub-${s.id}`, () => setServicePublished(s.id, !s.is_published))}
            >
              {s.is_published ? <EyeIcon size={16} /> : <EyeOffIcon size={16} />}
            </IconButton>
            <EditLink href={`/admin/services/${s.id}`} name={s.title} />
            <DeleteButton name={s.title} busy={isBusy(`del-${s.id}`)} onDelete={() => run(`del-${s.id}`, () => deleteService(s.id), { confirm: `Delete the “${s.title}” service?` })} />
          </div>
        </div>
      ))}
    </Card>
  );
}
