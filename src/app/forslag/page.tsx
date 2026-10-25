import Link from "next/link";
import { Marke } from "@/components/Marke";
import { FORSLAG, type Tema } from "./Forslag";

// Översikten som visas för gruppen: de tre förslagen bredvid varandra i
// telefonstorlek, med länk till var och en i helskärm.
export default function Forslagsoversikt() {
  return (
    <div className="oversikt">
      <header className="oversikt-huvud">
        <Marke id="marke-oversikt" storlek={40} />
        <h1>Tre designförslag</h1>
        <p>
          Investerarnätverket ska kännas som något eget men höra ihop med Aktiespararna och Unga Aktiesparare. Alla tre
          bygger på samma idé: nätverket är bryggan mellan dem, så märket är en båge från Aktiespararnas blå till Unga
          Aktiesparares gröna. Eventen i förslagen är exempel tills det finns riktiga i kalendern.
        </p>
        <p className="oversikt-tillbaka">
          <Link href="/">Till nuvarande utkast</Link>
        </p>
      </header>
      <ol className="oversikt-lista">
        {(Object.keys(FORSLAG) as Tema[]).map((tema) => (
          <li key={tema}>
            <div className="oversikt-text">
              <h2>
                <span>{tema.toUpperCase()}</span> {FORSLAG[tema].namn}
              </h2>
              <p>{FORSLAG[tema].kort}</p>
              <Link href={`/forslag/${tema}`}>Öppna förslag {tema.toUpperCase()} i helskärm</Link>
            </div>
            <div className="oversikt-telefon">
              <iframe src={`/forslag/${tema}`} title={`Förslag ${tema.toUpperCase()}: ${FORSLAG[tema].namn}`} loading="lazy" />
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
