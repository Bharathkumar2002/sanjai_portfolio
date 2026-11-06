"use server";

import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin/auth";
import { droppedUrls, moveRow, ok, removeMedia, revalidateSite, toErrorState, uuidSchema } from "@/lib/admin/helpers";
import { fieldErrors, formDataToObject, serviceSchema } from "@/lib/validation";
import type { ActionState } from "@/lib/types";

export async function saveService(_prev: ActionState, formData: FormData): Promise<ActionState> {
  try {
    const { supabase } = await requireAdmin();
    const raw = formDataToObject(formData);
    const id = raw.id ? uuidSchema.parse(raw.id) : null;
    const parsed = serviceSchema.safeParse(raw);
    if (!parsed.success) {
      return { status: "error", message: "Please fix the highlighted fields.", fieldErrors: fieldErrors(parsed.error), nonce: Date.now() };
    }
    const fields = parsed.data;

    if (id) {
      const { data: existing } = await supabase.from("services").select("image_url").eq("id", id).single();
      const { error } = await supabase.from("services").update(fields).eq("id", id);
      if (error) throw new Error(error.message);
      await removeMedia(supabase, droppedUrls([existing?.image_url], [fields.image_url]));
      revalidateSite();
      return ok("Service saved.");
    }

    if (!fields.display_order) {
      const { data: last } = await supabase.from("services").select("display_order").order("display_order", { ascending: false }).limit(1).maybeSingle();
      fields.display_order = (last?.display_order ?? 0) + 1;
    }
    const { error } = await supabase.from("services").insert(fields);
    if (error) throw new Error(error.message);
    revalidateSite();
  } catch (error) {
    return toErrorState(error, "Could not save the service.");
  }
  redirect("/admin/services?saved=1");
}

export async function deleteService(id: string): Promise<ActionState> {
  try {
    const { supabase } = await requireAdmin();
    uuidSchema.parse(id);
    const { data: existing } = await supabase.from("services").select("image_url").eq("id", id).single();
    const { error } = await supabase.from("services").delete().eq("id", id);
    if (error) throw new Error(error.message);
    await removeMedia(supabase, [existing?.image_url]);
    revalidateSite();
    return ok("Service deleted.");
  } catch (error) {
    return toErrorState(error, "Could not delete the service.");
  }
}

export async function setServicePublished(id: string, value: boolean): Promise<ActionState> {
  try {
    const { supabase } = await requireAdmin();
    const { error } = await supabase.from("services").update({ is_published: Boolean(value) }).eq("id", uuidSchema.parse(id));
    if (error) throw new Error(error.message);
    revalidateSite();
    return ok(value ? "Service is now visible." : "Service hidden.");
  } catch (error) {
    return toErrorState(error);
  }
}

export async function moveService(id: string, direction: "up" | "down"): Promise<ActionState> {
  try {
    const { supabase } = await requireAdmin();
    await moveRow(supabase, "services", uuidSchema.parse(id), direction === "up" ? "up" : "down");
    revalidateSite();
    return ok("Order updated.");
  } catch (error) {
    return toErrorState(error);
  }
}
