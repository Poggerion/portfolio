import { basePath } from "@/lib/site";
import { defaultLocale } from "@/lib/i18n";

/** The site lives under /fr/ and /en/. Static hosts cannot redirect, so the root page does it. */
export default function RootPage() {
  const target = `${basePath}/${defaultLocale}/`;
  return (
    <>
      <meta httpEquiv="refresh" content={`0; url=${target}`} />
      <script
        dangerouslySetInnerHTML={{
          __html: `(function(){var l=(navigator.language||"").slice(0,2)==="en"?"en":"fr";location.replace(${JSON.stringify(basePath)}+"/"+l+"/"+location.hash);})();`,
        }}
      />
      <p style={{ padding: "2rem", fontFamily: "system-ui" }}>
        <a href={target}>Felipe Portugal</a>
      </p>
    </>
  );
}
