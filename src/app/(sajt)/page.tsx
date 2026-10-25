import Link from "next/link";
import { EventLista } from "@/components/EventLista";
import { Prenumerera } from "@/components/Prenumerera";
import { kommandeEvent } from "@/lib/event";

export default async function Start() {
  const event = await kommandeEvent(4);

  return (
    <main>
      <section className="hero">
        <h1>
          Bryggan mellan <span className="unga">Unga Aktiesparare</span> och{" "}
          <span className="aktiespararna">Aktiespararna</span>.
        </h1>
        <p className="ingress">
          Vi är ett nätverk i åldrarna 25 till 55 som samlar event från båda på ett ställe, så att du hittar
          rätt sammanhang oavsett var du är i ditt sparande.
        </p>
      </section>

      <section aria-labelledby="kommande">
        <div className="rubrik-rad">
          <h2 id="kommande">Kommande event</h2>
          {event.length > 0 && <Link href="/event">Alla event</Link>}
        </div>
        <EventLista event={event} />
      </section>

      <section className="ruta" aria-labelledby="utskick">
        <h2 id="utskick">Få nästa event i mejlen</h2>
        <p>Ett kort mejl när något nytt är på gång. Inget annat.</p>
        <Prenumerera />
      </section>
    </main>
  );
}
