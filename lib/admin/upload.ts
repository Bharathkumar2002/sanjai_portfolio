import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { MEDIA_BUCKET } from "@/lib/supabase/env";

/** Must match allowed_mime_types / file_size_limit in supabase/migrations/*_storage.sql */
export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif", "image/svg+xml"];
export const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
export type MediaFolder = "projects" | "services" | "clients" | "site" | "profiles";

const EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
  "image/gif": "gif",
  "image/svg+xml": "svg",
};

export function validateImage(file: File): string | null {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) return `${file.name}: use JPG, PNG, WebP, AVIF, GIF or SVG.`;
  if (file.size > MAX_IMAGE_BYTES) return `${file.name} is larger than 10 MB.`;
  return null;
}

/**
 * Uploads straight from the browser to Supabase Storage using the signed-in
 * admin's session. Storage RLS only allows admins to write to the bucket.
 */
export async function uploadImage(file: File, folder: MediaFolder): Promise<string> {
  const invalid = validateImage(file);
  if (invalid) throw new Error(invalid);

  const path = `${folder}/${new Date().getFullYear()}/${crypto.randomUUID()}.${EXT[file.type]}`;
  const storage = getSupabaseBrowserClient().storage.from(MEDIA_BUCKET);
  const { error } = await storage.upload(path, file, {
    cacheControl: "31536000",
    contentType: file.type,
    upsert: false,
  });
  if (error) throw new Error(`Upload failed: ${error.message}`);
  return storage.getPublicUrl(path).data.publicUrl;
}
