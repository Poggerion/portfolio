"use client";

import { useEffect, useState } from "react";
import { scanNumber, scanSections, type ScanSection } from "@/content/scan";
import { shownProject } from "@/lib/active-section";
import { t, type Locale } from "@/lib/i18n";
import { useScan } from "@/lib/scan-store";
import styles from "./ScanPanel.module.css";

/** How long the reader stays on a scan before it is announced, so a fast scroll stays quiet. */
const ANNOUNCE_DELAY = 800;

const scanOf = (id: string): ScanSection => scanSections.find((s) => s.id === id) ?? scanSections[0];

/** "Scan 03/07 · Projet · …" for a scan and an optional variant of it. */
function captionOf(scan: ScanSection, variant: string | null, lang: Locale) {
  return { number: scanNumber(scan.id), subject: t((variant && scan.variants?.[variant]) || scan.subject, lang) };
}

/**
 * Caption of the scan panel: which scan this is and what it shows. A project previewed by focus
 * or hover is shown, but only what the reader scrolls to is announced: the focused link already
 * speaks for itself.
 */
export function ScanHud({ lang }: { lang: Locale }) {
  const state = useScan();
  const project = shownProject(state);
  const shown = project ? captionOf(scanOf("work"), project, lang) : captionOf(scanOf(state.section), state.variant, lang);
  const read = captionOf(scanOf(state.section), state.variant, lang);
  const caption = `Scan ${read.number} · ${read.subject}`;

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
        <span className={styles.hudNum}>Scan {shown.number}</span>
        <span> · </span>
        <span>{shown.subject}</span>
      </p>
      <p className="visually-hidden" aria-live="polite">
        {announced}
      </p>
    </>
  );
}
