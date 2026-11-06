import "server-only";
import { cache } from "react";
import { createSupabasePublicClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import type { Client, ProjectSummary, ProjectWithImages, Service, SiteSettings } from "@/lib/types";
import { defaultSettings } from "./defaults";
import { demoClients, demoProjects, demoServices, demoSettings } from "./demo";

/*
 * Public read layer. Every function:
 *  - reads through the anon client, so RLS guarantees only published content is returned;
 *  - is wrapped in React cache() to dedupe calls within one render (metadata + page);
 *  - throws on database errors. With ISR, a failed revalidation keeps serving the last
 *    good page instead of caching an empty one; on a cold render the error boundary shows.
 */

const SUMMARY_COLUMNS = "id, title, slug, category, short_description, cover_image, project_year, is_featured";

function fail(context: string, error: { message: string }): never {
  console.error(`[data] ${context}:`, error.message);
  throw new Error(`Could not load ${context}`);
}

export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
  if (!isSupabaseConfigured) return demoSettings;
  const { data, error } = await createSupabasePublicClient()
    .from("site_settings")
    .select("*")
    .eq("id", 1)
    .maybeSingle();
  if (error) fail("site settings", error);
  return { ...defaultSettings, ...(data ?? {}) };
});

export const getServices = cache(async (): Promise<Service[]> => {
  if (!isSupabaseConfigured) return demoServices;
  const { data, error } = await createSupabasePublicClient()
    .from("services")
    .select("*")
    .eq("is_published", true)
    .order("display_order")
    .order("created_at");
  if (error) fail("services", error);
  return data ?? [];
});

export const getClients = cache(async (): Promise<Client[]> => {
  if (!isSupabaseConfigured) return demoClients;
  const { data, error } = await createSupabasePublicClient()
    .from("clients")
    .select("*")
    .eq("is_published", true)
    .order("display_order")
    .order("created_at");
  if (error) fail("clients", error);
  return data ?? [];
});

export const getFeaturedProjects = cache(async (limit = 5): Promise<ProjectSummary[]> => {
  if (!isSupabaseConfigured) return demoProjects.filter((p) => p.is_featured).slice(0, limit);
  const { data, error } = await createSupabasePublicClient()
    .from("projects")
    .select(SUMMARY_COLUMNS)
    .eq("is_published", true)
    .eq("is_featured", true)
    .order("display_order")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) fail("featured projects", error);
  return data ?? [];
});

export const getPublishedProjects = cache(async (): Promise<ProjectSummary[]> => {
  if (!isSupabaseConfigured) return demoProjects;
  const { data, error } = await createSupabasePublicClient()
    .from("projects")
    .select(SUMMARY_COLUMNS)
    .eq("is_published", true)
    .order("display_order")
    .order("created_at", { ascending: false });
  if (error) fail("projects", error);
  return data ?? [];
});

export const getProjectBySlug = cache(async (slug: string): Promise<ProjectWithImages | null> => {
  if (!isSupabaseConfigured) return demoProjects.find((p) => p.slug === slug) ?? null;
  const { data, error } = await createSupabasePublicClient()
    .from("projects")
    .select("*, project_images(*)")
    .eq("slug", slug)
    .eq("is_published", true)
    .order("display_order", { referencedTable: "project_images" })
    .maybeSingle();
  if (error) fail(`project "${slug}"`, error);
  return data;
});

/** Slugs + timestamps for generateStaticParams and the sitemap. */
export const getProjectSlugs = cache(async (): Promise<{ slug: string; updated_at: string }[]> => {
  if (!isSupabaseConfigured) return demoProjects.map(({ slug, updated_at }) => ({ slug, updated_at }));
  const { data, error } = await createSupabasePublicClient()
    .from("projects")
    .select("slug, updated_at")
    .eq("is_published", true);
  if (error) fail("project slugs", error);
  return data ?? [];
});
