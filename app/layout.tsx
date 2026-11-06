import type { Metadata, Viewport } from "next";
import { Inter, Inter_Tight, Instrument_Serif } from "next/font/google";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { getSiteSettings } from "@/lib/data/public";
import { siteUrl } from "@/lib/supabase/env";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const interTight = Inter_Tight({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-inter-tight",
  display: "swap",
});
const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSiteSettings();
  const ogImage = s.og_image ?? s.hero_image;
  return {
    metadataBase: new URL(siteUrl),
    title: { default: s.seo_title, template: `%s — ${s.brand_name}` },
    description: s.seo_description,
    applicationName: s.brand_name,
    authors: [{ name: s.designer_name }],
    creator: s.designer_name,
    alternates: { canonical: "/" },
    openGraph: {
      type: "website",
      siteName: s.brand_name,
      title: s.seo_title,
      description: s.seo_description,
      url: "/",
      locale: "en_US",
      images: ogImage ? [{ url: ogImage, width: 1200, height: 630, alt: s.seo_title }] : undefined,
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
  themeColor: "#080808",
  colorScheme: "dark",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${interTight.variable} ${instrumentSerif.variable}`}
    >
      <body className="min-h-dvh bg-ink-950">
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
