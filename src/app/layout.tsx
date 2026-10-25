import type { Metadata } from "next";
import Link from "next/link";
import { Schibsted_Grotesk } from "next/font/google";
import { DEMO, RIKTIGA_EVENT } from "@/lib/demo";
import "./globals.css";

// next/font laddar ner typsnittet vid bygget och serverar det från sajten,
// så besökarna gör inga anrop till Google.
const typsnitt = Schibsted_Grotesk({ subsets: ["latin"], variable: "--typsnitt" });

export const metadata: Metadata = {
  // URL sätts av Netlify vid bygget och gäller tills en egen domän finns.
  metadataBase: new URL(process.env.SAJT_URL ?? process.env.URL ?? "http://localhost:3000"),
  robots: DEMO ? { index: false, follow: false } : undefined,
  title: { default: "Investerarnätverket", template: "%s · Investerarnätverket" },
  description:
    "Event och information från Aktiespararna och Unga Aktiespararna, samlat av ett nätverk som vill vara bryggan mellan dem.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="sv" className={typsnitt.variable}>
      <body>
        {DEMO && (
          <p className="demo-rad">
            <strong>Utkast.</strong>{" "}
            {RIKTIGA_EVENT
              ? "Prenumerationen är inte igång än, så formuläret skickar ingenting."
              : "Eventen är påhittade exempel och formulären skickar ingenting."}
          </p>
        )}
        <header className="sidhuvud">
          <Link href="/" className="ordmarke">
            Investerar<span>nätverket</span>
          </Link>
          <nav aria-label="Huvudmeny">
            <Link href="/event">Event</Link>
            <Link href="/om">Om oss</Link>
          </nav>
        </header>
        {children}
        <footer className="sidfot">
          <p>Investerarnätverket är en del av Aktiespararna.</p>
          <nav aria-label="Sidfot">
            <Link href="/integritet">Integritet</Link>
            {!DEMO && <Link href="/logga-in">Medlemsinloggning</Link>}
          </nav>
        </footer>
      </body>
    </html>
  );
}
