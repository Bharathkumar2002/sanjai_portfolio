import type { NextConfig } from "next";

type RemotePattern = NonNullable<NonNullable<NextConfig["images"]>["remotePatterns"]>[number];

/**
 * Images may only come from Supabase Storage (uploads) or Unsplash (placeholder seed content).
 * The exact Supabase host is read from the environment so custom domains also work.
 */
const remotePatterns: RemotePattern[] = [
  { protocol: "https", hostname: "images.unsplash.com" },
  { protocol: "https", hostname: "*.supabase.co", pathname: "/storage/v1/object/public/**" },
];

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
if (supabaseUrl) {
  try {
    const { protocol, hostname, port } = new URL(supabaseUrl);
    if (!hostname.endsWith(".supabase.co")) {
      remotePatterns.push({
        protocol: protocol.replace(":", "") as "http" | "https",
        hostname,
        port,
        pathname: "/storage/v1/object/public/**",
      });
    }
  } catch {
    // Invalid URL: ignored here, reported at runtime by lib/supabase/env.ts
  }
}

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    remotePatterns,
    formats: ["image/avif", "image/webp"],
    // In local development images are served straight from their source. This keeps
    // `next dev` working on networks where the optimizer's SSRF guard rejects the
    // upstream address (e.g. NAT64 mobile hotspots). Production is always optimized.
    unoptimized: process.env.NODE_ENV === "development",
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
