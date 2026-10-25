import Link from "next/link";
import { Band } from "@/components/Band";
import { EventLista } from "@/components/EventLista";
import { Om } from "@/components/Om";
import { Prenumerera } from "@/components/Prenumerera";
import { kommandeEvent } from "@/lib/event";

export default async function Start() {
  const event = await kommandeEvent(4);

  return (
    <>
      <Band
        stor
        etikett="Göteborg · Västra Götaland"
        rubrik="Från Unga Aktiesparare till Aktiespararna."
        ingress="Ett nätverk för dig mellan 25 och 55 som vill fortsätta utvecklas som investerare. Vi samlar event från båda och ses själva på AW var tredje torsdag."
      >
        <div className="knappar">
          <a href="#event" className="knapp">
            Se kommande event
          </a>
          <a href="#utskick" className="knapp knapp-sekundar">
            Få dem i mejlen
          </a>
        </div>
      </Band>

      <main>
        <section id="event" className="sektion" aria-labelledby="rubrik-event">
          <div className="inner">
            <div className="rubrik-rad">
              <h2 id="rubrik-event">Kommande event</h2>
              {event.length > 0 && <Link href="/event">Alla event</Link>}
            </div>
            <EventLista event={event} />
          </div>
        </section>

        <section id="om" className="sektion sektion-vit" aria-labelledby="rubrik-om">
          <div className="inner">
            <h2 id="rubrik-om">Om nätverket</h2>
            <Om />
          </div>
        </section>

        <section id="utskick" className="sektion" aria-labelledby="rubrik-utskick">
          <div className="inner">
            <div className="utskick">
              <h2 id="rubrik-utskick">Få nästa event i mejlen</h2>
              <p>Ett kort mejl när något nytt är på gång. Inget annat.</p>
              <Prenumerera />
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
