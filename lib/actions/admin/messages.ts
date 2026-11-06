"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin/auth";
import { ok, toErrorState, uuidSchema } from "@/lib/admin/helpers";
import type { ActionState } from "@/lib/types";

export async function setMessageRead(id: string, isRead: boolean): Promise<ActionState> {
  try {
    const { supabase } = await requireAdmin();
    const { error } = await supabase.from("contact_messages").update({ is_read: Boolean(isRead) }).eq("id", uuidSchema.parse(id));
    if (error) throw new Error(error.message);
    revalidatePath("/admin", "layout");
    return ok(isRead ? "Marked as read." : "Marked as unread.");
  } catch (error) {
    return toErrorState(error);
  }
}

export async function deleteMessage(id: string): Promise<ActionState> {
  try {
    const { supabase } = await requireAdmin();
    const { error } = await supabase.from("contact_messages").delete().eq("id", uuidSchema.parse(id));
    if (error) throw new Error(error.message);
    revalidatePath("/admin", "layout");
    return ok("Message deleted.");
  } catch (error) {
    return toErrorState(error, "Could not delete the message.");
  }
}
