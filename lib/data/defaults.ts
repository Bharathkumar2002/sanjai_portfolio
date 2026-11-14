import type { SiteSettings } from "@/lib/types";

/** Mirrors the column defaults of public.site_settings. Used if the row cannot be read. */
export const defaultSettings: SiteSettings = {
  brand_name: "[Your Name]",
  designer_name: "[Your Name]",
  role_title: "Graphic Designer",
  workplace: "Canto",
  hero_greeting: "Hi, I'm",
  hero_headline: "Designing bold visuals that *people remember.*",
  hero_tagline: "",
  hero_intro: "I help brands look as good as they are — through posters, campaigns and visual identity.",
  hero_image: null,
  hero_background_image: null,
  contact_image: null,
  resume_url: null,
  resume_file_name: null,
  resume_size_bytes: null,
  resume_updated_at: null,
  about_eyebrow: "About",
  about_headline: "Creating visuals that make brands stand out",
  about_intro: "",
  about_bio: "",
  about_philosophy: "",
  about_experience: "",
  about_image: null,
  years_experience: null,
  projects_completed: null,
  clients_served: null,
  availability: "",
  contact_email: "",
  contact_phone: "",
  location: "",
  instagram_url: "",
  behance_url: "",
  linkedin_url: "",
  dribbble_url: "",
  x_url: "",
  seo_title: "Graphic Designer Portfolio",
  seo_description: "Graphic design portfolio.",
  og_image: null,
};

export const PROJECT_CATEGORIES = [
  "Footwear campaign",
  "Smartwatch launch",
  "Audio product",
  "Tech product",
  "Product poster",
  "Brand identity",
  "Social media",
  "Packaging",
] as const;

/** A value still in [brackets] is an unfilled placeholder. */
export function isPlaceholder(value: string | null | undefined) {
  return !value || /^\[.*\]$/.test(value.trim());
}
