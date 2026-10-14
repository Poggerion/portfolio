import Link from "next/link";
import { profile } from "@/content/profile";
import { ui } from "@/content/ui";
import { homePath, t, type Locale } from "@/lib/i18n";
import { LanguageSwitch } from "./LanguageSwitch";
import { SiteNav } from "./SiteNav";
import styles from "./SiteHeader.module.css";

export function SiteHeader({ lang }: { lang: Locale }) {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href={homePath(lang)} className={styles.name} aria-label={`${profile.name}, ${t(ui.home, lang)}`}>
          {profile.name}
        </Link>
        <SiteNav lang={lang} />
        <LanguageSwitch lang={lang} />
      </div>
    </header>
  );
}
