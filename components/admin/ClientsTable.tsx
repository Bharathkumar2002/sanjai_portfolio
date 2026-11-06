"use client";

import Image from "next/image";
import Link from "next/link";
import { deleteClient, moveClient, setClientPublished } from "@/lib/actions/admin/clients";
import { useRunAction } from "@/lib/hooks/useRunAction";
import type { Client } from "@/lib/types";
import { Badge, Card } from "./ui";
import { DeleteButton, EditLink, IconButton, OrderButtons } from "./RowControls";
import { EyeIcon, EyeOffIcon } from "@/components/ui/icons";

export function ClientsTable({ clients }: { clients: Client[] }) {
  const { run, isPending, isBusy } = useRunAction();

  return (
    <Card className="divide-y divide-white/[0.06]">
      {clients.map((c, i) => (
        <div key={c.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
          <div className="flex min-w-0 flex-1 items-center gap-4">
            <div className="relative h-12 w-24 shrink-0 overflow-hidden rounded-xl bg-ink-800">
              {c.logo_url ? (
                <Image src={c.logo_url} alt="" fill unoptimized sizes="96px" className="object-contain p-2 brightness-0 invert" />
              ) : (
                <span className="grid h-full place-items-center px-2 text-center text-[11px] font-semibold text-white/50">No logo</span>
              )}
            </div>
            <div className="min-w-0">
              <Link href={`/admin/clients/${c.id}`} className="block truncate font-medium text-bone hover:text-ember-300">
                {c.name}
              </Link>
              <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-smoke">
                {c.website_url && <span className="truncate">{c.website_url.replace(/^https?:\/\//, "")}</span>}
                {c.is_published ? <Badge tone="success">Visible</Badge> : <Badge tone="muted">Hidden</Badge>}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-0.5 self-end sm:self-auto">
            <OrderButtons name={c.name} index={i} total={clients.length} disabled={isPending} onMove={(dir) => run(`move-${c.id}`, () => moveClient(c.id, dir), { quiet: true })} />
            <IconButton
              label={c.is_published ? `Hide ${c.name}` : `Show ${c.name}`}
              disabled={isBusy(`pub-${c.id}`)}
              onClick={() => run(`pub-${c.id}`, () => setClientPublished(c.id, !c.is_published))}
            >
              {c.is_published ? <EyeIcon size={16} /> : <EyeOffIcon size={16} />}
            </IconButton>
            <EditLink href={`/admin/clients/${c.id}`} name={c.name} />
            <DeleteButton name={c.name} busy={isBusy(`del-${c.id}`)} onDelete={() => run(`del-${c.id}`, () => deleteClient(c.id), { confirm: `Remove ${c.name} from your clients?` })} />
          </div>
        </div>
      ))}
    </Card>
  );
}
