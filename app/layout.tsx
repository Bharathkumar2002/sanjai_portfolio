import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { getSiteSettings } from "@/lib/data/public";
import { siteUrl } from "@/lib/supabase/env";
import "./globals.css";

/**
 * One typeface across the whole site: Plus Jakarta Sans — friendly, polished and
 * very readable at body sizes, with strong bold weights for headings.
 * Fallbacks are defined in globals.css (--font-sans).
 */
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  style: ["normal", "italic"],
  variable: "--font-jakarta",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSiteSettings();
  const ogImage = s.og_image ?? s.hero_image;
  return {
    metadataBase: new URL(siteUrl),
    title: { default: s.seo_title, template: `%s — ${s.designer_name}` },
    description: s.seo_description,
    applicationName: s.designer_name,
    authors: [{ name: s.designer_name }],
    creator: s.designer_name,
    alternates: { canonical: "/" },
    openGraph: {
      type: "website",
      siteName: s.designer_name,
      title: s.seo_title,
      description: s.seo_description,
      url: "/",
      locale: "en_US",
      images: ogImage ? [{ url: ogImage, alt: s.seo_title }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: s.seo_title,
      description: s.seo_description,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#0b0b10",
  colorScheme: "dark",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={jakarta.variable}>
      <body className="min-h-dvh bg-ink-950">
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
