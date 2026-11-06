"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import type { ActionState } from "@/lib/types";

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().pipe(z.email("Enter a valid email address")),
  password: z.string().min(1, "Enter your password").max(200),
  next: z.string().optional(),
});

export async function signIn(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const nonce = Date.now();
  if (!isSupabaseConfigured) return { status: "error", message: "Supabase is not configured yet.", nonce };

  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    next: formData.get("next") ?? undefined,
  });
  if (!parsed.success) {
    return {
      status: "error",
      message: "Please check your details.",
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
      values: { email: String(formData.get("email") ?? "") },
      nonce,
    };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });
  if (error) {
    const message = /rate limit/i.test(error.message)
      ? "Too many attempts. Please wait a moment and try again."
      : "Incorrect email or password.";
    return { status: "error", message, values: { email: parsed.data.email }, nonce };
  }

  // Only allow redirects back into the dashboard (prevents open redirects).
  const next = parsed.data.next;
  redirect(next && /^\/admin(\/[\w\-/]*)?$/.test(next) ? next : "/admin");
}

export async function signOut() {
  if (isSupabaseConfigured) {
    const supabase = await createSupabaseServerClient();
    await supabase.auth.signOut();
  }
  redirect("/admin/login");
}
