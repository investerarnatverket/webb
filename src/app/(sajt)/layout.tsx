import Link from "next/link";
import { DEMO, RIKTIGA_EVENT } from "@/lib/demo";

export default function SajtLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      {DEMO && (
        <p className="demo-rad">
          <strong>Utkast.</strong>{" "}
          {RIKTIGA_EVENT
            ? "Prenumerationen är inte igång än, så formuläret skickar ingenting."
            : "Eventen är påhittade exempel och formulären skickar ingenting."}{" "}
          <Link href="/forslag">Se designförslagen</Link>
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
    </>
  );
}
