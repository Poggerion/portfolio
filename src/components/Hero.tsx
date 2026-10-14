import { profile } from "@/content/profile";
import { ui } from "@/content/ui";
import { t, type Locale } from "@/lib/i18n";
import { basePath } from "@/lib/site";
import styles from "./Hero.module.css";

/** Language the signature is written in. A string shared by both pages is marked up on the other one. */
const SIGNATURE_LANG: Locale = "en";

/** First screen: who, what, where, and the two ways to follow up. Visible at once, no intro. */
export function Hero({ lang }: { lang: Locale }) {
  const [first, last] = profile.name.split(" ");
  const sharedSignature = profile.signature.fr === profile.signature.en;
  const signatureLang = sharedSignature && lang !== SIGNATURE_LANG ? SIGNATURE_LANG : undefined;
  const resume = profile.resume[lang];
  return (
    <section id="top" className={styles.hero} aria-labelledby="hero-title">
      <div className={`col ${styles.inner}`}>
        <p className={`mono ${styles.signature}`} lang={signatureLang}>
          {t(profile.signature, lang)}
        </p>

        <h1 id="hero-title" className={styles.title}>
          <span className={styles.first}>{first}</span> <em className={styles.last}>{last}</em>
        </h1>

        <p className={styles.role}>{t(profile.role, lang)}</p>
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
          <div>
            <dt className="mono">{t(ui.hero.studies, lang)}</dt>
            <dd>{t(profile.studies, lang)}</dd>
          </div>
        </dl>

        <div className={styles.actions}>
          <a href="#contact" className={styles.primary}>
            {t(ui.contactMe, lang)}
          </a>
          {resume && (
            <a href={`${basePath}${resume}`} className={styles.secondary} download>
              {t(ui.downloadResume, lang)}
              <span className={styles.fileType}>PDF</span>
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
