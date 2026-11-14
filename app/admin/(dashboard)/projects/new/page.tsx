import { getAdminPageSession } from "@/lib/admin/auth";
import { PageHeader } from "@/components/admin/ui";
import { ProjectForm } from "@/components/admin/ProjectForm";

export const metadata = { title: "New project" };

export default async function NewProjectPage() {
  const session = await getAdminPageSession();
  if (!session) return null;
  const { data } = await session.supabase.from("projects").select("category");
  const categories = Array.from(new Set((data ?? []).map((r: { category: string }) => r.category)));

  return (
    <>
      <PageHeader title="New sample" back={{ href: "/admin/projects", label: "Portfolio" }} />
      <ProjectForm categories={categories} />
    </>
  );
}
