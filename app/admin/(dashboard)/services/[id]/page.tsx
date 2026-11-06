import { notFound } from "next/navigation";
import { z } from "zod";
import { getAdminPageSession } from "@/lib/admin/auth";
import { ErrorNotice, PageHeader } from "@/components/admin/ui";
import { ServiceForm } from "@/components/admin/ServiceForm";

export const metadata = { title: "Edit service" };

export default async function EditServicePage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminPageSession();
  if (!session) return null;
  const { id } = await params;
  if (!z.uuid().safeParse(id).success) notFound();

  const { data, error } = await session.supabase.from("services").select("*").eq("id", id).maybeSingle();
  if (error) return <ErrorNotice message={error.message} />;
  if (!data) notFound();

  return (
    <>
      <PageHeader title={data.title} back={{ href: "/admin/services", label: "Services" }} />
      <ServiceForm service={data} />
    </>
  );
}
