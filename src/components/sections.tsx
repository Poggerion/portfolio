import Link from "next/link";
import { capra, experiences } from "@/content/experience";
import { profile } from "@/content/profile";
import { projects } from "@/content/projects";
import { education, skillGroups } from "@/content/skills";
import { ui } from "@/content/ui";
import type { Localized } from "@/content/types";
import { casePath, t, type Locale } from "@/lib/i18n";
import { basePath } from "@/lib/site";
import { CopyButton } from "./CopyButton";
import styles from "./sections.module.css";

function Head({ id, label, lang, aside }: { id: string; label: Localized; lang: Locale; aside?: string }) {
  return (
    <header className={styles.head}>
      <h2 id={`${id}-title`} className={styles.title}>
        {t(label, lang)}
      </h2>
      {aside && <p className={`mono ${styles.headAside}`}>{aside}</p>}
    </header>
  );
}

/** Technologies as whole items; separators come from CSS so a line never breaks inside one. */
function Stack({ items, explored, lang }: { items: string[]; explored?: string[]; lang: Locale }) {
  return (
    <ul className={`mono ${styles.stack}`} translate="no">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
      {explored?.map((e) => (
        <li key={e} className={styles.explored}>
          {e} ({t(ui.explored, lang)})
        </li>
      ))}
    </ul>
  );
}

/** Result-first: the strongest highlights are shown, the rest open on demand. */
const VISIBLE_HIGHLIGHTS = 4;
const VISIBLE_TAGS = 6;

function TagList({ items, explored, lang }: { items: string[]; explored?: string[]; lang: Locale }) {
  return (
    <ul className={`mono ${styles.tags}`} translate="no">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
      {explored?.map((e) => (
        <li key={e} className={styles.explored}>
          {e} ({t(ui.explored, lang)})
        </li>
      ))}
    </ul>
  );
}

/** Six tags per skill group; the rest, and anything only explored, behind a toggle.
    A toggle that would hide a single tag is not worth the click, so seven still show in full. */
function Tags({ items, explored = [], lang }: { items: string[]; explored?: string[]; lang: Locale }) {
  if (items.length + explored.length <= VISIBLE_TAGS + 1) return <TagList items={items} explored={explored} lang={lang} />;
  const rest = items.slice(VISIBLE_TAGS);
  return (
    <>
      <TagList items={items.slice(0, VISIBLE_TAGS)} lang={lang} />
      <details className={styles.more}>
        <summary className={styles.moreToggle}>
          <span className={styles.whenClosed}>
            {rest.length + explored.length} {t(ui.more, lang)}
          </span>
          <span className={styles.whenOpen}>{t(ui.showLess, lang)}</span>
        </summary>
        <TagList items={rest} explored={explored} lang={lang} />
      </details>
    </>
  );
}

export function About({ lang }: { lang: Locale }) {
  return (
    <section id="about" className={`col ${styles.section}`} aria-labelledby="about-title">
      <Head id="about" label={ui.sections.about} lang={lang} />
      <div className={styles.aboutGrid}>
        <div className={styles.prose}>
          {profile.about.map((p, i) => (
            <p key={i} className={i === 0 ? styles.lead : undefined}>
              {t(p, lang)}
            </p>
          ))}
        </div>
        <dl className={styles.facts}>
          {profile.availability.map((row) => (
            <div key={row.label.en}>
              <dt className="mono">{t(row.label, lang)}</dt>
              <dd>{t(row.value, lang)}</dd>
            </div>
          ))}
          <div>
            <dt className="mono">{lang === "fr" ? "Langues" : "Languages"}</dt>
            <dd>{t(profile.languages, lang)}</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}

export function Work({ lang }: { lang: Locale }) {
  const featured = projects.filter((p) => p.featured);
  const others = projects.filter((p) => !p.featured);
  const count = String(projects.length).padStart(2, "0");
  return (
    <section id="work" className={`col ${styles.section}`} aria-labelledby="work-title">
      <Head id="work" label={ui.sections.work} lang={lang} aside={`${count} ${lang === "fr" ? "études de cas" : "case studies"}`} />
      <ul className={styles.cards}>
        {featured.map((p) => {
          const f = p.featured!;
          return (
            <li key={p.slug} className={styles.card} data-project={p.slug}>
              {f.cover && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  className={styles.cover}
                  src={`${basePath}${f.cover.src}`}
                  alt={t(f.cover.alt, lang)}
                  width={f.cover.width}
                  height={f.cover.height}
                  loading="lazy"
                />
              )}
              <p className={`mono ${styles.cardMeta}`}>
                <span>{t(p.period, lang)}</span>
                <span>{t(ui.involvement[p.involvement], lang)}</span>
              </p>
              <h3 className={styles.cardTitle}>
                {/* The whole card is the link; its area comes from the ::after of this anchor. */}
                <Link href={casePath(lang, p.slug)} className={styles.cardLink}>
                  {t(p.title, lang)}
                </Link>
              </h3>
              <p className={styles.cardRole}>{t(f.role, lang)}</p>
              <p className={styles.cardImpact}>{t(f.impact, lang)}</p>
              <ul className={`mono ${styles.tags}`} aria-label={t(ui.stack, lang)} translate="no">
                {f.stack.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
              <p className={styles.cardMore} aria-hidden="true">
                {t(ui.readCase, lang)}
              </p>
            </li>
          );
        })}
      </ul>
      <h3 className={`mono ${styles.othersTitle}`}>{t(ui.otherProjects, lang)}</h3>
      <ul className={styles.others}>
        {others.map((p) => (
          <li key={p.slug} data-project={p.slug}>
            <Link href={casePath(lang, p.slug)} className={styles.otherRow}>
              <span className={styles.otherTitle}>{t(p.title, lang)}</span>
              <span className={`mono ${styles.otherMeta}`}>
                {t(p.period, lang)} · {t(ui.involvement[p.involvement], lang)}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function ExperienceList({ lang }: { lang: Locale }) {
  return (
    <section id="experience" className={`col ${styles.section}`} aria-labelledby="experience-title">
      <Head id="experience" label={ui.sections.experience} lang={lang} aside="2023 — 2025" />
      <ol className={styles.timeline}>
        {experiences.map((xp) => (
          <li key={xp.id} className={styles.job}>
            <p className={`mono ${styles.when}`}>{t(xp.period, lang)}</p>
            <div className={styles.jobBody}>
              <h3 className={styles.jobTitle}>{t(xp.heading, lang)}</h3>
              <p className={styles.org}>
                {xp.organization}
                {xp.organizationDetail && <span> · {t(xp.organizationDetail, lang)}</span>}
                {xp.location && <span> · {xp.location}</span>}
              </p>
              {xp.roles && (
                <ul className={styles.roles}>
                  {xp.roles.map((r) => (
                    <li key={r.title.en}>
                      <span>{t(r.title, lang)}</span>
                      <span className={`mono ${styles.rolePeriod}`}>{t(r.period, lang)}</span>
                    </li>
                  ))}
                </ul>
              )}
              {xp.highlightsLabel && <p className={`mono ${styles.subLabel}`}>{t(xp.highlightsLabel, lang)}</p>}
              <ul className={styles.highlights}>
                {xp.highlights.slice(0, VISIBLE_HIGHLIGHTS).map((h, i) => (
                  <li key={i}>{t(h, lang)}</li>
                ))}
              </ul>
              {xp.highlights.length > VISIBLE_HIGHLIGHTS && (
                <details className={styles.more}>
                  <summary className={styles.moreToggle}>
                    <span className={styles.whenClosed}>
                      {t(ui.showMore, lang)} ({xp.highlights.length - VISIBLE_HIGHLIGHTS})
                    </span>
                    <span className={styles.whenOpen}>{t(ui.showLess, lang)}</span>
                  </summary>
                  <ul className={styles.highlights}>
                    {xp.highlights.slice(VISIBLE_HIGHLIGHTS).map((h, i) => (
                      <li key={i}>{t(h, lang)}</li>
                    ))}
                  </ul>
                </details>
              )}
              <Stack items={xp.stack} explored={xp.explored} lang={lang} />
              {xp.caseStudy && (
                <Link href={casePath(lang, xp.caseStudy)} className={styles.inlineLink}>
                  {t(ui.readCase, lang)} <span aria-hidden="true">→</span>
                </Link>
              )}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function Skills({ lang }: { lang: Locale }) {
  return (
    <section id="skills" className={`col ${styles.section}`} aria-labelledby="skills-title">
      <Head id="skills" label={ui.sections.skills} lang={lang} />
      <ul className={styles.skills}>
        {skillGroups.map((g) => (
          <li key={g.id} className={styles.skill}>
            <h3 className={styles.skillTitle}>{t(g.label, lang)}</h3>
            <p className={styles.skillEvidence}>{t(g.evidence, lang)}</p>
            <Tags items={g.items} explored={g.explored} lang={lang} />
          </li>
        ))}
      </ul>
    </section>
  );
}

export function EducationList({ lang }: { lang: Locale }) {
  return (
    <section id="education" className={`col ${styles.section}`} aria-labelledby="education-title">
      <Head id="education" label={ui.sections.education} lang={lang} />
      <ol className={styles.timeline}>
        {education.map((e) => (
          <li key={e.id} className={styles.job} data-scan-variant={e.id === "ets" ? "ets" : undefined}>
            <p className={`mono ${styles.when}`}>{t(e.period, lang)}</p>
            <div className={styles.jobBody}>
              <h3 className={styles.jobTitle}>{t(e.degree, lang)}</h3>
              <p className={styles.org}>
                {e.school} · {e.location}
              </p>
              <ul className={styles.courses}>
                {e.courses.map((c) => (
                  <li key={c.code.en}>
                    <span className={`mono ${styles.courseCode}`}>{t(c.code, lang)}</span>
                    <span className={styles.courseTitle}>{t(c.title, lang)}</span>
                    <span className={styles.courseDetail}>{t(c.detail, lang)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </li>
        ))}
        <li className={styles.job}>
          <p className={`mono ${styles.when}`}>{t(capra.period, lang)}</p>
          <div className={styles.jobBody}>
            <h3 className={styles.jobTitle}>{t(capra.title, lang)}</h3>
            <p className={styles.org}>{t(capra.context, lang)}</p>
            <p className={styles.courseDetail}>{t(capra.detail, lang)}</p>
          </div>
        </li>
      </ol>
    </section>
  );
}

export function Contact({ lang }: { lang: Locale }) {
  const resume = profile.resume[lang];
  const title =
    lang === "fr"
      ? { a: "Construisons", b: "la suite." }
      : { a: "Let’s build", b: "what’s next." };
  return (
    <section id="contact" className={`col ${styles.section} ${styles.contact}`} aria-labelledby="contact-title">
      <p className={`mono ${styles.contactLabel}`}>{t(ui.sections.contact, lang)}</p>
      <h2 id="contact-title" className={styles.contactTitle}>
        {title.a} <em>{title.b}</em>
      </h2>
      <p className={styles.contactLead}>{t(ui.contactLead, lang)}</p>
      {/* No-break spaces keep each ↗ with the end of its link text. */}
      <ul className={styles.contactList}>
        <li>
          <span className={`mono ${styles.contactKey}`}>{t(ui.email, lang)}</span>
          <a href={`mailto:${profile.email}`} className={styles.contactValue} id="contact-email">
            {profile.email}
          </a>
          <CopyButton value={profile.email} label={t(ui.copy, lang)} done={t(ui.copied, lang)} />
        </li>
        <li>
          <span className={`mono ${styles.contactKey}`}>LinkedIn</span>
          <a href={profile.linkedin} className={styles.contactValue} target="_blank" rel="noopener noreferrer">
            {profile.linkedinLabel}
            {"\u00a0"}
            <span aria-hidden="true">↗</span>
          </a>
        </li>
        <li>
          <span className={`mono ${styles.contactKey}`}>GitHub</span>
          <a href={profile.github} className={styles.contactValue} target="_blank" rel="noopener noreferrer">
            {profile.githubLabel}
            {"\u00a0"}
            <span aria-hidden="true">↗</span>
          </a>
        </li>
        {resume && (
          <li>
            <span className={`mono ${styles.contactKey}`}>CV</span>
            <a href={`${basePath}${resume}`} className={styles.contactValue} download>
              {t(ui.resume, lang)}
              {"\u00a0"}
              <span aria-hidden="true">↓</span>
            </a>
          </li>
        )}
      </ul>
    </section>
  );
}

export function Footer() {
  return (
    <footer className={`col ${styles.footer}`}>
      <span className="mono">© 2026 {profile.name}</span>
      <span className={styles.footerLinks}>
        <a className="mono" href={profile.linkedin} target="_blank" rel="noopener noreferrer">
          LinkedIn
        </a>
        <a className="mono" href={profile.github} target="_blank" rel="noopener noreferrer">
          GitHub
        </a>
      </span>
      <span className="mono">{profile.location}</span>
    </footer>
  );
}
