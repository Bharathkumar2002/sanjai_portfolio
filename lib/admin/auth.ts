import "server-only";
import { cache } from "react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export type AdminSession =
  | { status: "unconfigured" }
  | { status: "signed-out" }
  | { status: "forbidden"; email: string | undefined }
  | {
      status: "admin";
      user: { id: string; email: string | undefined };
      profile: { full_name: string | null; email: string | null };
      supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>;
    };

/**
 * Resolves the current dashboard session. Uses getUser(), which validates the
 * token with Supabase Auth, then checks the admin role on the profile.
 */
export const getAdminSession = cache(async (): Promise<AdminSession> => {
  if (!isSupabaseConfigured) return { status: "unconfigured" };
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { status: "signed-out" };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, full_name, email")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.role !== "admin") return { status: "forbidden", email: user.email };
  return {
    status: "admin",
    user: { id: user.id, email: user.email },
    profile: { full_name: profile.full_name, email: profile.email },
    supabase,
  };
});

export class UnauthorizedError extends Error {
  constructor() {
    super("You must be signed in as an administrator to do that.");
  }
}

/**
 * For dashboard pages. Pages render in parallel with the layout, so each page
 * checks for itself; the layout decides what to show for non-admin states.
 */
export async function getAdminPageSession() {
  const session = await getAdminSession();
  return session.status === "admin" ? session : null;
}

/** Guard for server actions. Throws unless the caller is an admin. */
export async function requireAdmin() {
  const session = await getAdminSession();
  if (session.status !== "admin") throw new UnauthorizedError();
  return session;
}
