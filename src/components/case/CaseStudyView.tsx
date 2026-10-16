import Link from "next/link";
import { projects } from "@/content/projects";
import { ui } from "@/content/ui";
import type { CaseStudy, Localized, Project } from "@/content/types";
import { casePath, homePath, t, type Locale } from "@/lib/i18n";
import { PROJECT_SHAPES } from "../scan/shapes";
import { CaseCloud, CaseStill } from "./CaseCloud";
import { FlowDiagram } from "./FlowDiagram";
import styles from "./CaseStudy.module.css";

const PARTS = ["problem", "how", "work", "results"] as const;
const anchor = (part: (typeof PARTS)[number]) => `case-${part}`;

/** A numbered part heading: "02 Problem and context". The number is the part's place in the contents. */
function PartTitle({
  part,
  lang,
}: {
  part: (typeof PARTS)[number];
  lang: Locale;
}) {
  return (
    <h2 className={styles.partTitle} id={`${anchor(part)}-title`}>
      <span className={`mono ${styles.partNumber}`}>
        {String(PARTS.indexOf(part) + 2).padStart(2, "0")}
      </span>
      {t(ui.caseStudy.parts[part], lang)}
    </h2>
  );
}

function List({ items, lang }: { items: Localized[]; lang: Locale }) {
  return (
    <ul className={styles.list}>
      {items.map((item, i) => (
        <li key={i}>{t(item, lang)}</li>
      ))}
    </ul>
  );
}

/**
 * The five-part case study: an intro a recruiter can read in half a minute (with the project's
 * own point cloud), then the problem, a diagram, the work and the choices behind it, and the
 * verified results. Technical detail comes further down, never on the first screen.
 */
export function CaseStudyView({
  project,
  study,
  lang,
}: {
  project: Project;
  study: CaseStudy;
  lang: Locale;
}) {
  const index = projects.indexOf(project);
  const next = projects[(index + 1) % projects.length];
  const shape = PROJECT_SHAPES[project.slug as keyof typeof PROJECT_SHAPES];
  const c = ui.caseStudy;

  return (
    <>
      {shape && <CaseCloud shape={shape} />}
      <main id="content" className={`wrap ${styles.page}`}>
        <Link href={`${homePath(lang)}#work`} className={styles.back}>
          ← {t(ui.backToWork, lang)}
        </Link>

        <header className={styles.intro}>
          <div className={styles.introText}>
            <p className={`mono ${styles.status}`}>
              <span className={styles.partNumber}>01</span>
              {t(study.status, lang)}
            </p>
            <h1 className={styles.title}>{t(project.title, lang)}</h1>
            <p className={styles.lede}>{t(study.lede, lang)}</p>
            <dl className={styles.glance} aria-label={t(c.glance, lang)}>
              <div>
                <dt className="mono">{t(c.role, lang)}</dt>
                <dd>{t(study.role, lang)}</dd>
              </div>
              <div>
                <dt className="mono">{t(c.outcome, lang)}</dt>
                <dd>{t(study.outcome, lang)}</dd>
              </div>
              <div>
                <dt className="mono">{t(study.setting ? c.setting : c.client, lang)}</dt>
                <dd>{t(study.client, lang)}</dd>
              </div>
              <div>
                <dt className="mono">{t(c.period, lang)}</dt>
                <dd>{t(project.period, lang)}</dd>
              </div>
            </dl>
          </div>
          {shape && <CaseStill shape={shape} />}
        </header>

        <nav className={styles.contents} aria-label={t(c.contents, lang)}>
          <ol>
            {PARTS.map((part, i) => (
              <li key={part}>
                <a href={`#${anchor(part)}`}>
                  <span className={`mono ${styles.partNumber}`}>
                    {String(i + 2).padStart(2, "0")}
                  </span>
                  {t(c.parts[part], lang)}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <section
          id={anchor("problem")}
          className={styles.part}
          aria-labelledby={`${anchor("problem")}-title`}
        >
          <PartTitle part="problem" lang={lang} />
          <div className={styles.partBody}>
            {study.problem.body.map((p, i) => (
              <p key={i}>{t(p, lang)}</p>
            ))}
            {study.problem.constraints && (
              <div className={styles.sub}>
                <h3 className={`mono ${styles.subTitle}`}>
                  {t(c.constraints, lang)}
                </h3>
                <List items={study.problem.constraints} lang={lang} />
              </div>
            )}
          </div>
        </section>

        <section
          id={anchor("how")}
          className={`${styles.part} ${styles.partWide}`}
          aria-labelledby={`${anchor("how")}-title`}
        >
          <PartTitle part="how" lang={lang} />
          <FlowDiagram diagram={study.diagram} authorship={study.authorship} lang={lang} />
          <div className={`${styles.partBody} ${styles.plain}`}>
            <h3 className={`mono ${styles.subTitle}`}>
              {t(c.plainWords, lang)}
            </h3>
            <p>{t(study.diagram.explanation, lang)}</p>
          </div>
        </section>

        <section
          id={anchor("work")}
          className={styles.part}
          aria-labelledby={`${anchor("work")}-title`}
        >
          <PartTitle part="work" lang={lang} />
          <div className={styles.partBody}>
            <div className={styles.sub}>
              <h3 className={`mono ${styles.subTitle}`}>
                {t(c.authors[study.authorship ?? "mine"].contributions, lang)}
              </h3>
              <List items={study.contributions} lang={lang} />
            </div>
            <div className={styles.sub}>
              <h3 className={`mono ${styles.subTitle}`}>
                {t(c.decisions, lang)}
              </h3>
              <List items={study.decisions} lang={lang} />
            </div>
            <div className={styles.sub}>
              <h3 className={`mono ${styles.subTitle}`}>{t(ui.stack, lang)}</h3>
              <dl className={styles.stack}>
                {study.stack.map((g) => (
                  <div key={g.label.en}>
                    {/* A lone group needs no label: the heading already says it. */}
                    <dt
                      className={
                        study.stack.length > 1 ? undefined : "visually-hidden"
                      }
                    >
                      {t(g.label, lang)}
                    </dt>
                    <dd>
                      <ul className={styles.stackList} translate="no">
                        {g.items.map((s) => (
                          <li key={s}>{s}</li>
                        ))}
                        {g.explored?.map((e) => (
                          <li key={e}>
                            <em>
                              {e} ({t(ui.explored, lang)})
                            </em>
                          </li>
                        ))}
                      </ul>
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
            {study.around?.map((a) => (
              // Work next to the project, kept apart and folded, so it is never read as part of it.
              <details key={a.heading.en} className={styles.around}>
                <summary className={styles.aroundToggle}>
                  {t(a.heading, lang)}
                </summary>
                <div className={styles.aroundBody}>
                  {a.body && <p>{t(a.body, lang)}</p>}
                  {a.points && <List items={a.points} lang={lang} />}
                </div>
              </details>
            ))}
          </div>
        </section>

        <section
          id={anchor("results")}
          className={styles.part}
          aria-labelledby={`${anchor("results")}-title`}
        >
          <PartTitle part="results" lang={lang} />
          <div className={styles.partBody}>
            <div className={styles.sub}>
              <h3 className={`mono ${styles.subTitle}`}>
                {t(c.results, lang)}
              </h3>
              <List items={study.results} lang={lang} />
            </div>
            <div className={`${styles.sub} ${styles.limits}`}>
              <h3 className={`mono ${styles.subTitle}`}>{t(c.limits, lang)}</h3>
              <List items={study.limits} lang={lang} />
            </div>
            {study.learnings && (
              <div className={styles.sub}>
                <h3 className={`mono ${styles.subTitle}`}>
                  {t(c.learnings, lang)}
                </h3>
                <List items={study.learnings} lang={lang} />
              </div>
            )}
          </div>
        </section>

        <Link href={casePath(lang, next.slug)} className={styles.next}>
          <span className="mono">{t(c.next, lang)}</span>
          {/* No-break space: the arrow never wraps alone onto its own line. */}
          <span className={styles.nextTitle}>
            {t(next.title, lang)}
            {" "}
            <span aria-hidden="true">→</span>
          </span>
        </Link>
      </main>
    </>
  );
}
