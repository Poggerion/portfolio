import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Footer } from "@/components/sections";
import { domains, profile } from "@/content/profile";
import { getProject, projects } from "@/content/projects";
import { ui } from "@/content/ui";
import { casePath, homePath, isLocale, locales, t } from "@/lib/i18n";
import { absoluteUrl } from "@/lib/site";
import styles from "./case.module.css";

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((lang) => projects.map((p) => ({ lang, slug: p.slug })));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/work/[slug]">): Promise<Metadata> {
  const { lang, slug } = await params;
  const project = getProject(slug);
  if (!isLocale(lang) || !project) return {};
  const title = t(project.title, lang);
  const description = t(project.summary, lang);
  const url = absoluteUrl(casePath(lang, slug));
  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: { fr: absoluteUrl(casePath("fr", slug)), en: absoluteUrl(casePath("en", slug)) },
    },
    // Replaces the layout's openGraph as a whole, so a shared case link previews the project, not the home page.
    openGraph: {
      title: `${title} — ${profile.name}`,
      description,
      type: "article",
      locale: lang === "fr" ? "fr_CA" : "en_CA",
      url,
    },
  };
}

export default async function CaseStudy({ params }: PageProps<"/[lang]/work/[slug]">) {
  const { lang, slug } = await params;
  const project = getProject(slug);
  if (!isLocale(lang) || !project) notFound();

  const index = projects.indexOf(project);
  const next = projects[(index + 1) % projects.length];
  const domainLabels = project.domains.map((d) => t(domains.find((x) => x.id === d)!.label, lang));

  return (
    <>
      <main id="content" className={`wrap ${styles.page}`}>
        <Link href={`${homePath(lang)}#work`} className={`mono ${styles.back}`}>
          ← {t(ui.backToWork, lang)}
        </Link>

        <header className={styles.header}>
          <div className={styles.headText}>
            <p className={`mono ${styles.context}`}>
              {t(project.context, lang)}
            </p>
            <h1 className={styles.title}>
              {t(project.title, lang)}
            </h1>
            <p className={styles.summary}>
              {t(project.summary, lang)}
            </p>
          </div>
          <span className={styles.rule} aria-hidden="true" />
        </header>

        <dl className={styles.meta}>
          <div>
            <dt className="mono">{lang === "fr" ? "Période" : "Period"}</dt>
            <dd>{t(project.period, lang)}</dd>
          </div>
          <div>
            <dt className="mono">{lang === "fr" ? "Équipe" : "Team"}</dt>
            <dd>{t(project.team, lang)}</dd>
          </div>
          <div>
            <dt className="mono">{lang === "fr" ? "Domaines" : "Domains"}</dt>
            <dd>{domainLabels.join(", ")}</dd>
          </div>
          <div className={styles.metaWide}>
            <dt className="mono">{t(ui.stack, lang)}</dt>
            <dd>
              <ul className={styles.stackList}>
                {project.stack.map((s) => (
                  <li key={s}>{s}</li>
                ))}
                {project.explored?.map((e) => (
                  <li key={e}>
                    <em>
                      {e} ({t(ui.explored, lang)})
                    </em>
                  </li>
                ))}
              </ul>
            </dd>
          </div>
        </dl>

        <div className={styles.body}>
          {project.sections.map((s) => (
            <section key={s.heading.en} className={styles.block}>
              <h2 className={`mono ${styles.blockTitle}`}>{t(s.heading, lang)}</h2>
              <div className={styles.blockContent}>
                {s.body && <p>{t(s.body, lang)}</p>}
                {s.points && (
                  <ul>
                    {s.points.map((pt, i) => (
                      <li key={i}>{t(pt, lang)}</li>
                    ))}
                  </ul>
                )}
              </div>
            </section>
          ))}
          {project.limits && (
            <section className={`${styles.block} ${styles.limits}`}>
              <h2 className={`mono ${styles.blockTitle}`}>{t(ui.limits, lang)}</h2>
              <div className={styles.blockContent}>
                {project.limits.map((l, i) => (
                  <p key={i}>{t(l, lang)}</p>
                ))}
              </div>
            </section>
          )}
        </div>

        <Link href={casePath(lang, next.slug)} className={styles.next}>
          <span className="mono">{lang === "fr" ? "Projet suivant" : "Next project"}</span>
          {/* No-break space: the arrow never wraps alone onto its own line. */}
          <span className={styles.nextTitle}>
            {t(next.title, lang)}
            {"\u00a0"}
            <span aria-hidden="true">→</span>
          </span>
        </Link>
      </main>
      <Footer />
    </>
  );
}
