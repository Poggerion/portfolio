import { notFound } from "next/navigation";
import { Hero } from "@/components/Hero";
import { ScanPanel } from "@/components/scan/ScanPanel";
import { ScanTracker } from "@/components/scan/ScanTracker";
import { About, Contact, EducationList, ExperienceList, Footer, Skills, Work } from "@/components/sections";
import { isLocale } from "@/lib/i18n";
import styles from "./home.module.css";

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return (
    <>
      {/* The point cloud sits behind the page; the text scrolls over it. */}
      <ScanPanel lang={lang} />
      <main id="content" className={styles.column}>
        <Hero lang={lang} />
        <About lang={lang} />
        <Work lang={lang} />
        <ExperienceList lang={lang} />
        <Skills lang={lang} />
        <EducationList lang={lang} />
        <Contact lang={lang} />
      </main>
      <ScanTracker />
      <Footer />
    </>
  );
}
