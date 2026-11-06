import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin/auth";
import { signOut } from "@/lib/actions/admin/auth";
import { getSiteSettings } from "@/lib/data/public";
import { Sidebar } from "@/components/admin/Sidebar";

export const dynamic = "force-dynamic";

function Centered({ children }: { children: React.ReactNode }) {
  return (
    <main className="grid min-h-dvh place-items-center px-4 py-16">
      <div className="w-full max-w-lg rounded-3xl bg-ink-900 p-8 ring-1 ring-white/[0.06] sm:p-10">{children}</div>
    </main>
  );
}

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getAdminSession();

  if (session.status === "unconfigured") {
    return (
      <Centered>
        <h1 className="font-display text-2xl font-semibold">Connect Supabase to use the dashboard</h1>
        <p className="mt-3 text-sm leading-relaxed text-mist">
          The website is running in preview mode with placeholder content. To manage content:
        </p>
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-mist">
          <li>Create a Supabase project and run the SQL files in <code className="text-bone">supabase/migrations</code>.</li>
          <li>Copy <code className="text-bone">.env.example</code> to <code className="text-bone">.env.local</code> and add your project URL and publishable key.</li>
          <li>Create your admin user and promote it (see README → “Create the first admin”).</li>
          <li>Restart the dev server.</li>
        </ol>
        <Link href="/" className="mt-6 inline-block text-sm text-ember-300 hover:underline">← Back to website</Link>
      </Centered>
    );
  }

  if (session.status === "signed-out") redirect("/admin/login");

  if (session.status === "forbidden") {
    return (
      <Centered>
        <h1 className="font-display text-2xl font-semibold">No dashboard access</h1>
        <p className="mt-3 text-sm leading-relaxed text-mist">
          You are signed in as <span className="text-bone">{session.email}</span>, but this account is not an administrator.
          Ask the site owner to grant access.
        </p>
        <form action={signOut} className="mt-6">
          <button type="submit" className="rounded-full bg-white/10 px-5 py-2.5 text-sm font-medium hover:bg-white/15">
            Sign out
          </button>
        </form>
      </Centered>
    );
  }

  const [settings, { count: unread }] = await Promise.all([
    getSiteSettings(),
    session.supabase.from("contact_messages").select("id", { count: "exact", head: true }).eq("is_read", false),
  ]);

  return (
    <div className="min-h-dvh lg:flex">
      <Sidebar brandName={settings.brand_name} email={session.user.email} unread={unread ?? 0} />
      <main id="main" className="min-w-0 flex-1 px-4 py-8 sm:px-8 lg:py-10">
        <div className="mx-auto max-w-6xl">{children}</div>
      </main>
    </div>
  );
}
