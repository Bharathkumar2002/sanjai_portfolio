import { getAdminPageSession } from "@/lib/admin/auth";
import { defaultSettings } from "@/lib/data/defaults";
import { ErrorNotice, PageHeader } from "@/components/admin/ui";
import { ProfileForm } from "@/components/admin/ProfileForm";
import type { SiteSettings } from "@/lib/types";

export const metadata = { title: "Profile" };

export default async function ProfilePage() {
  const session = await getAdminPageSession();
  if (!session) return null;
  const { data, error } = await session.supabase.from("site_settings").select("*").eq("id", 1).maybeSingle();

  return (
    <>
      <PageHeader
        title="Profile"
        description="Your details, photos, résumé and the text on your home page."
        action={
          <a href="/" target="_blank" rel="noopener noreferrer" className="text-sm text-mist hover:text-white">
            Preview website ↗
          </a>
        }
      />
      {error ? <ErrorNotice message={error.message} /> : <ProfileForm settings={{ ...defaultSettings, ...(data ?? {}) } as SiteSettings} />}
    </>
  );
}
