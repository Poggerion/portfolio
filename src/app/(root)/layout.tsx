import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: "Felipe Portugal",
  robots: { index: false },
};

export default function RootRedirectLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr-CA">
      <body>{children}</body>
    </html>
  );
}
