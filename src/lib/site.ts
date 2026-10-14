export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** Absolute URL of a site path, for canonical links and the sitemap. */
export function absoluteUrl(path: string): string {
  return `${siteUrl}${basePath}${path}`;
}
