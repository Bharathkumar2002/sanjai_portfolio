import { getAdminPageSession } from "@/lib/admin/auth";
import { EmptyState, ErrorNotice, PageHeader, PrimaryLink } from "@/components/admin/ui";
import { ProjectsTable } from "@/components/admin/ProjectsTable";

export const metadata = { title: "Projects" };

export default async function AdminProjectsPage() {
  const session = await getAdminPageSession();
  if (!session) return null;

  const { data, error } = await session.supabase
    .from("projects")
    .select("id, title, slug, category, cover_image, project_year, is_featured, is_published")
    .order("display_order")
    .order("created_at", { ascending: false });

  return (
    <>
      <PageHeader
        title="Projects"
        description="Add case studies, choose what's featured on the home page and set the order they appear in."
        action={<PrimaryLink href="/admin/projects/new">New project</PrimaryLink>}
      />
      {error ? (
        <ErrorNotice message={error.message} />
      ) : data.length === 0 ? (
        <EmptyState
          title="No projects yet"
          description="Your portfolio will show a friendly placeholder until you publish your first project."
          action={<PrimaryLink href="/admin/projects/new">Create your first project</PrimaryLink>}
        />
      ) : (
        <ProjectsTable projects={data} />
      )}
    </>
  );
}
