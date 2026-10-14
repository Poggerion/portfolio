"use client";

import { scanNumber, scanSections } from "@/content/scan";
import { t, type Locale } from "@/lib/i18n";
import { useScan } from "@/lib/scan-store";
import styles from "./ScanPanel.module.css";

/** Caption of the scan panel: which scan this is and what it shows. */
export function ScanHud({ lang }: { lang: Locale }) {
  const { section, variant } = useScan();
  const scan = scanSections.find((s) => s.id === section) ?? scanSections[0];
  const subject = (variant && scan.variants?.[variant]) || scan.subject;
  return (
    <p className={`mono ${styles.hud}`}>
      <span className={styles.hudNum}>Scan {scanNumber(scan.id)}</span>
      <span aria-hidden="true"> · </span>
      <span>{t(subject, lang)}</span>
    </p>
  );
}
