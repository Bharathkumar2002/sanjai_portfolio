import { notFound } from "next/navigation";
import { z } from "zod";
import { getAdminPageSession } from "@/lib/admin/auth";
import { Badge, ErrorNotice, PageHeader } from "@/components/admin/ui";
import { ProjectForm } from "@/components/admin/ProjectForm";
import { FlashToast } from "@/components/admin/FlashToast";
import type { ProjectWithImages } from "@/lib/types";

export const metadata = { title: "Edit project" };

type Props = { params: Promise<{ id: string }>; searchParams: Promise<{ created?: string }> };

export default async function EditProjectPage({ params, searchParams }: Props) {
  const session = await getAdminPageSession();
  if (!session) return null;
  const [{ id }, { created }] = await Promise.all([params, searchParams]);
  if (!z.uuid().safeParse(id).success) notFound();

  const [{ data: project, error }, { data: cats }] = await Promise.all([
    session.supabase
      .from("projects")
      .select("*, project_images(*)")
      .eq("id", id)
      .order("display_order", { referencedTable: "project_images" })
      .maybeSingle(),
    session.supabase.from("projects").select("category"),
  ]);
  if (error) return <ErrorNotice message={error.message} />;
  if (!project) notFound();
  const p = project as ProjectWithImages;

  return (
    <>
      <FlashToast message={created ? "Project created." : null} />
      <PageHeader
        title={p.title}
        back={{ href: "/admin/projects", label: "Portfolio" }}
        action={
          <div className="flex items-center gap-3">
            {p.is_published ? <Badge tone="success">Published</Badge> : <Badge tone="muted">Draft</Badge>}
            {p.is_published && (
              <a href={`/projects/${p.slug}`} target="_blank" rel="noopener noreferrer" className="text-sm text-mist hover:text-white">
                View on site ↗
              </a>
            )}
          </div>
        }
      />
      <ProjectForm project={p} categories={Array.from(new Set((cats ?? []).map((r: { category: string }) => r.category)))} />
    </>
  );
}
