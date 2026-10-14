import { defaultLocale, isLocale, locales, type Locale, type Localized } from "@/content/types";

export { defaultLocale, isLocale, locales, type Locale };

/** Pick the string for a locale. */
export function t<T>(value: Localized<T>, lang: Locale): T {
  return value[lang];
}

export function otherLocale(lang: Locale): Locale {
  return lang === "fr" ? "en" : "fr";
}

/** Path of the home page for a locale, with trailing slash to match the static export. */
export function homePath(lang: Locale): string {
  return `/${lang}/`;
}

export function casePath(lang: Locale, slug: string): string {
  return `/${lang}/work/${slug}/`;
}

/** Swap the locale segment of a pathname (basePath already stripped by Next). */
export function swapLocale(pathname: string, to: Locale): string {
  const parts = pathname.split("/");
  if (parts.length > 1 && isLocale(parts[1])) {
    parts[1] = to;
    return parts.join("/") || homePath(to);
  }
  return homePath(to);
}
