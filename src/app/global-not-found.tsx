import type { Metadata, Viewport } from "next";
import { Geist, IBM_Plex_Mono, Instrument_Serif } from "next/font/google";
import { profile } from "@/content/profile";
import { basePath } from "@/lib/site";
import "./globals.css";
import styles from "./global-not-found.module.css";

/*
 * 404 for every unmatched URL (exported as out/404.html). The app has two root layouts, so
 * this page brings its own <html>, fonts and global styles. Bilingual: French first, as on
 * the rest of the site, with the English half marked up as such.
 */

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

export const metadata: Metadata = {
  title: `Page introuvable · Page not found — ${profile.name}`,
};

export const viewport: Viewport = {
  themeColor: "#08090b",
  colorScheme: "dark",
};

export default function GlobalNotFound() {
  return (
    <html lang="fr-CA" className={`${serif.variable} ${sans.variable} ${mono.variable}`}>
      <body>
        <div className={`wrap ${styles.page}`}>
          <a href={`${basePath}/fr/`} className={styles.name}>
            {profile.name}
          </a>

          <main className={styles.main}>
            <p className={`mono ${styles.code}`}>
              <span>404</span>
              <span className={styles.rule} aria-hidden="true" />
            </p>
            <h1 className={styles.title}>
              Page introuvable.{" "}
              <em lang="en-CA">Page not found.</em>
            </h1>

            <div className={styles.columns}>
              <div className={styles.column}>
                <p>Cette adresse ne mène à aucune page. Le lien est peut-être ancien ou incomplet.</p>
                <a href={`${basePath}/fr/`} className={styles.link}>
                  Retour à l’accueil <span aria-hidden="true">→</span>
                </a>
              </div>
              <div className={styles.column} lang="en-CA">
                <p>This address does not lead to a page. The link may be old or incomplete.</p>
                <a href={`${basePath}/en/`} className={styles.link}>
                  Back to the home page <span aria-hidden="true">→</span>
                </a>
              </div>
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
