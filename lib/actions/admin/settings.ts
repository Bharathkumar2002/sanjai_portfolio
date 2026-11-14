"use server";

import { requireAdmin } from "@/lib/admin/auth";
import { droppedUrls, ok, removeMedia, revalidateSite, toErrorState } from "@/lib/admin/helpers";
import { fieldErrors, formDataToObject, settingsSchema } from "@/lib/validation";
import type { ActionState } from "@/lib/types";

const MEDIA_FIELDS = ["hero_image", "hero_background_image", "contact_image", "og_image", "resume_url"] as const;

export async function saveSettings(_prev: ActionState, formData: FormData): Promise<ActionState> {
  try {
    const { supabase } = await requireAdmin();
    const parsed = settingsSchema.safeParse(formDataToObject(formData));
    if (!parsed.success) {
      return { status: "error", message: "Please fix the highlighted fields.", fieldErrors: fieldErrors(parsed.error), nonce: Date.now() };
    }
    const fields = parsed.data;

    const { data: existing } = await supabase
      .from("site_settings")
      .select(MEDIA_FIELDS.join(", "))
      .eq("id", 1)
      .maybeSingle<Record<(typeof MEDIA_FIELDS)[number], string | null>>();

    // Résumé metadata follows the file: stamp the date when it changes, clear it when removed.
    const resumeChanged = (existing?.resume_url ?? null) !== fields.resume_url;
    const resume = fields.resume_url
      ? resumeChanged
        ? { resume_updated_at: new Date().toISOString() }
        : {}
      : { resume_file_name: null, resume_size_bytes: null, resume_updated_at: null };

    const { error } = await supabase.from("site_settings").upsert({ id: 1, ...fields, ...resume });
    if (error) throw new Error(error.message);

    await removeMedia(
      supabase,
      droppedUrls(
        MEDIA_FIELDS.map((f) => existing?.[f]),
        MEDIA_FIELDS.map((f) => fields[f]),
      ),
    );
    revalidateSite();
    return ok("Profile saved. Changes are live.");
  } catch (error) {
    return toErrorState(error, "Could not save the profile.");
  }
}
