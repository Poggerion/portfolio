export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** Absolute URL of a site path, for canonical links and the sitemap. */
export function absoluteUrl(path: string): string {
  return `${siteUrl}${basePath}${path}`;
}

/** The 1200×630 share image of a locale, for Open Graph and X/Twitter cards. */
export function shareImage(lang: "fr" | "en") {
  return {
    url: absoluteUrl(`/og/og-${lang}.png`),
    width: 1200,
    height: 630,
    alt: lang === "fr" ? "Felipe Portugal, étudiant en génie logiciel" : "Felipe Portugal, software engineering student",
  };
}
