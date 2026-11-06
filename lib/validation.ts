import { z } from "zod";
import { isAllowedImageUrl, slugify } from "@/lib/utils";

/* ------------------------------------------------------------------ primitives */

/** Trimmed text, control characters stripped (keeps newlines and tabs). */
const text = (max: number) =>
  z
    .string()
    .transform((v) => v.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").trim())
    .pipe(z.string().max(max, `Must be ${max} characters or fewer`));

const requiredText = (label: string, min: number, max: number) =>
  text(max).pipe(z.string().min(min, min <= 1 ? `${label} is required` : `${label} must be at least ${min} characters`));

/** Empty string → null. */
const nullableText = (max: number) => text(max).transform((v) => (v === "" ? null : v));

const checkbox = z.preprocess((v) => v === "on" || v === "true" || v === true, z.boolean());

const optionalInt = (min: number, max: number) =>
  z.preprocess(
    (v) => (v === "" || v === null || v === undefined ? null : Number(v)),
    z.number().int("Must be a whole number").min(min).max(max).nullable(),
  );

const order = z.preprocess(
  (v) => (v === "" || v === null || v === undefined ? 0 : Number(v)),
  z.number().int().min(-100000).max(100000),
);

const imageUrl = z
  .string()
  .trim()
  .max(2048)
  .transform((v) => (v === "" ? null : v))
  .refine((v) => v === null || isAllowedImageUrl(v), "Upload the image instead of linking to another site");

const webUrl = z
  .string()
  .trim()
  .max(2048)
  .refine((v) => v === "" || /^https?:\/\/[^\s]+\.[^\s]+$/i.test(v), "Enter a full URL starting with https://");

/* ------------------------------------------------------------------ contact */

export const contactSchema = z.object({
  name: requiredText("Name", 2, 120),
  email: z.string().trim().toLowerCase().max(254).pipe(z.email("Enter a valid email address")),
  subject: requiredText("Subject", 2, 160),
  project_type: text(80),
  message: requiredText("Message", 10, 5000),
});

export type ContactInput = z.infer<typeof contactSchema>;

/* ------------------------------------------------------------------ projects */

export const galleryItemSchema = z.object({
  image_url: imageUrl.refine((v) => v !== null, "Image is required"),
  alt_text: text(300).default(""),
  caption: nullableText(300).default(null),
});

export const projectSchema = z
  .object({
    title: requiredText("Title", 1, 160),
    slug: text(120),
    category: requiredText("Category", 1, 60),
    short_description: text(320),
    description: text(10000),
    cover_image: imageUrl,
    client_name: nullableText(120),
    project_year: optionalInt(1950, 2100),
    design_process: text(10000),
    challenges: text(10000),
    outcome: text(10000),
    is_featured: checkbox,
    is_published: checkbox,
    display_order: order,
    gallery: z
      .string()
      .default("[]")
      .transform((v, ctx) => {
        try {
          return JSON.parse(v) as unknown;
        } catch {
          ctx.addIssue({ code: "custom", message: "Gallery data is invalid" });
          return z.NEVER;
        }
      })
      .pipe(z.array(galleryItemSchema).max(40, "A project can have up to 40 gallery images")),
  })
  .transform((p) => ({ ...p, slug: slugify(p.slug || p.title) }))
  .refine((p) => p.slug.length > 0, { path: ["slug"], message: "Slug must contain letters or numbers" });

export type ProjectInput = z.infer<typeof projectSchema>;

/* ------------------------------------------------------------------ services */

export const serviceSchema = z.object({
  title: requiredText("Title", 1, 120),
  short_description: text(200),
  description: text(4000),
  image_url: imageUrl,
  deliverables: text(2000).transform((v) =>
    v
      .split(/\r?\n|,/)
      .map((d) => d.trim())
      .filter(Boolean)
      .slice(0, 20)
      .map((d) => d.slice(0, 80)),
  ),
  is_published: checkbox,
  display_order: order,
});

/* ------------------------------------------------------------------ clients */

export const clientSchema = z.object({
  name: requiredText("Name", 1, 120),
  logo_url: imageUrl,
  website_url: webUrl.transform((v) => (v === "" ? null : v)),
  is_published: checkbox,
  display_order: order,
});

/* ------------------------------------------------------------------ settings */

export const settingsSchema = z.object({
  brand_name: requiredText("Brand name", 1, 60),
  designer_name: requiredText("Designer name", 1, 80),
  role_title: text(80),
  hero_greeting: text(80),
  hero_headline: requiredText("Hero headline", 1, 120),
  hero_tagline: text(160),
  hero_intro: text(600),
  hero_image: imageUrl,
  about_eyebrow: text(80),
  about_headline: requiredText("About headline", 1, 200),
  about_intro: text(1500),
  about_bio: text(4000),
  about_philosophy: text(2000),
  about_experience: text(2000),
  about_image: imageUrl,
  years_experience: optionalInt(0, 80),
  projects_completed: optionalInt(0, 100000),
  clients_served: optionalInt(0, 100000),
  availability: text(120),
  contact_email: z
    .string()
    .trim()
    .max(254)
    .refine((v) => v === "" || z.email().safeParse(v).success, "Enter a valid email address"),
  contact_phone: text(40),
  location: text(120),
  instagram_url: webUrl,
  behance_url: webUrl,
  linkedin_url: webUrl,
  dribbble_url: webUrl,
  x_url: webUrl,
  seo_title: text(120),
  seo_description: text(320),
  og_image: imageUrl,
});

/* ------------------------------------------------------------------ helpers */

/** Converts FormData into a plain object; repeated keys keep the last value. */
export function formDataToObject(formData: FormData): Record<string, string> {
  const out: Record<string, string> = {};
  formData.forEach((value, key) => {
    if (typeof value === "string" && !key.startsWith("$ACTION")) out[key] = value;
  });
  return out;
}

export function fieldErrors(error: z.ZodError) {
  return z.flattenError(error).fieldErrors as Record<string, string[] | undefined>;
}
