import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { Geist, IBM_Plex_Mono, Instrument_Serif } from "next/font/google";
import { profile } from "@/content/profile";
import { isLocale, locales, t, type Locale } from "@/lib/i18n";
import { absoluteUrl } from "@/lib/site";
import { ui } from "@/content/ui";
import { SiteHeader } from "@/components/SiteHeader";
import { RevealObserver } from "@/components/RevealObserver";
import "../globals.css";

/**
 * Runs before first paint. .js: scripts run. .motion: reveal animations can complete.
 * data-scrolled: content passes under the fixed header, which then gets its backdrop.
 */
const bootScript = `(function(){try{var d=document.documentElement;d.classList.add("js");if("IntersectionObserver" in window&&!matchMedia("(prefers-reduced-motion: reduce)").matches){d.classList.add("motion")}var s=function(){d.toggleAttribute("data-scrolled",window.scrollY>8)};addEventListener("scroll",s,{passive:true});s()}catch(e){}})();`;

const serif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

const sans = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  display: "swap",
});

const mono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export const viewport: Viewport = {
  themeColor: "#08090b",
  colorScheme: "dark",
  viewportFit: "cover",
};

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const title = `${profile.name} — ${lang === "fr" ? "Génie logiciel" : "Software Engineering"}`;
  const description = t(profile.tagline, lang);
  return {
    title: { default: title, template: `%s — ${profile.name}` },
    description,
    alternates: {
      canonical: absoluteUrl(`/${lang}/`),
      languages: { fr: absoluteUrl("/fr/"), en: absoluteUrl("/en/") },
    },
    openGraph: {
      title,
      description,
      type: "website",
      locale: lang === "fr" ? "fr_CA" : "en_CA",
      url: absoluteUrl(`/${lang}/`),
    },
  };
}

export default async function LangLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale: Locale = lang;

  return (
    <html
      lang={locale === "fr" ? "fr-CA" : "en-CA"}
      className={`${serif.variable} ${sans.variable} ${mono.variable}`}
      // Lets Next turn smooth scrolling off during route changes (pages open at the top at once).
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body>
        <a className="skip-link" href="#content">
          {t(ui.skip, locale)}
        </a>
        <SiteHeader lang={locale} />
        {children}
        <RevealObserver />
      </body>
    </html>
  );
}
