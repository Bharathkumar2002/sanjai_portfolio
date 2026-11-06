"use server";

import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin/auth";
import { droppedUrls, moveRow, ok, removeMedia, revalidateSite, toErrorState, uuidSchema } from "@/lib/admin/helpers";
import { clientSchema, fieldErrors, formDataToObject } from "@/lib/validation";
import type { ActionState } from "@/lib/types";

export async function saveClient(_prev: ActionState, formData: FormData): Promise<ActionState> {
  try {
    const { supabase } = await requireAdmin();
    const raw = formDataToObject(formData);
    const id = raw.id ? uuidSchema.parse(raw.id) : null;
    const parsed = clientSchema.safeParse(raw);
    if (!parsed.success) {
      return { status: "error", message: "Please fix the highlighted fields.", fieldErrors: fieldErrors(parsed.error), nonce: Date.now() };
    }
    const fields = parsed.data;

    if (id) {
      const { data: existing } = await supabase.from("clients").select("logo_url").eq("id", id).single();
      const { error } = await supabase.from("clients").update(fields).eq("id", id);
      if (error) throw new Error(error.message);
      await removeMedia(supabase, droppedUrls([existing?.logo_url], [fields.logo_url]));
      revalidateSite();
      return ok("Client saved.");
    }

    if (!fields.display_order) {
      const { data: last } = await supabase.from("clients").select("display_order").order("display_order", { ascending: false }).limit(1).maybeSingle();
      fields.display_order = (last?.display_order ?? 0) + 1;
    }
    const { error } = await supabase.from("clients").insert(fields);
    if (error) throw new Error(error.message);
    revalidateSite();
  } catch (error) {
    return toErrorState(error, "Could not save the client.");
  }
  redirect("/admin/clients?saved=1");
}

export async function deleteClient(id: string): Promise<ActionState> {
  try {
    const { supabase } = await requireAdmin();
    uuidSchema.parse(id);
    const { data: existing } = await supabase.from("clients").select("logo_url").eq("id", id).single();
    const { error } = await supabase.from("clients").delete().eq("id", id);
    if (error) throw new Error(error.message);
    await removeMedia(supabase, [existing?.logo_url]);
    revalidateSite();
    return ok("Client deleted.");
  } catch (error) {
    return toErrorState(error, "Could not delete the client.");
  }
}

export async function setClientPublished(id: string, value: boolean): Promise<ActionState> {
  try {
    const { supabase } = await requireAdmin();
    const { error } = await supabase.from("clients").update({ is_published: Boolean(value) }).eq("id", uuidSchema.parse(id));
    if (error) throw new Error(error.message);
    revalidateSite();
    return ok(value ? "Client is now visible." : "Client hidden.");
  } catch (error) {
    return toErrorState(error);
  }
}

export async function moveClient(id: string, direction: "up" | "down"): Promise<ActionState> {
  try {
    const { supabase } = await requireAdmin();
    await moveRow(supabase, "clients", uuidSchema.parse(id), direction === "up" ? "up" : "down");
    revalidateSite();
    return ok("Order updated.");
  } catch (error) {
    return toErrorState(error);
  }
}
