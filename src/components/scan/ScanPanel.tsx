import type { Locale } from "@/lib/i18n";
import { ScanCloud } from "./ScanCloud";
import { ScanHud } from "./ScanHud";
import styles from "./ScanPanel.module.css";

/**
 * Fixed layer behind the page: the point cloud and, on wide screens, its HUD.
 * It takes no room in the flow, so the page is as long as its text.
 */
export function ScanPanel({ lang }: { lang: Locale }) {
  return (
    <div className={styles.panel}>
      <ScanCloud />
      <ScanHud lang={lang} />
    </div>
  );
}
