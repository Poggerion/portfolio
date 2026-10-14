"use client";

import Link from "next/link";
import { scanNumber } from "@/content/scan";
import { ui } from "@/content/ui";
import { homePath, t, type Locale } from "@/lib/i18n";
import { useScan } from "@/lib/scan-store";
import styles from "./SiteHeader.module.css";

/** Skills and education are left out below 1024px, where the four others fit on one line. */
const navItems = [
  { id: "about", label: ui.nav.about },
  { id: "work", label: ui.nav.work },
  { id: "experience", label: ui.nav.experience },
  { id: "skills", label: ui.nav.skills, wide: true },
  { id: "education", label: ui.nav.education, wide: true },
  { id: "contact", label: ui.nav.contact },
] as const;

/** Section links with the one being read marked, and the scan counter that matches the HUD. */
export function SiteNav({ lang }: { lang: Locale }) {
  const { section, live } = useScan();
  const home = homePath(lang);
  const [num, total] = scanNumber(section).split("/");
  return (
    <>
      <nav aria-label={t(ui.mainNav, lang)} className={styles.nav}>
        <ul>
          {navItems.map((item) => {
            const current = live && item.id === section;
            return (
              <li key={item.id} className={"wide" in item ? styles.wide : undefined}>
                <Link
                  href={`${home}#${item.id}`}
                  className={styles.link}
                  aria-current={current ? "true" : undefined}
                >
                  {t(item.label, lang)}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      {/* Same number as the HUD; the nav already tells assistive technology where the reader is. */}
      <p className={`mono ${styles.counter}`} aria-hidden="true" data-live={live || undefined}>
        <span className={styles.counterNum}>{num}</span>/{total}
      </p>
    </>
  );
}
