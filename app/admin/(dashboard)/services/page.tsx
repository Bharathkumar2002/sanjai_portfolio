import { getAdminPageSession } from "@/lib/admin/auth";
import { EmptyState, ErrorNotice, PageHeader, PrimaryLink } from "@/components/admin/ui";
import { ServicesTable } from "@/components/admin/ServicesTable";
import { FlashToast } from "@/components/admin/FlashToast";

export const metadata = { title: "Services" };

export default async function AdminServicesPage({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  const session = await getAdminPageSession();
  if (!session) return null;
  const [{ saved }, { data, error }] = await Promise.all([
    searchParams,
    session.supabase.from("services").select("*").order("display_order").order("created_at"),
  ]);

  return (
    <>
      <FlashToast message={saved ? "Service created." : null} />
      <PageHeader
        title="Services"
        description="Services appear in the hero strip, the services section and as project types in the contact form."
        action={<PrimaryLink href="/admin/services/new">New service</PrimaryLink>}
      />
      {error ? (
        <ErrorNotice message={error.message} />
      ) : data.length === 0 ? (
        <EmptyState title="No services yet" description="Add the disciplines you offer, like brand identity or packaging." action={<PrimaryLink href="/admin/services/new">Add a service</PrimaryLink>} />
      ) : (
        <ServicesTable services={data} />
      )}
    </>
  );
}
