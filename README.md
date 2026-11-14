# Graphic Designer Portfolio

A dark, minimal portfolio with a protected dashboard, so the profile, images, portfolio samples and résumé can be updated without touching code.

**Stack:** Next.js 16 · TypeScript · Tailwind CSS v4 · Framer Motion · Supabase (Postgres, Auth, Storage) · Vercel

## Still needed from you

| Item | Where it goes | Until then the site shows |
|---|---|---|
| Your friend's **name** | Dashboard → Profile & résumé → Name | `[Your Name]` |
| **Mobile number** (with country code) | Dashboard → Profile & résumé → Mobile number | `[Mobile number]` (not a tap-to-call link) |
| **Résumé (PDF)** | Dashboard → Profile & résumé → Résumé | A labelled placeholder PDF |
| **Headset** and **laptop** artwork | Dashboard → Portfolio → Headset / Laptop concept → Main artwork | Placeholder posters marked "PLACEHOLDER" |
| Real **email** and social links (optional) | Dashboard → Profile & résumé | `hello@example.com`, no social links |
| Supabase and Vercel accounts | Steps 2–4 below | Preview mode with starter content |

The workplace starts as **Canto**. The shoe (Kova) and watch (Orbit) posters are original designs for fictional brands, drawn from the supplied references; no brand logos or source photos are reused.

---

## 1. Run locally

```bash
npm install
npm run dev        # http://localhost:3000
```

Without Supabase keys the public site runs in **preview mode** with the starter content from `content/placeholder-content.json` and `public/portfolio/`. `/admin` shows a setup message.

## 2. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. Open **SQL Editor** and run each file in `supabase/migrations/` **in filename order**, then `supabase/seed.sql`. This creates the tables, the access rules, the `media` storage bucket (images + PDF résumés, 10 MB max) and the starter content.
3. **Authentication → Sign In / Providers → Email:** turn off **Allow new users to sign up**.
4. **Authentication → Users → Add user:** create the admin with email and password, and tick *Auto confirm*. Then run in the SQL Editor:
   ```sql
   update public.profiles set role = 'admin' where email = 'admin@example.com';
   ```
5. Copy `.env.example` to `.env.local` and fill it in (values from **Project Settings → API**):

   | Variable | Value |
   |---|---|
   | `NEXT_PUBLIC_SUPABASE_URL` | Project URL |
   | `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Publishable key (`sb_publishable_…`) or legacy anon key |
   | `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` locally, the live URL on Vercel |
   | `CONTACT_HASH_SALT` | Any long random string |

   Never add the **service-role** key; the app doesn't use it.
6. Restart `npm run dev` and sign in at **/admin**.

## 3. Move the starter files into Supabase Storage (recommended)

The seed points images and the résumé at bundled files in `public/portfolio/`. This one-off command uploads them to the Storage bucket and updates the database, signing in as your admin user. It's safe to re-run.

```powershell
# PowerShell
$env:ADMIN_EMAIL="admin@example.com"; $env:ADMIN_PASSWORD="your-password"; npm run assets:upload
```
```bash
# macOS / Linux
ADMIN_EMAIL=admin@example.com ADMIN_PASSWORD=your-password npm run assets:upload
```

Anything you upload or replace from the dashboard goes straight to Storage, and replaced files are deleted automatically.

## 4. Deploy on Vercel

1. Push the repository to GitHub:
   ```bash
   git remote add origin https://github.com/<you>/<repo>.git
   git push -u origin main
   ```
2. At [vercel.com/new](https://vercel.com/new), import the repository and keep the detected Next.js settings.
3. Under **Environment Variables**, add the four variables from step 2.5. Set `NEXT_PUBLIC_SITE_URL` to the production URL.
4. Click **Deploy**. Later pushes to `main` redeploy automatically. If you add a custom domain, update `NEXT_PUBLIC_SITE_URL` and redeploy.

---

## Using the dashboard

- **Profile & résumé:**
  - Details: name, role, workplace, mobile, email, location and availability.
  - Résumé: upload, replace or remove the PDF.
  - Banner: the front photo, the background artwork and the headline.
  - Also: the contact photo, about text, social links and search/share settings.
- **Portfolio:** replace each sample's artwork, edit its story, publish or hide it, and reorder.
- **Messages:** enquiries from the contact form.
- **Services** and **Clients:** the "What I do" cards and the optional logo strip, which stays hidden while there are no clients.

Tips:
- Wrap words in `*asterisks*` in a headline to colour them.
- Leave a blank line between paragraphs.
- A transparent-background PNG/WebP works best for the banner photo.

## Security

- Row Level Security on every table. Visitors can read only published content. Only users whose profile role is `admin` can change content, read messages or upload files.
- The contact form goes through a database function that validates input and rate-limits submissions.
- The proxy, every dashboard page and every server action check for an admin. RLS enforces the same rules again in the database.

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` / `build` / `start` | Develop, build, serve |
| `npm run typecheck` / `lint` | TypeScript and ESLint |
| `npm run test:db` | Runs all migrations and the seed in an in-process Postgres and checks the access rules |
| `npm run db:seed` | Regenerates `supabase/seed.sql` from `content/placeholder-content.json` |
| `npm run assets:upload` | Moves starter files into Supabase Storage (step 3) |
