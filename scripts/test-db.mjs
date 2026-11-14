// Runs the real SQL migrations + seed inside PGlite (in-process Postgres) with a
// minimal stub of Supabase's auth/storage schemas and roles, then verifies the
// Row Level Security rules and the contact-form RPC behave as intended.
//
// Usage: npm run test:db
import { PGlite } from "@electric-sql/pglite";
import { readFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const db = await PGlite.create();

const ADMIN = "00000000-0000-0000-0000-00000000000a";
const VIEWER = "00000000-0000-0000-0000-00000000000b";

// ---------------------------------------------------------------- Supabase stub
await db.exec(`
  create role anon nologin;
  create role authenticated nologin;
  create schema auth;
  create table auth.users (id uuid primary key, email text);
  create function auth.uid() returns uuid language sql stable as
    $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
  create schema storage;
  create table storage.buckets (id text primary key, name text, public boolean,
    file_size_limit bigint, allowed_mime_types text[]);
  create table storage.objects (id uuid primary key default gen_random_uuid(),
    bucket_id text references storage.buckets(id), name text, owner uuid);
  alter table storage.objects enable row level security;
  create function storage.foldername(name text) returns text[] language sql immutable as $$
    select (string_to_array(name, '/'))[1:array_length(string_to_array(name, '/'), 1) - 1] $$;
  grant usage on schema public, auth, storage to anon, authenticated;
  grant all on storage.objects to anon, authenticated;
  -- Supabase grants table privileges to anon/authenticated by default; RLS does the rest.
  alter default privileges in schema public grant all on tables to anon, authenticated;
  alter default privileges in schema public grant all on functions to anon, authenticated;
  insert into auth.users values ('${ADMIN}', 'admin@example.com');
`);

// ---------------------------------------------------------------- migrations
const migDir = join(root, "supabase/migrations");
for (const f of readdirSync(migDir).filter((f) => f.endsWith(".sql")).sort()) {
  await db.exec(readFileSync(join(migDir, f), "utf8"));
  console.log(`✓ migration ${f}`);
}
await db.exec(readFileSync(join(root, "supabase/seed.sql"), "utf8"));
await db.exec(readFileSync(join(root, "supabase/seed.sql"), "utf8")); // idempotent
console.log("✓ seed.sql (applied twice)");

// Trigger creates profiles for new users; promote the admin.
await db.exec(`
  insert into auth.users values ('${VIEWER}', 'viewer@example.com');
  update public.profiles set role = 'admin' where id = '${ADMIN}';
`);

// ---------------------------------------------------------------- helpers
let failures = 0;
const pass = (msg) => console.log(`  ✓ ${msg}`);
const fail = (msg) => { failures++; console.error(`  ✗ ${msg}`); };

async function as(role, sub, fn) {
  await db.exec(`set role ${role}; select set_config('request.jwt.claim.sub', '${sub ?? ""}', false);`);
  try { return await fn(); } finally { await db.exec(`reset role; select set_config('request.jwt.claim.sub', '', false);`); }
}
const q = async (sql, params) => (await db.query(sql, params)).rows;
const count = async (sql, params) => Number((await q(sql, params))[0].n);
async function expectOk(msg, fn) { try { await fn(); pass(msg); } catch (e) { fail(`${msg} — ${e.message}`); } }
async function expectError(msg, fn, match) {
  try { await fn(); fail(`${msg} — expected an error`); }
  catch (e) { if (match && !String(e.message).includes(match)) fail(`${msg} — wrong error: ${e.message}`); else pass(msg); }
}
const eq = (msg, a, b) => (a === b ? pass(`${msg} (${a})`) : fail(`${msg}: expected ${b}, got ${a}`));

const submit = (email, message, ip = null) =>
  q(`select public.submit_contact_message($1, $2, $3, $4, $5, $6, $7) as id`,
    ["Ada Visitor", email, "New brand identity", message, "Branding", ip, "test-agent"]);

// ---------------------------------------------------------------- tests
console.log("\nSeed & defaults");
eq("site_settings has exactly one row", await count(`select count(*) n from public.site_settings`), 1);
eq("seeded projects (exactly four samples)", await count(`select count(*) n from public.projects`), 4);
eq("seeded services", await count(`select count(*) n from public.services`), 4);
eq("workplace defaults to Canto", (await q(`select workplace from public.site_settings`))[0].workplace, "Canto");
eq("name is a clear placeholder", (await q(`select designer_name from public.site_settings`))[0].designer_name, "[Your Name]");
eq("mobile is a clear placeholder", (await q(`select contact_phone from public.site_settings`))[0].contact_phone, "[Mobile number]");
eq("résumé metadata seeded", (await q(`select resume_file_name from public.site_settings`))[0].resume_file_name, "resume-placeholder.pdf");
eq("media bucket accepts PDF résumés", (await q(`select 'application/pdf' = any(allowed_mime_types) ok from storage.buckets where id = 'media'`))[0].ok, true);
await expectError("résumé larger than 10 MB is rejected", () => q(`update public.site_settings set resume_size_bytes = 20000000`));
eq("viewer profile auto-created by trigger", await count(`select count(*) n from public.profiles where id = $1 and role = 'viewer'`, [VIEWER]), 1);
await expectError("second site_settings row is rejected", () => q(`insert into public.site_settings (id) values (2)`));
await expectError("invalid slug is rejected", () => q(`insert into public.projects (title, slug, category) values ('X', 'Bad Slug!', 'Branding')`));

await db.exec(`insert into public.project_images (project_id, image_url) select id, '/portfolio/x.webp' from public.projects where slug = 'laptop-concept';
  update public.projects set is_published = false where slug = 'laptop-concept'`);

console.log("\nAnonymous visitor");
await as("anon", null, async () => {
  eq("sees only published projects", await count(`select count(*) n from public.projects`), 3);
  eq("cannot see gallery of unpublished project",
    await count(`select count(*) n from public.project_images pi join public.projects p on p.id = pi.project_id where p.slug = 'laptop-concept'`), 0);
  eq("can read site settings", await count(`select count(*) n from public.site_settings`), 1);
  eq("cannot read contact messages", await count(`select count(*) n from public.contact_messages`), 0);
  eq("cannot read profiles", await count(`select count(*) n from public.profiles`).catch(() => 0), 0);
  await expectError("cannot insert projects", () => q(`insert into public.projects (title, slug, category) values ('Hack', 'hack', 'x')`));
  await expectError("cannot update settings", () => q(`update public.site_settings set brand_name = 'pwned'`));
  await expectError("cannot insert contact messages directly", () =>
    q(`insert into public.contact_messages (name, email, subject, message) values ('Eve', 'e@x.io', 'Hi there', 'direct insert attempt')`));
  await expectError("cannot upload to storage", () => q(`insert into storage.objects (bucket_id, name) values ('media', 'projects/a.png')`));

  await expectOk("can submit a contact message via RPC", () => submit("ada@example.com", "I'd love a new identity for my studio.", "iphash-1"));
  await expectError("duplicate message is rejected", () => submit("ADA@example.com ", "I'd love a new identity for my studio.", "iphash-1"), "duplicate_message");
  await expectOk("second distinct message ok", () => submit("ada@example.com", "Also interested in packaging work.", "iphash-1"));
  await expectOk("third distinct message ok", () => submit("ada@example.com", "And a poster series for our launch.", "iphash-1"));
  await expectError("4th message in an hour from same email is rate limited", () => submit("ada@example.com", "One more message to test limits.", "iphash-2"), "rate_limited");
  await expectOk("other email, same IP ok", () => submit("bob@example.com", "Hello from Bob, need a logo.", "iphash-1"));
  await expectOk("5th from IP ok", () => submit("cy@example.com", "Hello from Cy, need a website.", "iphash-1"));
  await expectError("6th from same IP is rate limited", () => submit("dee@example.com", "Hello from Dee, need packaging.", "iphash-1"), "rate_limited");
  await expectError("invalid email is rejected", () => submit("not-an-email", "A perfectly valid message body."), "invalid_email");
  await expectError("too-short message is rejected", () => submit("eve@example.com", "short"), "invalid_message");
});

console.log("\nSigned-in non-admin");
await as("authenticated", VIEWER, async () => {
  eq("sees only published projects", await count(`select count(*) n from public.projects`), 3);
  eq("cannot read contact messages", await count(`select count(*) n from public.contact_messages`), 0);
  eq("reads only own profile", await count(`select count(*) n from public.profiles`), 1);
  await expectError("cannot insert projects", () => q(`insert into public.projects (title, slug, category) values ('Hack', 'hack', 'x')`));
  eq("cannot promote self to admin (0 rows updated)",
    (await db.query(`update public.profiles set role = 'admin' where id = $1`, [VIEWER])).affectedRows ?? 0, 0);
  eq("cannot update settings (0 rows updated)", (await db.query(`update public.site_settings set brand_name = 'pwned'`)).affectedRows ?? 0, 0);
  eq("cannot delete projects (0 rows deleted)", (await db.query(`delete from public.projects`)).affectedRows ?? 0, 0);
  await expectError("cannot upload to storage", () => q(`insert into storage.objects (bucket_id, name) values ('media', 'projects/a.png')`));
  await expectError("cannot insert contact messages directly", () =>
    q(`insert into public.contact_messages (name, email, subject, message) values ('Eve', 'e@x.io', 'Hi there', 'direct insert attempt')`));
  await expectError("cannot replace a gallery", () =>
    q(`select public.replace_project_images((select id from public.projects where slug = 'kova-glide-low'), '[]'::jsonb)`), "forbidden");
});
await as("anon", null, async () => {
  await expectError("anon cannot call replace_project_images", () =>
    q(`select public.replace_project_images((select id from public.projects where slug = 'kova-glide-low'), '[]'::jsonb)`));
});
eq("viewer is still a viewer", (await q(`select role from public.profiles where id = $1`, [VIEWER]))[0].role, "viewer");

console.log("\nAdmin");
await as("authenticated", ADMIN, async () => {
  eq("sees all projects incl. unpublished", await count(`select count(*) n from public.projects`), 4);
  eq("reads contact messages", await count(`select count(*) n from public.contact_messages`), 5);
  await expectOk("creates a project", () => q(`insert into public.projects (title, slug, category, is_published) values ('New', 'new-project', 'Branding', false)`));
  await expectOk("adds gallery images", () => q(`insert into public.project_images (project_id, image_url) select id, 'https://x.supabase.co/a.png' from public.projects where slug = 'new-project'`));
  await expectOk("replaces a gallery atomically, preserving order", () =>
    q(`select public.replace_project_images((select id from public.projects where slug = 'new-project'),
       '[{"image_url":"https://x.supabase.co/b.png","alt_text":"B"},{"image_url":"https://x.supabase.co/c.png","caption":"C"}]'::jsonb)`));
  eq("gallery now has the two new images in order",
    (await q(`select string_agg(pi.alt_text || ':' || pi.display_order, ',' order by pi.display_order) s from public.project_images pi join public.projects p on p.id = pi.project_id where p.slug = 'new-project'`))[0].s,
    "B:1,:2");
  await expectError("a bad image row rolls back the whole replacement", () =>
    q(`select public.replace_project_images((select id from public.projects where slug = 'new-project'), '[{"image_url":"https://x/ok.png"},{"alt_text":"missing url"}]'::jsonb)`));
  eq("gallery unchanged after failed replacement",
    await count(`select count(*) n from public.project_images pi join public.projects p on p.id = pi.project_id where p.slug = 'new-project'`), 2);
  await expectOk("updates settings", () => q(`update public.site_settings set brand_name = 'Studio'`));
  await expectOk("marks a message read", () => q(`update public.contact_messages set is_read = true where email = 'bob@example.com'`));
  await expectOk("uploads a résumé to the resume folder", () => q(`insert into storage.objects (bucket_id, name) values ('media', 'resume/2026/cv.pdf')`));
  await expectOk("updates workplace and mobile", () => q(`update public.site_settings set workplace = 'Canto', contact_phone = '+91 90000 00000'`));
  await expectOk("uploads to an allowed folder", () => q(`insert into storage.objects (bucket_id, name) values ('media', 'projects/2026/a.png')`));
  await expectError("cannot upload outside allowed folders", () => q(`insert into storage.objects (bucket_id, name) values ('media', 'other/a.png')`));
  await expectOk("deletes a project (cascades images)", () => q(`delete from public.projects where slug = 'new-project'`));
  eq("cascade removed images", await count(`select count(*) n from public.project_images pi where not exists (select 1 from public.projects p where p.id = pi.project_id)`), 0);
  await expectOk("deletes a message", () => q(`delete from public.contact_messages where email = 'cy@example.com'`));
});
eq("settings update persisted", (await q(`select brand_name from public.site_settings`))[0].brand_name, "Studio");
const before = (await q(`select updated_at from public.projects where slug = 'kova-glide-low'`))[0].updated_at;
await new Promise((r) => setTimeout(r, 20));
await db.exec(`update public.projects set title = 'Kova Glide Low' where slug = 'kova-glide-low'`);
const after = (await q(`select updated_at from public.projects where slug = 'kova-glide-low'`))[0].updated_at;
after > before ? pass("updated_at trigger bumps timestamp") : fail("updated_at trigger did not bump timestamp");

console.log(failures ? `\n${failures} check(s) FAILED` : "\nAll database checks passed");
process.exit(failures ? 1 : 0);
