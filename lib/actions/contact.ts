"use server";

import { createHash } from "node:crypto";
import { headers } from "next/headers";
import { createSupabasePublicClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { contactSchema, fieldErrors, formDataToObject } from "@/lib/validation";
import type { ActionState } from "@/lib/types";

const MIN_FILL_MS = 2500;

const dbErrors: Record<string, string> = {
  duplicate_message: "Looks like you already sent this message — I've got it and will be in touch.",
  rate_limited: "You've sent a few messages recently. Please try again a little later or email me directly.",
  invalid_email: "Please enter a valid email address.",
  invalid_name: "Please enter your name.",
  invalid_subject: "Please add a subject.",
  invalid_message: "Your message should be between 10 and 5000 characters.",
};

function hashIp(ip: string) {
  const salt = process.env.CONTACT_HASH_SALT ?? "portfolio";
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex");
}

export async function submitContact(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const nonce = Date.now();
  const raw = formDataToObject(formData);

  // Spam traps. Bots get a fake success so they don't adapt.
  const startedAt = Number(raw.started_at);
  if (raw.website || (Number.isFinite(startedAt) && startedAt > 0 && Date.now() - startedAt < MIN_FILL_MS)) {
    return { status: "success", message: "Thanks! Your message has been sent.", nonce };
  }

  const values = {
    name: raw.name ?? "",
    email: raw.email ?? "",
    subject: raw.subject ?? "",
    project_type: raw.project_type ?? "",
    message: raw.message ?? "",
  };

  const parsed = contactSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      status: "error",
      message: "Please check the highlighted fields.",
      fieldErrors: fieldErrors(parsed.error),
      values,
      nonce,
    };
  }

  if (!isSupabaseConfigured) {
    return { status: "error", message: "The contact form isn't connected to a database yet.", values, nonce };
  }

  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "";
  const { name, email, subject, project_type, message } = parsed.data;

  const { error } = await createSupabasePublicClient().rpc("submit_contact_message", {
    p_name: name,
    p_email: email,
    p_subject: subject,
    p_message: message,
    p_project_type: project_type || null,
    p_ip_hash: ip ? hashIp(ip) : null,
    p_user_agent: h.get("user-agent")?.slice(0, 512) ?? null,
  });

  if (error) {
    const known = dbErrors[error.message];
    if (!known) console.error("[contact] submit failed:", error.message);
    const isDuplicate = error.message === "duplicate_message";
    return {
      status: isDuplicate ? "success" : "error",
      message: known ?? "Something went wrong while sending your message. Please try again.",
      values: isDuplicate ? undefined : values,
      nonce,
    };
  }

  return { status: "success", message: "Thanks! Your message has been sent — I'll be in touch soon.", nonce };
}
