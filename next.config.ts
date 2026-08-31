import type { NextConfig } from "next";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  turbopack: {
    root: projectRoot,
  },
  images: {
    remotePatterns: [
      // Public listing media served from the GCS media bucket.
      {
        protocol: "https",
        hostname: "storage.googleapis.com",
        pathname: "/media_bucket-12034/**",
      },
    ],
  },
  // NOTE: do not add an `env: {...}` block for the AUTH_* variables. Next.js
  // inlines everything listed there into the *client* bundle (see
  // next/docs "next.config.js: env"), which would ship AUTH_SECRET and
  // AUTH_GOOGLE_SECRET to the browser. Every consumer of those is server-only
  // and reads process.env at runtime; NEXT_PUBLIC_API_URL is exposed to the
  // client automatically by its NEXT_PUBLIC_ prefix.
};

export default nextConfig;
