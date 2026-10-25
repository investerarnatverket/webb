import type { Metadata } from "next";
import { Nunito, Outfit, Schibsted_Grotesk } from "next/font/google";
import { DEMO } from "@/lib/demo";
import "./globals.css";

// next/font laddar ner typsnitten vid bygget och serverar dem från sajten,
// så besökarna gör inga anrop till Google. Outfit och Nunito används av
// designförslagen under /forslag; när ett förslag är valt rensas resten bort.
const typsnitt = Schibsted_Grotesk({ subsets: ["latin"], variable: "--typsnitt" });
const geometrisk = Outfit({ subsets: ["latin"], variable: "--typsnitt-geometrisk" });
const rundad = Nunito({ subsets: ["latin"], variable: "--typsnitt-rundad" });

export const metadata: Metadata = {
  // URL sätts av Netlify vid bygget och gäller tills en egen domän finns.
  metadataBase: new URL(process.env.SAJT_URL ?? process.env.URL ?? "http://localhost:3000"),
  robots: DEMO ? { index: false, follow: false } : undefined,
  title: { default: "Investerarnätverket", template: "%s · Investerarnätverket" },
  description:
    "Event och information från Aktiespararna och Unga Aktiesparare, samlat av ett nätverk som vill vara bryggan mellan dem.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="sv" className={`${typsnitt.variable} ${geometrisk.variable} ${rundad.variable}`}>
      <body>{children}</body>
    </html>
  );
}
