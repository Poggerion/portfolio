"use client";

import { useEffect, useState } from "react";
import { scanNumber, scanSections } from "@/content/scan";
import { t, type Locale } from "@/lib/i18n";
import { useScan } from "@/lib/scan-store";
import styles from "./ScanPanel.module.css";

/** How long the reader stays on a scan before it is announced, so a fast scroll stays quiet. */
const ANNOUNCE_DELAY = 800;

/** Caption of the scan panel: which scan this is and what it shows. */
export function ScanHud({ lang }: { lang: Locale }) {
  const { section, variant } = useScan();
  const scan = scanSections.find((s) => s.id === section) ?? scanSections[0];
  const subject = t((variant && scan.variants?.[variant]) || scan.subject, lang);
  const caption = `Scan ${scanNumber(scan.id)} · ${subject}`;

  // Announced politely once it settles; nothing is announced on load.
  const [announced, setAnnounced] = useState("");
  const [first] = useState(caption);
  useEffect(() => {
    if (caption === first && announced === "") return;
    const timer = window.setTimeout(() => setAnnounced(caption), ANNOUNCE_DELAY);
    return () => window.clearTimeout(timer);
  }, [caption, first, announced]);

  return (
    <>
      <p className={`mono ${styles.hud}`} aria-hidden="true">
        <span className={styles.hudNum}>Scan {scanNumber(scan.id)}</span>
        <span> · </span>
        <span>{subject}</span>
      </p>
      <p className="visually-hidden" aria-live="polite">
        {announced}
      </p>
    </>
  );
}
