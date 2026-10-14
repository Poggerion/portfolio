"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ui } from "@/content/ui";
import { locales, swapLocale, t, type Locale } from "@/lib/i18n";
import styles from "./SiteHeader.module.css";

/** FR / EN switch. Keeps the current page and, when JavaScript runs, the current mode and section. */
export function LanguageSwitch({ lang }: { lang: Locale }) {
  const pathname = usePathname() ?? `/${lang}/`;
  const router = useRouter();

  return (
    <div className={styles.lang} role="group" aria-label={t(ui.language, lang)}>
      {locales.map((code, i) => {
        const active = code === lang;
        const href = swapLocale(pathname, code);
        return (
          <span key={code} className={styles.langItem}>
            {i > 0 && <span aria-hidden="true" className={styles.langSep}>/</span>}
            {active ? (
              <span className={styles.langActive} aria-current="true">
                {code.toUpperCase()}
              </span>
            ) : (
              <Link
                href={href}
                hrefLang={code}
                lang={code}
                aria-label={t(ui.switchLanguage, lang)}
                className={styles.langLink}
                onClick={(event) => {
                  // Keep the mode (?mode=creative&domain=…) and the section (#…) across languages.
                  const { search, hash } = window.location;
                  if (search || hash) {
                    event.preventDefault();
                    router.push(`${href}${search}${hash}`);
                  }
                }}
              >
                {code.toUpperCase()}
              </Link>
            )}
          </span>
        );
      })}
    </div>
  );
}
