import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin/auth";
import { getSiteSettings } from "@/lib/data/public";
import { LoginForm } from "@/components/admin/LoginForm";

export const metadata: Metadata = { title: "Sign in" };
export const dynamic = "force-dynamic";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const [session, settings, { next }] = await Promise.all([getAdminSession(), getSiteSettings(), searchParams]);
  if (session.status === "admin") redirect("/admin");

  return (
    <main className="relative grid min-h-dvh place-items-center overflow-hidden px-4 py-16">
      <div className="pointer-events-none absolute -left-40 -top-40 size-[36rem] rounded-full bg-ember-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 size-[30rem] rounded-full bg-flame-600/15 blur-3xl" />
      <div className="relative w-full max-w-md">
        <Link href="/" className="font-display text-xl font-bold tracking-tight">
          {settings.brand_name}
          <span className="text-ember-400">.</span>
        </Link>
        <div className="mt-6 rounded-3xl bg-ink-900/90 p-8 ring-1 ring-white/[0.06] backdrop-blur-xl sm:p-10">
          <h1 className="font-display text-3xl font-semibold tracking-tight">Welcome back</h1>
          <p className="mt-2 text-sm text-mist">Sign in to manage your portfolio.</p>
          {session.status === "unconfigured" ? (
            <p className="mt-6 rounded-2xl bg-ember-500/10 p-4 text-sm text-ember-300">
              Supabase isn&apos;t configured yet. Add your keys to <code>.env.local</code> — see the README.
            </p>
          ) : (
            <LoginForm next={next} />
          )}
          {session.status === "forbidden" && (
            <p className="mt-4 text-xs text-smoke">Signed in as {session.email}, which is not an administrator account.</p>
          )}
        </div>
      </div>
    </main>
  );
}
