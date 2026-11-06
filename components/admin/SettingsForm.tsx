"use client";

import { saveSettings } from "@/lib/actions/admin/settings";
import { useAdminForm } from "@/lib/hooks/useAdminForm";
import type { SiteSettings } from "@/lib/types";
import { FormSection, TextAreaField, TextField } from "./fields";
import { ImageUpload } from "./ImageUpload";
import { SaveBar } from "./SaveBar";

const emphasisHint = "Wrap words in *asterisks* to set them in the italic accent. Press Enter for a new line.";

export function SettingsForm({ settings: s }: { settings: SiteSettings }) {
  const { pending, onSubmit, err, markDirty } = useAdminForm(saveSettings);
  const text = (name: keyof SiteSettings, label: string, extra: Partial<Parameters<typeof TextField>[0]> = {}) => (
    <TextField name={name} label={label} defaultValue={(s[name] as string | number | null) ?? ""} error={err(name)} {...extra} />
  );
  const area = (name: keyof SiteSettings, label: string, extra: Partial<Parameters<typeof TextAreaField>[0]> = {}) => (
    <TextAreaField name={name} label={label} defaultValue={(s[name] as string | null) ?? ""} error={err(name)} {...extra} />
  );

  return (
    <form onSubmit={onSubmit} onChange={markDirty} noValidate>
      <FormSection title="Identity" description="Your name and brand, used across the site and in search results.">
        <div className="grid gap-5 sm:grid-cols-2">
          {text("brand_name", "Brand / logo text", { required: true, maxLength: 60 })}
          {text("designer_name", "Your name", { required: true, maxLength: 80 })}
        </div>
        {text("role_title", "Role", { maxLength: 80, hint: "e.g. Graphic Designer" })}
      </FormSection>

      <FormSection title="Hero" description="The first thing visitors see.">
        {text("hero_greeting", "Greeting", { maxLength: 80, hint: "e.g. Hey, I'm Sanjai —" })}
        {area("hero_headline", "Headline", { rows: 2, maxLength: 120, required: true, hint: emphasisHint })}
        {text("hero_tagline", "Tagline", { maxLength: 160 })}
        {area("hero_intro", "Introduction", { rows: 3, maxLength: 600 })}
        <ImageUpload name="hero_image" label="Hero portrait" folder="site" aspect="portrait" defaultValue={s.hero_image} error={err("hero_image")} onChange={markDirty} hint="Any photo works — it is automatically blended into the orange gradient." />
      </FormSection>

      <FormSection title="About" description="Your story, philosophy and experience.">
        {text("about_eyebrow", "Section label", { maxLength: 80 })}
        {area("about_headline", "Headline", { rows: 2, maxLength: 200, required: true, hint: emphasisHint })}
        {area("about_intro", "Short introduction", { rows: 3, maxLength: 1500 })}
        {area("about_bio", "Biography", { rows: 5, maxLength: 4000 })}
        {area("about_philosophy", "Creative philosophy", { rows: 3, maxLength: 2000, hint: "Shown as a large quote." })}
        {area("about_experience", "Experience & specialisation", { rows: 3, maxLength: 2000 })}
        <ImageUpload name="about_image" label="About image" folder="site" aspect="portrait" defaultValue={s.about_image} error={err("about_image")} onChange={markDirty} />
        <div className="grid gap-5 sm:grid-cols-3">
          {text("years_experience", "Years of experience", { type: "number", min: 0, max: 80 })}
          {text("projects_completed", "Projects delivered", { type: "number", min: 0 })}
          {text("clients_served", "Brands partnered with", { type: "number", min: 0 })}
        </div>
      </FormSection>

      <FormSection title="Contact details" description="Shown in the contact section and footer. Leave a field empty to hide it.">
        {text("availability", "Availability message", { maxLength: 120, hint: "e.g. Booking new projects for March" })}
        <div className="grid gap-5 sm:grid-cols-2">
          {text("contact_email", "Email", { type: "email", maxLength: 254 })}
          {text("contact_phone", "Phone", { type: "tel", maxLength: 40 })}
        </div>
        {text("location", "Location", { maxLength: 120 })}
      </FormSection>

      <FormSection title="Social links" description="Full URLs, e.g. https://www.behance.net/yourname">
        <div className="grid gap-5 sm:grid-cols-2">
          {text("instagram_url", "Instagram", { type: "url", placeholder: "https://" })}
          {text("behance_url", "Behance", { type: "url", placeholder: "https://" })}
          {text("linkedin_url", "LinkedIn", { type: "url", placeholder: "https://" })}
          {text("dribbble_url", "Dribbble", { type: "url", placeholder: "https://" })}
          {text("x_url", "X (Twitter)", { type: "url", placeholder: "https://" })}
        </div>
      </FormSection>

      <FormSection title="SEO & sharing" description="How the site appears in Google and when shared on social media.">
        {text("seo_title", "Page title", { maxLength: 120 })}
        {area("seo_description", "Meta description", { rows: 2, maxLength: 320, hint: "Aim for 140–160 characters." })}
        <ImageUpload name="og_image" label="Social share image" folder="site" defaultValue={s.og_image} error={err("og_image")} onChange={markDirty} hint="1200 × 630px. Falls back to the hero portrait." />
      </FormSection>

      <SaveBar pending={pending} label="Save website content" />
    </form>
  );
}
