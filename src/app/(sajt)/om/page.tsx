import type { Metadata } from "next";
import { Band } from "@/components/Band";
import { Om } from "@/components/Om";
import { publikaMedlemmar } from "@/lib/event";

export const metadata: Metadata = { title: "Om oss" };

export default async function OmOss() {
  const medlemmar = await publikaMedlemmar();

  return (
    <>
      <Band rubrik="Om oss" ingress="Bryggan mellan Unga Aktiesparare och Aktiespararna, i Göteborg och Västra Götaland." />
      <main>
        <section className="sektion">
          <div className="inner smal lopande">
            <p>
              Investerarnätverket är en grupp människor mellan 25 och 55 år. Vi är en del av Aktiespararna och
              samarbetar med både Aktiespararna och Unga Aktiesparare. Vi konkurrerar inte med någon av dem.
            </p>
            <p>
              Vi vill vara bryggan mellan de två: när man växer ur Unga Aktiesparare ska det vara lätt att hitta nästa
              sammanhang. Därför samlar vi event från båda på ett ställe, tillsammans med våra egna och gemensamma
              bolagsbesök och bolagsstämmor.
            </p>
          </div>
        </section>
        <section className="sektion sektion-vit">
          <div className="inner">
            <Om />
          </div>
        </section>
        {medlemmar.length > 0 && (
          <section className="sektion" aria-labelledby="rubrik-vilka">
            <div className="inner smal">
              <h2 id="rubrik-vilka">Vilka vi är</h2>
              <ul className="personer">
                {medlemmar.map((m) => (
                  <li key={m.namn}>
                    <span className="person-namn">{m.namn}</span>
                    {m.roll && <span className="person-roll">{m.roll}</span>}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}
      </main>
    </>
  );
}
