import type { SiteSettings } from "@/lib/types";

export type SocialLink = { label: string; href: string };

export function socialLinks(s: SiteSettings): SocialLink[] {
  const links: SocialLink[] = [
    { label: "Instagram", href: s.instagram_url },
    { label: "Behance", href: s.behance_url },
    { label: "LinkedIn", href: s.linkedin_url },
    { label: "Dribbble", href: s.dribbble_url },
    { label: "X", href: s.x_url },
  ];
  return links.filter((l) => /^https?:\/\//i.test(l.href ?? ""));
}

export const NAV_LINKS = [
  { label: "Work", href: "/#work", id: "work" },
  { label: "About", href: "/#about", id: "about" },
  { label: "Services", href: "/#services", id: "services" },
  { label: "Contact", href: "/#contact", id: "contact" },
] as const;
