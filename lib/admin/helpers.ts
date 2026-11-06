import "server-only";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import type { SupabaseClient } from "@supabase/supabase-js";
import { MEDIA_BUCKET } from "@/lib/supabase/env";
import { storagePathFromUrl } from "@/lib/utils";
import type { ActionState } from "@/lib/types";
import { UnauthorizedError } from "./auth";

export const uuidSchema = z.uuid("Invalid id");

/** Public pages are cached (ISR); refresh them all after any content change. */
export function revalidateSite() {
  revalidatePath("/", "layout");
}

/** Deletes files from our media bucket. External URLs (e.g. Unsplash) are ignored. */
export async function removeMedia(supabase: SupabaseClient, urls: Array<string | null | undefined>) {
  const paths = Array.from(new Set(urls.map(storagePathFromUrl).filter((p): p is string => Boolean(p))));
  if (!paths.length) return;
  const { error } = await supabase.storage.from(MEDIA_BUCKET).remove(paths);
  if (error) console.error("[media] cleanup failed:", error.message);
}

/** URLs present in `before` but no longer referenced in `after`. */
export function droppedUrls(before: Array<string | null | undefined>, after: Array<string | null | undefined>) {
  const keep = new Set(after.filter(Boolean));
  return before.filter((u): u is string => Boolean(u) && !keep.has(u as string));
}

type OrderedTable = "projects" | "services" | "clients";

/** Moves a row one position up or down, then renumbers display_order 1..n. */
export async function moveRow(supabase: SupabaseClient, table: OrderedTable, id: string, direction: "up" | "down") {
  const { data, error } = await supabase
    .from(table)
    .select("id")
    .order("display_order")
    .order("created_at", { ascending: table !== "projects" });
  if (error) throw new Error(error.message);

  const ids = (data ?? []).map((r: { id: string }) => r.id);
  const from = ids.indexOf(id);
  const to = direction === "up" ? from - 1 : from + 1;
  if (from === -1 || to < 0 || to >= ids.length) return;
  [ids[from], ids[to]] = [ids[to], ids[from]];

  const results = await Promise.all(
    ids.map((rowId, i) => supabase.from(table).update({ display_order: i + 1 }).eq("id", rowId)),
  );
  const failed = results.find((r) => r.error);
  if (failed?.error) throw new Error(failed.error.message);
}

/** Converts thrown errors into a friendly ActionState. */
export function toErrorState(error: unknown, fallback = "Something went wrong. Please try again."): ActionState {
  if (error instanceof UnauthorizedError) return { status: "error", message: error.message, nonce: Date.now() };
  const message = error instanceof Error ? error.message : String(error);
  console.error("[admin]", message);
  if (/duplicate key.*slug/i.test(message)) {
    return { status: "error", message: "That slug is already used by another project.", fieldErrors: { slug: ["Already in use"] }, nonce: Date.now() };
  }
  return { status: "error", message: fallback, nonce: Date.now() };
}

export const ok = (message: string): ActionState => ({ status: "success", message, nonce: Date.now() });
