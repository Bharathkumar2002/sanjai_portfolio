"use server";

import { requireAdmin } from "@/lib/admin/auth";
import { droppedUrls, ok, removeMedia, revalidateSite, toErrorState } from "@/lib/admin/helpers";
import { fieldErrors, formDataToObject, settingsSchema } from "@/lib/validation";
import type { ActionState } from "@/lib/types";

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
      .select("hero_image, about_image, og_image")
      .eq("id", 1)
      .maybeSingle();

    const { error } = await supabase.from("site_settings").upsert({ id: 1, ...fields });
    if (error) throw new Error(error.message);

    await removeMedia(
      supabase,
      droppedUrls(
        [existing?.hero_image, existing?.about_image, existing?.og_image],
        [fields.hero_image, fields.about_image, fields.og_image],
      ),
    );
    revalidateSite();
    return ok("Website content saved. Changes are live.");
  } catch (error) {
    return toErrorState(error, "Could not save the website content.");
  }
}
