import { getAdminPageSession } from "@/lib/admin/auth";
import { EmptyState, ErrorNotice, PageHeader, PrimaryLink } from "@/components/admin/ui";
import { ProjectsTable } from "@/components/admin/ProjectsTable";

export const metadata = { title: "Portfolio" };

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
        title="Portfolio"
        description="The samples in the Work section. Replace artwork, edit the story, publish or hide, and set the order."
        action={<PrimaryLink href="/admin/projects/new">Add sample</PrimaryLink>}
      />
      {error ? (
        <ErrorNotice message={error.message} />
      ) : data.length === 0 ? (
        <EmptyState
          title="No samples yet"
          description="Your portfolio will show a friendly placeholder until you publish your first project."
          action={<PrimaryLink href="/admin/projects/new">Add your first sample</PrimaryLink>}
        />
      ) : (
        <ProjectsTable projects={data} />
      )}
    </>
  );
}
