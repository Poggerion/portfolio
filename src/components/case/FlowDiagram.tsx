import type { CSSProperties } from "react";
import { ui } from "@/content/ui";
import type { CaseStudy } from "@/content/types";
import { t, type Locale } from "@/lib/i18n";
import styles from "./CaseStudy.module.css";

/**
 * A case study diagram drawn in HTML: boxes joined by labelled links, in a row on wide screens and
 * in a column on narrow ones. The boxes are a list, so the flow reads in order without the
 * drawing. Felipe's own parts carry the accent; a note says the diagram is a simplification.
 */
export function FlowDiagram({ diagram, lang }: { diagram: CaseStudy["diagram"]; lang: Locale }) {
  const columns = Math.max(...diagram.lanes.map((l) => l.nodes.length));
  const hasOther = diagram.lanes.some((l) => l.nodes.some((n) => !n.mine));
  return (
    <figure className={styles.diagram} style={{ "--cols": columns } as CSSProperties}>
      {diagram.lanes.map((lane, k) => (
        <div key={k} className={styles.lane}>
          {lane.label && <p className={`mono ${styles.laneLabel}`}>{t(lane.label, lang)}</p>}
          <ol className={styles.flow}>
            {lane.nodes.map((node, i) => (
              <li key={i} className={styles.step} data-mine={node.mine || undefined}>
                {i > 0 && (
                  <span className={styles.link} data-both={node.link?.both || undefined}>
                    <span className={styles.arrow} aria-hidden="true">
                      <span className={styles.pulse} style={{ animationDelay: `${(k * 3 + i) * 0.45}s` }} />
                    </span>
                    {node.link?.label && <span className={`mono ${styles.linkLabel}`}>{t(node.link.label, lang)}</span>}
                  </span>
                )}
                <span className={styles.node}>
                  {node.mine && <span className={`mono ${styles.mineTag}`}>{t(ui.caseStudy.mine, lang)}</span>}
                  <span className={styles.nodeTitle}>{t(node.title, lang)}</span>
                  {node.detail && <span className={styles.nodeDetail}>{t(node.detail, lang)}</span>}
                </span>
              </li>
            ))}
          </ol>
        </div>
      ))}
      <figcaption className={styles.caption}>
        <span className={`mono ${styles.legend}`}>
          <span className={styles.legendMine} aria-hidden="true" />
          {t(ui.caseStudy.mine, lang)}
          {hasOther && (
            <>
              <span className={styles.legendOther} aria-hidden="true" />
              {t(ui.caseStudy.other, lang)}
            </>
          )}
        </span>
        <span className={styles.note}>{t(ui.caseStudy.diagramNote, lang)}</span>
      </figcaption>
    </figure>
  );
}
