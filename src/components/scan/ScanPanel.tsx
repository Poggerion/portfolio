import type { Locale } from "@/lib/i18n";
import { ScanHud } from "./ScanHud";
import styles from "./ScanPanel.module.css";

/**
 * Sticky panel beside the reading column (desktop only). Holds the scan frame and its HUD;
 * the point cloud is drawn inside the frame.
 */
export function ScanPanel({ lang }: { lang: Locale }) {
  return (
    <div className={styles.panel}>
      <div className={styles.frame} aria-hidden="true">
        <span className={styles.bed} />
        <span className={styles.corner} data-corner="tl" />
        <span className={styles.corner} data-corner="tr" />
        <span className={styles.corner} data-corner="bl" />
        <span className={styles.corner} data-corner="br" />
        <span className={styles.reticle} />
      </div>
      <ScanHud lang={lang} />
    </div>
  );
}
