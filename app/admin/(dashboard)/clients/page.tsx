import { getAdminPageSession } from "@/lib/admin/auth";
import { EmptyState, ErrorNotice, PageHeader, PrimaryLink } from "@/components/admin/ui";
import { ClientsTable } from "@/components/admin/ClientsTable";
import { FlashToast } from "@/components/admin/FlashToast";

export const metadata = { title: "Clients" };

export default async function AdminClientsPage({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  const session = await getAdminPageSession();
  if (!session) return null;
  const [{ saved }, { data, error }] = await Promise.all([
    searchParams,
    session.supabase.from("clients").select("*").order("display_order").order("created_at"),
  ]);

  return (
    <>
      <FlashToast message={saved ? "Client added." : null} />
      <PageHeader
        title="Clients"
        description="Logos shown in the “Trusted by” strip under the hero. Four or more scroll as a marquee."
        action={<PrimaryLink href="/admin/clients/new">Add client</PrimaryLink>}
      />
      {error ? (
        <ErrorNotice message={error.message} />
      ) : data.length === 0 ? (
        <EmptyState title="No clients yet" description="The strip is hidden until you add a client." action={<PrimaryLink href="/admin/clients/new">Add a client</PrimaryLink>} />
      ) : (
        <ClientsTable clients={data} />
      )}
    </>
  );
}
