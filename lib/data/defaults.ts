import type { SiteSettings } from "@/lib/types";

/** Mirrors the column defaults of public.site_settings. Used if the row cannot be read. */
export const defaultSettings: SiteSettings = {
  brand_name: "Your Name",
  designer_name: "Your Name",
  role_title: "Graphic Designer",
  hero_greeting: "Hey, I'm a",
  hero_headline: "Creative\n*Designer*",
  hero_tagline: "Great design should feel effortless.",
  hero_intro:
    "I help ambitious brands look as good as they are — through identity, packaging and visual storytelling.",
  hero_image: null,
  about_eyebrow: "Behind the Designs",
  about_headline: "Creating Visual Experiences That Make Brands Stand Out",
  about_intro: "",
  about_bio: "",
  about_philosophy: "",
  about_experience: "",
  about_image: null,
  years_experience: null,
  projects_completed: null,
  clients_served: null,
  availability: "Available for new projects",
  contact_email: "",
  contact_phone: "",
  location: "",
  instagram_url: "",
  behance_url: "",
  linkedin_url: "",
  dribbble_url: "",
  x_url: "",
  seo_title: "Graphic Designer Portfolio",
  seo_description: "Brand identity, packaging and visual design portfolio.",
  og_image: null,
};

export const PROJECT_CATEGORIES = [
  "Branding",
  "Logo Design",
  "Packaging",
  "Social Media Design",
  "Poster Design",
  "Illustration",
  "UI/UX Design",
] as const;
