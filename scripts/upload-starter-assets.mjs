// Moves the bundled starter files (public/portfolio/*) into Supabase Storage and
// points the database at them. Signs in as your admin user — no service-role key.
// Safe to run more than once: only values that still point at /portfolio/ are migrated.
//
//   PowerShell:  $env:ADMIN_EMAIL="you@example.com"; $env:ADMIN_PASSWORD="..."; npm run assets:upload
//   macOS/Linux: ADMIN_EMAIL=you@example.com ADMIN_PASSWORD=... npm run assets:upload
import { readFile } from "node:fs/promises";
import { basename, join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const { ADMIN_EMAIL: email, ADMIN_PASSWORD: password } = process.env;

if (!url || !key) fail("Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY in .env.local first.");
if (!email || !password) fail("Set ADMIN_EMAIL and ADMIN_PASSWORD for your admin user (see the comment at the top of this file).");

const TYPES = { ".webp": "image/webp", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".pdf": "application/pdf" };
const BUCKET = "media";
const supabase = createClient(url, key, { auth: { persistSession: false } });

const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
if (authError) fail(`Sign-in failed: ${authError.message}`);

/** Uploads /portfolio/<file> to <folder>/starter/<file> and returns its public URL. */
async function upload(localPath, folder) {
  const name = basename(localPath);
  const ext = name.slice(name.lastIndexOf(".")).toLowerCase();
  const body = await readFile(join(root, "public", localPath));
  const path = `${folder}/starter/${name}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, body, { contentType: TYPES[ext], upsert: true, cacheControl: "3600" });
  if (error) fail(`Upload of ${name} failed: ${error.message}`);
  console.log(`  ↑ ${localPath} → ${BUCKET}/${path}`);
  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
}
const isLocal = (v) => typeof v === "string" && v.startsWith("/portfolio/");

// Site settings: photos, artwork, share image and résumé
const { data: settings, error: sErr } = await supabase.from("site_settings").select("*").eq("id", 1).single();
if (sErr) fail(`Could not read site settings: ${sErr.message}`);
const patch = {};
for (const [field, folder] of [["hero_image", "site"], ["hero_background_image", "site"], ["contact_image", "site"], ["og_image", "site"], ["resume_url", "resume"]]) {
  if (isLocal(settings[field])) patch[field] = await upload(settings[field], folder);
}
if (Object.keys(patch).length) {
  const { error } = await supabase.from("site_settings").update(patch).eq("id", 1);
  if (error) fail(`Could not update site settings: ${error.message}`);
}

// Portfolio samples
const { data: projects, error: pErr } = await supabase.from("projects").select("id, title, cover_image");
if (pErr) fail(`Could not read projects: ${pErr.message}`);
for (const p of projects) {
  if (!isLocal(p.cover_image)) continue;
  const cover = await upload(p.cover_image, "projects");
  const { error } = await supabase.from("projects").update({ cover_image: cover }).eq("id", p.id);
  if (error) fail(`Could not update ${p.title}: ${error.message}`);
}

await supabase.auth.signOut();
console.log("\nDone. Starter images and the résumé now live in Supabase Storage.");

function fail(message) {
  console.error(`✗ ${message}`);
  process.exit(1);
}
