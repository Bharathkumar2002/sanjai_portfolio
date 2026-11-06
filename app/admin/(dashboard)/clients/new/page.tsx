import { getAdminPageSession } from "@/lib/admin/auth";
import { PageHeader } from "@/components/admin/ui";
import { ClientForm } from "@/components/admin/ClientForm";

export const metadata = { title: "Add client" };

export default async function NewClientPage() {
  if (!(await getAdminPageSession())) return null;
  return (
    <>
      <PageHeader title="Add client" back={{ href: "/admin/clients", label: "Clients" }} />
      <ClientForm />
    </>
  );
}
