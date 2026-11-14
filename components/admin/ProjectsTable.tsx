"use client";

import Image from "next/image";
import Link from "next/link";
import { deleteProject, moveProject, setProjectFlag } from "@/lib/actions/admin/projects";
import { useRunAction } from "@/lib/hooks/useRunAction";
import type { Project } from "@/lib/types";
import { Badge, Card } from "./ui";
import { DeleteButton, EditLink, IconButton, OrderButtons } from "./RowControls";
import { ExternalIcon, EyeIcon, EyeOffIcon, ImageIcon } from "@/components/ui/icons";

type Row = Pick<Project, "id" | "title" | "slug" | "category" | "cover_image" | "project_year" | "is_featured" | "is_published">;

export function ProjectsTable({ projects }: { projects: Row[] }) {
  const { run, isPending, isBusy } = useRunAction();

  return (
    <Card className="divide-y divide-white/[0.06]">
      {projects.map((p, i) => (
        <div key={p.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
          <div className="flex min-w-0 flex-1 items-center gap-4">
            <div className="relative h-[70px] w-14 shrink-0 overflow-hidden rounded-xl bg-ink-800">
              {p.cover_image ? (
                <Image src={p.cover_image} alt="" fill unoptimized sizes="56px" className="object-cover" />
              ) : (
                <span className="grid h-full place-items-center text-white/20"><ImageIcon size={20} /></span>
              )}
            </div>
            <div className="min-w-0">
              <Link href={`/admin/projects/${p.id}`} className="block truncate font-medium text-bone hover:text-ember-300">
                {p.title}
              </Link>
              <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-smoke">
                <span>{p.category}</span>
                {p.project_year && <span>· {p.project_year}</span>}
                <span className="ml-1">{p.is_published ? <Badge tone="success">Published</Badge> : <Badge tone="muted">Draft</Badge>}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-0.5 self-end sm:self-auto">
            <OrderButtons name={p.title} index={i} total={projects.length} disabled={isPending} onMove={(dir) => run(`move-${p.id}`, () => moveProject(p.id, dir), { quiet: true })} />
            <IconButton
              label={p.is_published ? `Unpublish ${p.title}` : `Publish ${p.title}`}
              disabled={isBusy(`pub-${p.id}`)}
              onClick={() => run(`pub-${p.id}`, () => setProjectFlag(p.id, "is_published", !p.is_published))}
            >
              {p.is_published ? <EyeIcon size={16} /> : <EyeOffIcon size={16} />}
            </IconButton>
            {p.is_published && (
              <a href={`/projects/${p.slug}`} target="_blank" rel="noopener noreferrer" aria-label={`View ${p.title} on the site`} title="View on site" className="grid size-9 place-items-center rounded-xl text-mist hover:bg-white/10 hover:text-white">
                <ExternalIcon size={16} />
              </a>
            )}
            <EditLink href={`/admin/projects/${p.id}`} name={p.title} />
            <DeleteButton
              name={p.title}
              busy={isBusy(`del-${p.id}`)}
              onDelete={() => run(`del-${p.id}`, () => deleteProject(p.id), { confirm: `Delete “${p.title}” and all of its images? This cannot be undone.` })}
            />
          </div>
        </div>
      ))}
    </Card>
  );
}
