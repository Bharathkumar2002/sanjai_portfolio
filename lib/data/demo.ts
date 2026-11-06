import "server-only";
import content from "@/content/placeholder-content.json";
import type { Client, ProjectWithImages, Service, SiteSettings } from "@/lib/types";
import { defaultSettings } from "./defaults";

/**
 * Preview-mode data, used ONLY when Supabase environment variables are missing.
 * It is built from the same JSON file that generates supabase/seed.sql, so the
 * preview matches what a freshly seeded database shows.
 */
const stamp = "2026-01-01T00:00:00.000Z";

export const demoSettings: SiteSettings = { ...defaultSettings, ...(content.settings as Partial<SiteSettings>) };

export const demoServices: Service[] = content.services.map((s, i) => ({
  ...s,
  id: `demo-service-${i + 1}`,
  is_published: true,
  display_order: i + 1,
  created_at: stamp,
  updated_at: stamp,
}));

export const demoClients: Client[] = content.clients.map((c, i) => ({
  ...c,
  id: `demo-client-${i + 1}`,
  is_published: true,
  display_order: i + 1,
  created_at: stamp,
  updated_at: stamp,
}));

export const demoProjects: ProjectWithImages[] = content.projects.map((p, i) => {
  const id = `demo-project-${i + 1}`;
  const { images, ...rest } = p;
  return {
    ...rest,
    id,
    is_published: true,
    display_order: i + 1,
    created_at: stamp,
    updated_at: stamp,
    project_images: images.map((img, j) => ({
      id: `${id}-img-${j + 1}`,
      project_id: id,
      image_url: img.image_url,
      alt_text: img.alt_text,
      caption: null,
      display_order: j + 1,
    })),
  };
});
