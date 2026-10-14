import type { NextConfig } from "next";

/**
 * Static export for GitHub Pages.
 * Set NEXT_PUBLIC_BASE_PATH to the repository path (e.g. "/portfolio") when the site
 * is served from a project page; leave it empty for a user page or local preview.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath,
  images: { unoptimized: true },
  // Lets a second dev server run beside a build without sharing the cache folder.
  distDir: process.env.NEXT_DIST_DIR || ".next",
  // app/global-not-found.tsx: the branded 404 (out/404.html). Needed because the app has two
  // root layouts, so there is no single layout to build a not-found page from.
  experimental: {
    globalNotFound: true,
  },
};

export default nextConfig;
