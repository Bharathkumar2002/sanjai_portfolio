import { getAdminPageSession } from "@/lib/admin/auth";
import { defaultSettings } from "@/lib/data/defaults";
import { ErrorNotice, PageHeader } from "@/components/admin/ui";
import { SettingsForm } from "@/components/admin/SettingsForm";
import type { SiteSettings } from "@/lib/types";

export const metadata = { title: "Website content" };

export default async function ContentPage() {
  const session = await getAdminPageSession();
  if (!session) return null;
  const { data, error } = await session.supabase.from("site_settings").select("*").eq("id", 1).maybeSingle();

  return (
    <>
      <PageHeader
        title="Website content"
        description="Edit the words and images on your home page, your contact details and how the site appears in search."
        action={
          <a href="/" target="_blank" rel="noopener noreferrer" className="text-sm text-mist hover:text-white">
            Preview website ↗
          </a>
        }
      />
      {error ? <ErrorNotice message={error.message} /> : <SettingsForm settings={{ ...defaultSettings, ...(data ?? {}) } as SiteSettings} />}
    </>
  );
}
