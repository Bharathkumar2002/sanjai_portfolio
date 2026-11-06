"use server";

import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin/auth";
import { droppedUrls, moveRow, ok, removeMedia, revalidateSite, toErrorState, uuidSchema } from "@/lib/admin/helpers";
import { fieldErrors, formDataToObject, projectSchema } from "@/lib/validation";
import type { ActionState } from "@/lib/types";

/** Creates (no id) or updates (with id) a project and replaces its gallery. */
export async function saveProject(_prev: ActionState, formData: FormData): Promise<ActionState> {
  let createdId: string | null = null;
  try {
    const { supabase } = await requireAdmin();
    const raw = formDataToObject(formData);
    const id = raw.id ? uuidSchema.parse(raw.id) : null;

    const parsed = projectSchema.safeParse(raw);
    if (!parsed.success) {
      return { status: "error", message: "Please fix the highlighted fields.", fieldErrors: fieldErrors(parsed.error), nonce: Date.now() };
    }
    const { gallery, ...fields } = parsed.data;

    // Remember existing media so replaced/removed files can be cleaned up.
    let previousUrls: Array<string | null> = [];
    if (id) {
      const { data: existing, error } = await supabase
        .from("projects")
        .select("cover_image, project_images(image_url)")
        .eq("id", id)
        .single();
      if (error) throw new Error(error.message);
      previousUrls = [existing.cover_image, ...existing.project_images.map((i: { image_url: string }) => i.image_url)];
    }

    let projectId = id;
    if (id) {
      const { error } = await supabase.from("projects").update(fields).eq("id", id);
      if (error) throw new Error(error.message);
    } else {
      // New projects go to the end of the list unless an order was given.
      if (!fields.display_order) {
        const { data: last } = await supabase.from("projects").select("display_order").order("display_order", { ascending: false }).limit(1).maybeSingle();
        fields.display_order = (last?.display_order ?? 0) + 1;
      }
      const { data, error } = await supabase.from("projects").insert(fields).select("id").single();
      if (error) throw new Error(error.message);
      projectId = data.id;
      createdId = data.id;
    }

    // Replace the gallery atomically (single transaction in the database).
    const { error: galleryError } = await supabase.rpc("replace_project_images", {
      p_project_id: projectId,
      p_images: gallery.map((g) => ({ image_url: g.image_url, alt_text: g.alt_text, caption: g.caption })),
    });
    if (galleryError) throw new Error(galleryError.message);

    await removeMedia(supabase, droppedUrls(previousUrls, [fields.cover_image, ...gallery.map((g) => g.image_url)]));
    revalidateSite();
    if (id) return ok("Project saved.");
  } catch (error) {
    return toErrorState(error, "Could not save the project.");
  }
  redirect(`/admin/projects/${createdId}?created=1`);
}

export async function deleteProject(id: string): Promise<ActionState> {
  try {
    const { supabase } = await requireAdmin();
    uuidSchema.parse(id);
    const { data: existing } = await supabase
      .from("projects")
      .select("cover_image, project_images(image_url)")
      .eq("id", id)
      .single();
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) throw new Error(error.message);
    if (existing) {
      await removeMedia(supabase, [existing.cover_image, ...existing.project_images.map((i: { image_url: string }) => i.image_url)]);
    }
    revalidateSite();
    return ok("Project deleted.");
  } catch (error) {
    return toErrorState(error, "Could not delete the project.");
  }
}

export async function setProjectFlag(id: string, flag: "is_published" | "is_featured", value: boolean): Promise<ActionState> {
  try {
    const { supabase } = await requireAdmin();
    uuidSchema.parse(id);
    if (flag !== "is_published" && flag !== "is_featured") throw new Error("Invalid flag");
    const { error } = await supabase.from("projects").update({ [flag]: Boolean(value) }).eq("id", id);
    if (error) throw new Error(error.message);
    revalidateSite();
    const label = flag === "is_published" ? (value ? "Published" : "Unpublished") : value ? "Marked as featured" : "Removed from featured";
    return ok(`${label}.`);
  } catch (error) {
    return toErrorState(error);
  }
}

export async function moveProject(id: string, direction: "up" | "down"): Promise<ActionState> {
  try {
    const { supabase } = await requireAdmin();
    await moveRow(supabase, "projects", uuidSchema.parse(id), direction === "up" ? "up" : "down");
    revalidateSite();
    return ok("Order updated.");
  } catch (error) {
    return toErrorState(error);
  }
}
