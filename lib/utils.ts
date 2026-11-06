import { MEDIA_BUCKET, supabaseUrl } from "@/lib/supabase/env";

/** Joins class names, skipping falsy values. */
export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

/** Splits multi-paragraph text (blank-line separated) into paragraphs. */
export function paragraphs(text: string | null | undefined): string[] {
  return (text ?? "")
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}

export function slugify(input: string): string {
  return input
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120)
    .replace(/-+$/g, "");
}

/** Removes the emphasis markers used in headlines ("Creative *Designer*"). */
export function plainText(markup: string): string {
  return markup.replace(/\*/g, "").replace(/\s+/g, " ").trim();
}

const STORAGE_PUBLIC_PREFIX = `/storage/v1/object/public/${MEDIA_BUCKET}/`;

/** Returns the storage object path for a URL in our media bucket, or null for external URLs. */
export function storagePathFromUrl(url: string | null | undefined): string | null {
  if (!url || !supabaseUrl) return null;
  try {
    const u = new URL(url);
    const base = new URL(supabaseUrl);
    if (u.host !== base.host || !u.pathname.startsWith(STORAGE_PUBLIC_PREFIX)) return null;
    return decodeURIComponent(u.pathname.slice(STORAGE_PUBLIC_PREFIX.length));
  } catch {
    return null;
  }
}

/** Images must come from our Supabase storage or Unsplash (matches next.config images.remotePatterns). */
export function isAllowedImageUrl(url: string): boolean {
  try {
    const u = new URL(url);
    if (u.protocol !== "https:" && !(u.protocol === "http:" && u.hostname === "127.0.0.1")) return false;
    if (u.hostname === "images.unsplash.com") return true;
    if (storagePathFromUrl(url)) return true;
    return u.hostname.endsWith(".supabase.co") && u.pathname.startsWith("/storage/v1/object/public/");
  } catch {
    return false;
  }
}

export function isSvg(url: string | null | undefined) {
  return Boolean(url && /\.svg($|\?)/i.test(url));
}

export function formatDate(iso: string, opts: Intl.DateTimeFormatOptions = { dateStyle: "medium" }) {
  return new Intl.DateTimeFormat("en-GB", opts).format(new Date(iso));
}

export function pad2(n: number) {
  return String(n).padStart(2, "0");
}
