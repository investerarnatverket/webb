import type { Metadata } from "next";
import { EventLista } from "@/components/EventLista";
import { Prenumerera } from "@/components/Prenumerera";
import { kommandeEvent } from "@/lib/event";

export const metadata: Metadata = {
  title: "Event",
  description: "Kommande event från Investeringsnätverket, Aktiespararna och Unga Aktiespararna.",
};

export default async function AllaEvent() {
  const event = await kommandeEvent();

  return (
    <main>
      <h1>Kommande event</h1>
      <p className="ingress">Våra egna träffar och de vi delar från Aktiespararna och Unga Aktiespararna.</p>
      <EventLista event={event} />
      <section className="ruta" aria-labelledby="utskick">
        <h2 id="utskick">Få nästa event i mejlen</h2>
        <Prenumerera />
      </section>
    </main>
  );
}
