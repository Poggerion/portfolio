import type { CSSProperties } from "react";
import { profile } from "@/content/profile";
import { ui } from "@/content/ui";
import { t, type Locale } from "@/lib/i18n";
import { basePath } from "@/lib/site";
import styles from "./Hero.module.css";

/** Letters rise one by one in the intro. The heading keeps its plain text for assistive tech. */
function Letters({ word, start }: { word: string; start: number }) {
  return (
    <span className={styles.word} aria-hidden="true">
      {[...word].map((ch, i) => (
        <span key={i} className={styles.letter} style={{ "--n": start + i } as CSSProperties}>
          {ch}
        </span>
      ))}
    </span>
  );
}

/** Language the signature is written in. A string shared by both pages is marked up on the other one. */
const SIGNATURE_LANG: Locale = "en";

export function Hero({ lang }: { lang: Locale }) {
  const [first, last] = profile.name.split(" ");
  const sharedSignature = profile.signature.fr === profile.signature.en;
  const signatureLang = sharedSignature && lang !== SIGNATURE_LANG ? SIGNATURE_LANG : undefined;
  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.stage} aria-hidden="true">
        {/* Static render of the sculpture: first paint, no-WebGL and reduced-motion fallback. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className={styles.fallback} src={`${basePath}/sculpture.svg`} alt="" width={1000} height={1000} />
      </div>

      <div className={`wrap ${styles.grid}`}>
        <p className={`mono ${styles.signature}`} lang={signatureLang}>
          <span className={styles.sigRule} aria-hidden="true" />
          {t(profile.signature, lang)}
        </p>

        <h1 id="hero-title" className={styles.title} aria-label={profile.name}>
          <span className={styles.line}>
            <Letters word={first} start={0} />
          </span>
          <span className={`${styles.line} ${styles.indent}`}>
            <em>
              <Letters word={last} start={first.length} />
            </em>
          </span>
        </h1>

        <p className={styles.tagline}>{t(profile.tagline, lang)}</p>

        <dl className={styles.meta}>
          <div style={{ "--k": 0 } as CSSProperties}>
            <dt className="mono">{lang === "fr" ? "Statut" : "Status"}</dt>
            <dd>
              <span className={styles.live} aria-hidden="true" />
              {t(profile.status, lang)}
            </dd>
          </div>
          <div style={{ "--k": 1 } as CSSProperties}>
            <dt className="mono">{lang === "fr" ? "Basé à" : "Based in"}</dt>
            <dd>
              {profile.location}
              <span className={styles.coords}>{profile.coordinates}</span>
            </dd>
          </div>
          <div style={{ "--k": 2 } as CSSProperties}>
            <dt className="mono">{lang === "fr" ? "Études" : "Studies"}</dt>
            <dd>{lang === "fr" ? "Génie logiciel, ÉTS" : "Software engineering, ÉTS"}</dd>
          </div>
        </dl>

        <a href="#about" className={styles.scroll}>
          <span className="mono">{t(ui.scroll, lang)}</span>
          <span className={styles.scrollLine} aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
