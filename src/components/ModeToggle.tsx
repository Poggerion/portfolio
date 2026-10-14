"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ui } from "@/content/ui";
import { useExperience } from "@/lib/experience-store";
import { enterCreative, exitCreative } from "@/lib/mode";
import { homePath, t, type Locale } from "@/lib/i18n";
import styles from "./SiteHeader.module.css";

/**
 * Pro / creative switch. Its label names the mode it switches to, so it is a plain button
 * (no aria-pressed). From a case study it opens the creative mode on that project.
 */
export function ModeToggle({ lang }: { lang: Locale }) {
  const pathname = usePathname() ?? "";
  const mode = useExperience((s) => s.mode);
  const isHome = /^\/(fr|en)\/?$/.test(pathname);
  const creative = mode === "creative";
  const label = creative ? t(ui.creative.exit, lang) : t(ui.creative.enter, lang);

  const content = (
    <>
      <span className={styles.modeIcon} data-on={creative ? "true" : "false"} aria-hidden="true">
        <span />
        <span />
      </span>
      <span className={styles.modeLabel}>{label}</span>
    </>
  );

  if (!isHome) {
    const slug = pathname.match(/\/work\/([^/]+)/)?.[1];
    const href = `${homePath(lang)}?mode=creative${slug ? `&project=${encodeURIComponent(slug)}` : ""}`;
    return (
      <Link id="mode-toggle" href={href} className={styles.mode} title={t(ui.creative.toggleLabel, lang)}>
        {content}
      </Link>
    );
  }

  return (
    <button
      id="mode-toggle"
      type="button"
      className={styles.mode}
      data-active={creative ? "true" : "false"}
      title={t(ui.creative.toggleLabel, lang)}
      onClick={() => (creative ? exitCreative() : enterCreative())}
    >
      {content}
    </button>
  );
}
