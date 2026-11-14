// Generates supabase/seed.sql from content/placeholder-content.json.
// Usage: npm run db:seed
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const content = JSON.parse(readFileSync(join(root, "content/placeholder-content.json"), "utf8"));

const lit = (v) => {
  if (v === null || v === undefined) return "null";
  if (typeof v === "number") return String(v);
  if (typeof v === "boolean") return v ? "true" : "false";
  if (Array.isArray(v)) return v.length ? `array[${v.map(lit).join(", ")}]::text[]` : "'{}'::text[]";
  return `'${String(v).replace(/'/g, "''")}'`;
};

const out = [];
out.push(`-- =============================================================================
-- Placeholder seed content (fictional brands). GENERATED FILE — do not edit.
-- Source: content/placeholder-content.json  ·  Regenerate: npm run db:seed
-- Safe to run more than once: existing rows are left untouched.
-- =============================================================================
`);

// Settings
const s = content.settings;
const cols = Object.keys(s);
out.push(`update public.site_settings set\n${cols.map((c) => `  ${c} = ${lit(s[c])}`).join(",\n")}\nwhere id = 1;\n`);

// Services
if (content.services.length) out.push(`insert into public.services (title, short_description, description, image_url, deliverables, display_order)
select * from (values
${content.services
  .map((v, i) => `  (${lit(v.title)}, ${lit(v.short_description)}, ${lit(v.description)}, ${lit(v.image_url)}, ${lit(v.deliverables)}, ${i + 1})`)
  .join(",\n")}
) as v(title, short_description, description, image_url, deliverables, display_order)
where not exists (select 1 from public.services);
`);

// Clients
if (content.clients.length) out.push(`insert into public.clients (name, logo_url, website_url, display_order)
select * from (values
${content.clients.map((v, i) => `  (${lit(v.name)}, ${lit(v.logo_url)}::text, ${lit(v.website_url)}::text, ${i + 1})`).join(",\n")}
) as v(name, logo_url, website_url, display_order)
where not exists (select 1 from public.clients);
`);

// Projects + gallery
content.projects.forEach((p, i) => {
  out.push(`insert into public.projects (title, slug, category, short_description, description, cover_image, client_name, project_year, design_process, challenges, outcome, is_featured, is_published, display_order)
values (${[
    p.title, p.slug, p.category, p.short_description, p.description, p.cover_image, p.client_name,
    p.project_year, p.design_process, p.challenges, p.outcome, p.is_featured, true, i + 1,
  ].map(lit).join(", ")})
on conflict (slug) do nothing;
`);
  if (p.images?.length) {
    out.push(`insert into public.project_images (project_id, image_url, alt_text, display_order)
select p.id, v.image_url, v.alt_text, v.display_order
from public.projects p
cross join (values
${p.images.map((img, j) => `  (${lit(img.image_url)}, ${lit(img.alt_text)}, ${j + 1})`).join(",\n")}
) as v(image_url, alt_text, display_order)
where p.slug = ${lit(p.slug)}
  and not exists (select 1 from public.project_images pi where pi.project_id = p.id);
`);
  }
});

writeFileSync(join(root, "supabase/seed.sql"), out.join("\n"));
console.log("Wrote supabase/seed.sql");
