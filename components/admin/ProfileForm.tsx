"use client";

import { saveSettings } from "@/lib/actions/admin/settings";
import { useAdminForm } from "@/lib/hooks/useAdminForm";
import type { SiteSettings } from "@/lib/types";
import { FormSection, TextAreaField, TextField } from "./fields";
import { ImageUpload } from "./ImageUpload";
import { ResumeUpload } from "./ResumeUpload";
import { SaveBar } from "./SaveBar";

const emphasisHint = "Wrap words in *asterisks* to highlight them in the accent colour.";
const placeholderHint = "Replace the [bracketed] placeholder.";

/** Profile details, banner and contact images, résumé, about text, social links and SEO. */
export function ProfileForm({ settings: s }: { settings: SiteSettings }) {
  const { pending, onSubmit, err, markDirty } = useAdminForm(saveSettings);
  const value = (name: keyof SiteSettings) => (s[name] as string | number | null) ?? "";
  const bracketed = (v: string | null) => Boolean(v && /^\[.*\]$/.test(v));

  return (
    <form onSubmit={onSubmit} onChange={markDirty} noValidate>
      <FormSection title="Profile details" description="Shown in the banner, the Details card, the contact section and the footer.">
        <TextField name="designer_name" label="Name" required maxLength={80} defaultValue={value("designer_name")} error={err("designer_name")} hint={bracketed(s.designer_name) ? placeholderHint : undefined} />
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField name="role_title" label="Role" maxLength={80} defaultValue={value("role_title")} error={err("role_title")} hint="e.g. Graphic Designer" />
          <TextField name="workplace" label="Current workplace" maxLength={120} defaultValue={value("workplace")} error={err("workplace")} />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField name="contact_phone" label="Mobile number" type="tel" inputMode="tel" autoComplete="off" maxLength={40} defaultValue={value("contact_phone")} error={err("contact_phone")} hint={bracketed(s.contact_phone) ? placeholderHint : "Include the country code, e.g. +91 98765 43210"} />
          <TextField name="contact_email" label="Email" type="email" maxLength={254} defaultValue={value("contact_email")} error={err("contact_email")} />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField name="location" label="Based in (optional)" maxLength={120} defaultValue={value("location")} error={err("location")} />
          <TextField name="availability" label="Availability (optional)" maxLength={120} defaultValue={value("availability")} error={err("availability")} hint="e.g. Open to freelance projects" />
        </div>
      </FormSection>

      <FormSection title="Résumé" description="Visitors can view or download it from the Details card.">
        <ResumeUpload defaultUrl={s.resume_url} defaultName={s.resume_file_name} defaultSize={s.resume_size_bytes} error={err("resume_url")} onChange={markDirty} />
      </FormSection>

      <FormSection title="Banner" description="The first thing visitors see: your photo in front, artwork softly behind it.">
        <TextAreaField name="hero_headline" label="Headline" rows={2} maxLength={120} required defaultValue={value("hero_headline")} error={err("hero_headline")} hint={emphasisHint} />
        <TextAreaField name="hero_intro" label="Introduction" rows={3} maxLength={600} defaultValue={value("hero_intro")} error={err("hero_intro")} />
        <div className="grid gap-5 sm:grid-cols-2">
          <ImageUpload name="hero_image" label="Your photo (front)" folder="site" aspect="portrait" defaultValue={s.hero_image} error={err("hero_image")} onChange={markDirty} hint="PNG/WebP with a transparent background looks best." />
          <ImageUpload name="hero_background_image" label="Background artwork" folder="site" aspect="portrait" defaultValue={s.hero_background_image} error={err("hero_background_image")} onChange={markDirty} hint="Shown at low opacity behind your photo." />
        </div>
        <div className="sm:max-w-[calc(50%-0.625rem)]">
          <ImageUpload name="contact_image" label="Contact section photo (optional)" folder="site" aspect="portrait" defaultValue={s.contact_image} error={err("contact_image")} onChange={markDirty} hint="Leave empty to reuse your banner photo." />
        </div>
      </FormSection>

      <FormSection title="About">
        <TextAreaField name="about_headline" label="Headline" rows={2} maxLength={200} required defaultValue={value("about_headline")} error={err("about_headline")} hint={emphasisHint} />
        <TextAreaField name="about_intro" label="Short introduction" rows={2} maxLength={1500} defaultValue={value("about_intro")} error={err("about_intro")} />
        <TextAreaField name="about_bio" label="Biography" rows={6} maxLength={4000} defaultValue={value("about_bio")} error={err("about_bio")} hint="Leave a blank line between paragraphs." />
      </FormSection>

      <FormSection title="Social links" description="Full URLs, e.g. https://www.behance.net/yourname. Empty links are hidden.">
        <div className="grid gap-5 sm:grid-cols-2">
          {(["instagram_url", "behance_url", "linkedin_url", "dribbble_url", "x_url"] as const).map((name) => (
            <TextField
              key={name}
              name={name}
              label={{ instagram_url: "Instagram", behance_url: "Behance", linkedin_url: "LinkedIn", dribbble_url: "Dribbble", x_url: "X (Twitter)" }[name]}
              type="url"
              placeholder="https://"
              defaultValue={value(name)}
              error={err(name)}
            />
          ))}
        </div>
      </FormSection>

      <FormSection title="Search & sharing" description="How the site appears in Google and when shared.">
        <TextField name="seo_title" label="Page title" maxLength={120} defaultValue={value("seo_title")} error={err("seo_title")} />
        <TextAreaField name="seo_description" label="Description" rows={2} maxLength={320} defaultValue={value("seo_description")} error={err("seo_description")} />
        <div className="sm:max-w-[calc(50%-0.625rem)]">
          <ImageUpload name="og_image" label="Share image" folder="site" defaultValue={s.og_image} error={err("og_image")} onChange={markDirty} hint="1200 × 630 px works best." />
        </div>
      </FormSection>

      <SaveBar pending={pending} label="Save profile" />
    </form>
  );
}
