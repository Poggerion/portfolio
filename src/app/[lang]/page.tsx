import { Suspense } from "react";
import { notFound } from "next/navigation";
import { CreativeLayer } from "@/components/creative/CreativeLayer";
import { Hero } from "@/components/Hero";
import { SculptureStage } from "@/components/sculpture/SculptureStage";
import { About, Contact, EducationList, ExperienceList, Footer, Skills, Work } from "@/components/sections";
import { creativeData } from "@/lib/creative-data";
import { isLocale } from "@/lib/i18n";

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const creative = creativeData(lang);
  return (
    <>
      <SculptureStage />
      {/* data-pro-only: made inert by the mode controller while the creative mode is open. */}
      <div className="editorial" data-pro-only>
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
      </div>
      <Suspense fallback={null}>
        <CreativeLayer {...creative} />
      </Suspense>
    </>
  );
}
