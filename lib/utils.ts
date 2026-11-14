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

/** Bundled starter files in /public/portfolio (replaceable from the dashboard). */
const BUNDLED_PREFIX = "/portfolio/";

/**
 * Media (images and the résumé) must be either a bundled starter file or a file
 * in our Supabase Storage bucket. Matches next.config images.remotePatterns.
 */
export function isAllowedMediaUrl(url: string): boolean {
  if (url.startsWith(BUNDLED_PREFIX) && !url.includes("..")) return true;
  try {
    const u = new URL(url);
    if (u.protocol !== "https:" && !(u.protocol === "http:" && u.hostname === "127.0.0.1")) return false;
    if (storagePathFromUrl(url)) return true;
    return u.hostname.endsWith(".supabase.co") && u.pathname.startsWith("/storage/v1/object/public/");
  } catch {
    return false;
  }
}

export function isPdfUrl(url: string) {
  return /\.pdf($|\?)/i.test(url);
}

/**
 * Link that downloads the résumé. Storage is on another origin, where the HTML
 * `download` attribute is ignored, so Supabase's `?download=` parameter is used.
 */
export function resumeDownloadHref(url: string, fileName: string | null) {
  if (url.startsWith("/")) return url;
  const sep = url.includes("?") ? "&" : "?";
  return `${url}${sep}download=${encodeURIComponent(fileName || "resume.pdf")}`;
}

export function formatBytes(bytes: number | null | undefined) {
  if (!bytes) return "";
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/** tel: href for a phone number, or null when it's empty or still a placeholder. */
export function telHref(phone: string | null | undefined) {
  const digits = (phone ?? "").replace(/[^+\d]/g, "");
  return digits.replace(/\D/g, "").length >= 6 ? `tel:${digits}` : null;
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
