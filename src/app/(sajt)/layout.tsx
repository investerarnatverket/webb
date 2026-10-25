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
            : "Eventen är påhittade exempel och formulären skickar ingenting."}
        </p>
      )}
      <header className="sidhuvud">
        <div className="inner">
          <Link href="/" className="ordmarke">
            Investerar<b>nätverket</b>
          </Link>
          <nav aria-label="Huvudmeny">
            <Link href="/event">Event</Link>
            <Link href="/om">Om oss</Link>
          </nav>
        </div>
      </header>
      {children}
      <footer className="sidfot">
        <div className="inner">
          <p>Investerarnätverket är en del av Aktiespararna · Göteborg</p>
          <nav aria-label="Sidfot">
            <Link href="/integritet">Integritet</Link>
            {!DEMO && <Link href="/logga-in">Medlemsinloggning</Link>}
          </nav>
        </div>
      </footer>
    </>
  );
}
