import { profile } from "@/content/profile";
import { ui } from "@/content/ui";
import { t, type Locale } from "@/lib/i18n";
import { basePath } from "@/lib/site";
import styles from "./Hero.module.css";

/**
 * First screen, read in 30 to 60 seconds (J5): who, studies at ÉTS, the three fields, one concrete
 * result, availability, then the featured work, the résumé and contact. Visible at once, no intro.
 */
export function Hero({ lang }: { lang: Locale }) {
  const [first, last] = profile.name.split(" ");
  const resume = profile.resume[lang];
  return (
    <section id="top" className={styles.hero} aria-labelledby="hero-title">
      <div className={`col ${styles.inner}`}>
        <p className={`mono ${styles.signature}`}>
          {t(profile.signature, lang)}
        </p>

        <h1 id="hero-title" className={styles.title} translate="no">
          <span className={styles.first}>{first}</span> <em className={styles.last}>{last}</em>
        </h1>

        <p className={styles.role}>{t(profile.role, lang)}</p>
        <p className={`mono ${styles.focus}`}>{t(profile.focus, lang)}</p>
        <p className={styles.hook}>{t(profile.hook, lang)}</p>

        <dl className={styles.meta}>
          <div>
            <dt className="mono">{t(ui.hero.status, lang)}</dt>
            <dd>
              <span className={styles.live} aria-hidden="true" />
              {t(profile.status, lang)}
            </dd>
          </div>
          <div>
            <dt className="mono">{t(ui.hero.based, lang)}</dt>
            <dd>
              {profile.location}
              <span className={styles.coords}>{profile.coordinates}</span>
            </dd>
          </div>
        </dl>

        <div className={styles.actions}>
          <a href="#work" className={styles.primary}>
            {t(ui.hero.work, lang)}
          </a>
          {resume && (
            <a href={`${basePath}${resume}`} className={styles.secondary} download>
              {t(ui.downloadResume, lang)}
              <span className={styles.fileType}>PDF</span>
            </a>
          )}
          <a href="#contact" className={styles.tertiary}>
            {t(ui.contactMe, lang)}
          </a>
        </div>
      </div>
    </section>
  );
}
