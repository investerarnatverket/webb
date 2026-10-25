import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import { DEMO } from "@/lib/demo";
import "./globals.css";

// Outfit: geometriskt som Aktiespararnas Geomanist, men fritt. next/font laddar
// ner det vid bygget och serverar det från sajten, så besökarna gör inga anrop
// till Google.
const typsnitt = Outfit({ subsets: ["latin"], variable: "--typsnitt" });

export const metadata: Metadata = {
  // URL sätts av Netlify vid bygget och gäller tills en egen domän finns.
  metadataBase: new URL(process.env.SAJT_URL ?? process.env.URL ?? "http://localhost:3000"),
  robots: DEMO ? { index: false, follow: false } : undefined,
  title: { default: "Investerarnätverket", template: "%s · Investerarnätverket" },
  description:
    "Investerarnätverket i Göteborg och Västra Götaland: event från Aktiespararna, Unga Aktiesparare och nätverket självt.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="sv" className={typsnitt.variable}>
      <body>{children}</body>
    </html>
  );
}
