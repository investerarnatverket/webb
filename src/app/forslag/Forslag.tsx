import Link from "next/link";
import { cacheLife, cacheTag } from "next/cache";
import { EventLista } from "@/components/EventLista";
import { Marke } from "@/components/Marke";
import { Prenumerera } from "@/components/Prenumerera";
import { exempelEvent } from "@/lib/demo";
import { kommandeEvent } from "@/lib/event";

export type Tema = "a" | "b" | "c";

export const FORSLAG: Record<Tema, { namn: string; kort: string }> = {
  a: { namn: "Bryggan", kort: "Övergången från Aktiespararnas blå till Unga Aktiesparares gröna bär allt. Sneda snitt som hos Aktiespararna." },
  b: { namn: "Förtroende", kort: "Närmast Aktiespararna. Ljust och lugnt, stora tunna rubriker, eventen som en lista." },
  c: { namn: "Gemenskap", kort: "Närmast Unga Aktiesparare. Rundat, varmt och grönt, eventen som kort." },
};

// Riktiga event från Outlook om det finns några, annars exempel. Cachad,
// eftersom exemplen räknas fram från dagens datum.
async function forslagsEvent() {
  "use cache";
  cacheTag("event");
  cacheLife({ stale: 300, revalidate: 900, expire: 86400 });
  const riktiga = await kommandeEvent(4);
  return riktiga.length > 0 ? { event: riktiga, arExempel: false } : { event: exempelEvent().slice(0, 4), arExempel: true };
}

// Ett designförslag för startsidan.
export async function Forslag({ tema }: { tema: Tema }) {
  const { event, arExempel } = await forslagsEvent();

  return (
    <div className="forslag" data-tema={tema}>
      <p className="forslag-rad">
        <Link href="/forslag">← Alla förslag</Link>
        <span>
          Förslag {tema.toUpperCase()}: <strong>{FORSLAG[tema].namn}</strong>
        </span>
      </p>

      <header className="f-sidhuvud">
        <Link href={`/forslag/${tema}`} className="f-logga">
          <Marke id={`marke-${tema}`} storlek={tema === "c" ? 34 : 30} />
          <span>
            Investerar<b>nätverket</b>
          </span>
        </Link>
        <nav aria-label="Huvudmeny">
          <a href="#event">Event</a>
          <a href="#om">Om oss</a>
          {tema === "c" && (
            <a href="#utskick" className="f-knapp f-knapp-liten">
              Prenumerera
            </a>
          )}
        </nav>
      </header>

      {tema === "a" && (
        <section className="f-hjalte">
          <div className="f-inner">
            <p className="f-etikett">Göteborg · Västra Götaland</p>
            <h1>Från Unga Aktiesparare till Aktiespararna.</h1>
            <p className="f-ingress">
              Ett nätverk för dig mellan 25 och 55 som vill fortsätta utvecklas som investerare. Vi samlar event från
              båda och ses själva på AW var tredje torsdag.
            </p>
            <div className="f-knappar">
              <a href="#event" className="f-knapp">
                Se kommande event
              </a>
              <a href="#utskick" className="f-knapp f-knapp-sekundar">
                Få dem i mejlen
              </a>
            </div>
          </div>
          <svg className="f-bage-stor" viewBox="0 0 400 220" aria-hidden="true">
            <path d="M20 210 A180 180 0 0 1 380 210" />
          </svg>
        </section>
      )}

      {tema === "b" && (
        <section className="f-hjalte">
          <div className="f-inner">
            <h1>
              Sparare i Västra Götaland. <span>Från första fonden till egen portfölj.</span>
            </h1>
            <p className="f-ingress">
              Investerarnätverket är en del av Aktiespararna, för dig mellan 25 och 55. Vi samlar event från
              Aktiespararna och Unga Aktiesparare och ses på AW var tredje torsdag.
            </p>
            <a href="#event" className="f-knapp">
              Kommande event →
            </a>
          </div>
        </section>
      )}

      {tema === "c" && (
        <section className="f-hjalte">
          <div className="f-inner">
            <div className="f-cirkel">
              <Marke id="marke-c-stor" storlek={64} />
            </div>
            <h1>Fortsätt investera. Tillsammans.</h1>
            <p className="f-ingress">För dig mellan 25 och 55 som har vuxit ur Unga Aktiesparare, eller aldrig varit med.</p>
            <ul className="f-chips">
              <li>📍 Göteborg och Västra Götaland</li>
              <li>🍻 AW var tredje torsdag</li>
              <li>📅 Event från Aktiespararna och Unga Aktiesparare</li>
            </ul>
            <div className="f-knappar">
              <a href="#event" className="f-knapp">
                Se kommande event
              </a>
              <a href="#om" className="f-knapp f-knapp-sekundar">
                Vilka är vi?
              </a>
            </div>
          </div>
        </section>
      )}

      <main className="f-innehall">
        <section id="event" className="f-sektion f-event" aria-labelledby={`rubrik-event-${tema}`}>
          {tema === "b" && <span className="f-lodrat" aria-hidden="true">Aktiviteter</span>}
          <div>
            <div className="f-rubrikrad">
              <h2 id={`rubrik-event-${tema}`}>{tema === "c" ? "Det här händer snart" : "Kommande event"}</h2>
              {arExempel && <span className="f-exempel">Exempel</span>}
            </div>
            <EventLista event={event} />
          </div>
        </section>

        <section id="om" className="f-sektion f-om" aria-labelledby={`rubrik-om-${tema}`}>
          {tema === "b" && <span className="f-lodrat" aria-hidden="true">Om oss</span>}
          <div>
            <h2 id={`rubrik-om-${tema}`}>{tema === "c" ? "Vilka är vi?" : "Om nätverket"}</h2>
            <ul className="f-fakta">
              <li>
                <b>25–55 år</b>
                <span>För dig som har vuxit ur Unga Aktiesparare eller vill hitta fler att prata sparande med.</span>
              </li>
              <li>
                <b>En del av Aktiespararna</b>
                <span>Vi samarbetar med Aktiespararna och Unga Aktiesparare och konkurrerar inte med någon av dem.</span>
              </li>
              <li>
                <b>Lösa roller</b>
                <span>Var och en bidrar med det den kan och har tid med, från att hitta event till att ordna AW.</span>
              </li>
            </ul>
          </div>
        </section>

        <section id="utskick" className="f-sektion f-utskick" aria-labelledby={`rubrik-utskick-${tema}`}>
          <div>
            <h2 id={`rubrik-utskick-${tema}`}>Få nästa event i mejlen</h2>
            <p>Ett kort mejl när något nytt är på gång. Inget annat.</p>
            <Prenumerera />
          </div>
        </section>
      </main>

      <footer className="f-sidfot">
        <span className="f-logga">
          <Marke id={`marke-fot-${tema}`} storlek={24} />
          <span>
            Investerar<b>nätverket</b>
          </span>
        </span>
        <p>En del av Aktiespararna · Göteborg</p>
      </footer>
    </div>
  );
}
