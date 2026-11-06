import { getAdminPageSession } from "@/lib/admin/auth";
import { PageHeader } from "@/components/admin/ui";
import { ServiceForm } from "@/components/admin/ServiceForm";

export const metadata = { title: "New service" };

export default async function NewServicePage() {
  if (!(await getAdminPageSession())) return null;
  return (
    <>
      <PageHeader title="New service" back={{ href: "/admin/services", label: "Services" }} />
      <ServiceForm />
    </>
  );
}
