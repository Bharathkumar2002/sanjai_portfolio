// Row shapes mirror supabase/migrations/*.sql

export type SiteSettings = {
  brand_name: string;
  designer_name: string;
  role_title: string;
  /** Current workplace, e.g. "Canto". */
  workplace: string;
  hero_greeting: string;
  hero_headline: string;
  hero_tagline: string;
  hero_intro: string;
  /** Front photo in the banner. */
  hero_image: string | null;
  /** Low-opacity artwork layered behind the banner photo. */
  hero_background_image: string | null;
  /** Photo for the contact section; falls back to hero_image. */
  contact_image: string | null;
  resume_url: string | null;
  resume_file_name: string | null;
  resume_size_bytes: number | null;
  resume_updated_at: string | null;
  about_eyebrow: string;
  about_headline: string;
  about_intro: string;
  about_bio: string;
  about_philosophy: string;
  about_experience: string;
  about_image: string | null;
  years_experience: number | null;
  projects_completed: number | null;
  clients_served: number | null;
  availability: string;
  contact_email: string;
  /** Mobile number. */
  contact_phone: string;
  location: string;
  instagram_url: string;
  behance_url: string;
  linkedin_url: string;
  dribbble_url: string;
  x_url: string;
  seo_title: string;
  seo_description: string;
  og_image: string | null;
  updated_at?: string;
};

export type ProjectImage = {
  id: string;
  project_id: string;
  image_url: string;
  alt_text: string;
  caption: string | null;
  display_order: number;
};

export type Project = {
  id: string;
  title: string;
  slug: string;
  category: string;
  short_description: string;
  description: string;
  cover_image: string | null;
  client_name: string | null;
  project_year: number | null;
  design_process: string;
  challenges: string;
  outcome: string;
  is_featured: boolean;
  is_published: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
};

export type ProjectWithImages = Project & { project_images: ProjectImage[] };

/** Fields needed to render a project card. */
export type ProjectSummary = Pick<
  Project,
  "id" | "title" | "slug" | "category" | "short_description" | "cover_image" | "project_year" | "is_featured"
>;

export type Service = {
  id: string;
  title: string;
  short_description: string;
  description: string;
  image_url: string | null;
  deliverables: string[];
  is_published: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
};

export type Client = {
  id: string;
  name: string;
  logo_url: string | null;
  website_url: string | null;
  is_published: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
};

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  subject: string;
  project_type: string | null;
  message: string;
  is_read: boolean;
  created_at: string;
};

/** Standard return shape for form server actions used with useActionState. */
export type ActionState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Record<string, string[] | undefined>;
  /** Submitted values, echoed back on error so React's form reset doesn't wipe user input. */
  values?: Record<string, string>;
  /** Changes on every submission so clients can react to repeated results. */
  nonce?: number;
};

export const initialActionState: ActionState = { status: "idle" };
