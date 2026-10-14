import { notFound } from "next/navigation";
import { Hero } from "@/components/Hero";
import { About, Contact, EducationList, ExperienceList, Footer, Skills, Work } from "@/components/sections";
import { isLocale } from "@/lib/i18n";

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return (
    <>
      <main id="content">
        <Hero lang={lang} />
        <About lang={lang} />
        <Work lang={lang} />
        <ExperienceList lang={lang} />
        <Skills lang={lang} />
        <EducationList lang={lang} />
        <Contact lang={lang} />
      </main>
      <Footer />
    </>
  );
}
