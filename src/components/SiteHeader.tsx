import Link from "next/link";
import { profile } from "@/content/profile";
import { ui } from "@/content/ui";
import { homePath, t, type Locale } from "@/lib/i18n";
import { LanguageSwitch } from "./LanguageSwitch";
import { ModeToggle } from "./ModeToggle";
import styles from "./SiteHeader.module.css";

const navItems = [
  { id: "about", label: ui.nav.about },
  { id: "work", label: ui.nav.work },
  { id: "experience", label: ui.nav.experience },
  { id: "contact", label: ui.nav.contact },
] as const;

export function SiteHeader({ lang }: { lang: Locale }) {
  const home = homePath(lang);
  return (
    <header className={styles.header}>
      <div className={`wrap ${styles.inner}`}>
        <Link href={home} className={styles.name} aria-label={`${profile.name}, ${t(ui.home, lang)}`}>
          {profile.name}
        </Link>
        <nav aria-label={lang === "fr" ? "Navigation principale" : "Main navigation"} className={styles.nav} data-pro-only>
          <ul>
            {navItems.map((item) => (
              <li key={item.id}>
                <Link href={`${home}#${item.id}`} className={styles.link}>
                  {t(item.label, lang)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <ModeToggle lang={lang} />
        <LanguageSwitch lang={lang} />
      </div>
    </header>
  );
}
