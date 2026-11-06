import { notFound } from "next/navigation";
import { z } from "zod";
import { getAdminPageSession } from "@/lib/admin/auth";
import { ErrorNotice, PageHeader } from "@/components/admin/ui";
import { ClientForm } from "@/components/admin/ClientForm";

export const metadata = { title: "Edit client" };

export default async function EditClientPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminPageSession();
  if (!session) return null;
  const { id } = await params;
  if (!z.uuid().safeParse(id).success) notFound();

  const { data, error } = await session.supabase.from("clients").select("*").eq("id", id).maybeSingle();
  if (error) return <ErrorNotice message={error.message} />;
  if (!data) notFound();

  return (
    <>
      <PageHeader title={data.name} back={{ href: "/admin/clients", label: "Clients" }} />
      <ClientForm client={data} />
    </>
  );
}
