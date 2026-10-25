import type { Metadata } from "next";
import { Band } from "@/components/Band";
import { EventLista } from "@/components/EventLista";
import { Prenumerera } from "@/components/Prenumerera";
import { kommandeEvent } from "@/lib/event";

export const metadata: Metadata = {
  title: "Event",
  description: "Kommande event från Investerarnätverket, Aktiespararna och Unga Aktiesparare i Göteborg och Västra Götaland.",
};

export default async function AllaEvent() {
  const event = await kommandeEvent();

  return (
    <>
      <Band
        rubrik="Kommande event"
        ingress="Våra egna träffar och de vi delar från Aktiespararna och Unga Aktiesparare. Anmälan sker hos arrangören."
      />
      <main>
        <section className="sektion">
          <div className="inner">
            <EventLista event={event} />
          </div>
        </section>
        <section id="utskick" className="sektion" aria-labelledby="rubrik-utskick">
          <div className="inner">
            <div className="utskick">
              <h2 id="rubrik-utskick">Få nästa event i mejlen</h2>
              <Prenumerera />
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
