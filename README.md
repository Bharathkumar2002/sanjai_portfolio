# Sanjai — Graphic Designer Portfolio

A premium, dark, orange-accented portfolio for a graphic designer, with a protected admin dashboard so every piece of content can be edited without touching code.

**Stack:** Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · Framer Motion · Supabase (Postgres, Auth, Storage) · Vercel

---

## What's inside

**Public site**
- Hero with an automatic orange duotone portrait (any uploaded photo is blended into the gradient), animated headline and an expertise strip.
- Trusted-by client strip (logos or wordmarks; marquee when there are 4+).
- About section with biography, philosophy quote and animated stats.
- Asymmetric featured-projects grid, a filterable `/projects` page and case-study pages at `/projects/[slug]`.
- Interactive services section with deliverables.
- Contact form with validation, honeypot and time-trap spam checks, and database-level duplicate and rate limiting.
- SEO: per-page metadata, Open Graph/Twitter cards, JSON-LD, `sitemap.xml`, `robots.txt`, canonical URLs.
- Accessibility: semantic landmarks, skip link, keyboard-friendly menu (focus handling, Escape to close), labelled forms, and `prefers-reduced-motion` support.

**Admin dashboard (`/admin`)**
- **Overview:** counts and recent messages.
- **Projects:** create, edit and delete; cover and multi-image gallery uploads with alt text, captions and ordering; categories; featured and published toggles; reordering.
- **Services:** create, edit, delete, show/hide, reorder, with image uploads.
- **Clients:** add, edit, delete, show/hide, reorder, with logo uploads.
- **Website content:** hero, about, stats, contact details, social links and SEO.
- **Messages:** read, unread and delete, with an unread filter and pagination.

Public pages are statically generated and cached (ISR, refreshed every 10 minutes). Every dashboard change revalidates them immediately.

---

## Project structure

```
app/
  (site)/                 public pages: home, /projects, /projects/[slug]
  admin/login/            sign-in page
  admin/(dashboard)/      protected dashboard pages
  sitemap.ts, robots.ts, icon.svg, not-found.tsx
components/
  site/                   public UI (Hero, About, ProjectCard, Services, Contact, Footer…)
  admin/                  dashboard UI (forms, tables, uploads, toasts)
  motion/, ui/            animation helpers, icons, buttons
lib/
  data/public.ts          all public reads (anon key, RLS-filtered)
  actions/                server actions (contact form + admin/*)
  admin/                  auth guard, storage helpers, browser upload
  supabase/               server / browser / proxy clients, env
  validation.ts           zod schemas for every form
content/placeholder-content.json   single source for seed data and preview mode
supabase/migrations/      SQL schema, RLS, storage, functions
supabase/seed.sql         generated placeholder content (fictional brands)
scripts/                  seed generator + database security tests
proxy.ts                  session refresh and /admin guard (Next 16's "middleware")
```

---

## 1. Run locally (preview mode)

```bash
npm install
npm run dev
```

Open http://localhost:3000. Without Supabase keys the site runs in **preview mode** with placeholder content (a small badge says so), and `/admin` explains how to connect a database.

---

## 2. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. In **SQL Editor**, run each file in `supabase/migrations/` **in filename order**:
   1. `…100_schema.sql` creates the tables, constraints, indexes and timestamps.
   2. `…200_security.sql` sets up Row Level Security and the contact-form RPC.
   3. `…300_storage.sql` creates the `media` bucket and its policies.
   4. `…400_functions.sql` adds the atomic gallery update.

   If you use the Supabase CLI instead, run `supabase link` then `supabase db push`.
3. *(Optional)* Run `supabase/seed.sql` to load the placeholder portfolio. Every brand in it is fictional; replace them with real work before launch.
4. **Auth → Sign In / Providers → Email:** turn **off** "Allow new users to sign up". New users can't reach the dashboard anyway (they default to the `viewer` role), but there's no reason to allow sign-ups.
5. **Create the first admin.** Go to **Authentication → Users → Add user**, enter an email and a strong password, and tick "Auto confirm". Then run:

   ```sql
   update public.profiles set role = 'admin' where email = 'you@example.com';
   ```
6. Copy `.env.example` to `.env.local` and fill it in. The values are in **Project Settings → API**:

   | Variable | Value |
   |---|---|
   | `NEXT_PUBLIC_SUPABASE_URL` | Project URL |
   | `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Publishable key (`sb_publishable_…`) or the legacy anon key |
   | `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` locally, your domain in production |
   | `CONTACT_HASH_SALT` | Any long random string |

   The **service-role key is never needed.** Don't add it anywhere.
7. Restart `npm run dev` and sign in at `/admin`.

---

## 3. Deploy (GitHub + Vercel)

1. Create an empty GitHub repository, then push:
   ```bash
   git remote add origin https://github.com/<you>/<repo>.git
   git push -u origin main
   ```
2. On [vercel.com](https://vercel.com), choose **Add New → Project** and import the repository. Vercel detects Next.js; keep the defaults.
3. Add the four environment variables from the table above. Set `NEXT_PUBLIC_SITE_URL` to the production URL, e.g. `https://sanjai.design`.
4. Deploy. Every push to `main` redeploys automatically.
5. After adding a custom domain, update `NEXT_PUBLIC_SITE_URL` and redeploy so the sitemap, canonical and Open Graph URLs are correct.

---

## Editing content (for the designer)

- **Headlines:** wrap words in `*asterisks*` to set them in the italic serif accent, and press Enter for a line break. For example, `Creative` + new line + `*Designer*`.
- **Long text:** leave a blank line between paragraphs.
- **Images** upload directly from the dashboard (JPG, PNG, WebP, AVIF, GIF or SVG, up to 10 MB). Replaced or removed images are deleted from storage automatically when you save.
- **Featured projects:** the home page shows up to 5 published projects marked as featured, in display order.
- **Services** feed three places: the hero strip, the services section and the contact form's project-type list.
- **Empty fields are hidden** on the site. For example, an empty phone number won't show.

---

## Security model

- **Row Level Security everywhere.** Visitors can read only published projects, services and clients, plus site settings. Only users whose profile role is `admin` can write anything or read messages. Users can't promote themselves.
- **Contact messages** can only be created through `submit_contact_message()`. It validates input, rejects duplicates (same email and message within 24 h) and rate-limits: 3 per email per hour, 5 per IP per hour, 100 site-wide per hour. Only a salted hash of the IP is stored.
- **Three layers of authorization for admin actions:**
  1. The proxy redirects anonymous visitors.
  2. Every page and server action re-checks the admin role.
  3. RLS enforces the same rules in the database.
- **Validation:** all form input goes through zod (server-side), and image URLs are restricted to Supabase Storage and Unsplash.
- **Headers:** security headers are set in `next.config.ts`, and `/admin` is excluded from search engines.

---

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Development server |
| `npm run build` / `npm start` | Production build and server |
| `npm run lint` / `npm run typecheck` | ESLint and TypeScript checks |
| `npm run test:db` | Runs the real migrations and seed in an in-process Postgres (PGlite) and verifies 50+ RLS, RPC and constraint rules |
| `npm run db:seed` | Regenerates `supabase/seed.sql` from `content/placeholder-content.json` |

---

## Notes

- In `next dev`, images are served unoptimized so local development works on networks where Next's image optimizer refuses the upstream address (for example, NAT64 mobile hotspots). Production builds always optimize images.
- `AGENTS.md` is generated by `next dev` and is safe to keep committed.
