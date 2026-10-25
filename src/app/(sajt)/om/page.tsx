import type { Metadata } from "next";
import { publikaMedlemmar } from "@/lib/event";

export const metadata: Metadata = { title: "Om oss" };

export default async function OmOss() {
  const medlemmar = await publikaMedlemmar();

  return (
    <main className="smal">
      <h1>Om oss</h1>
      <div className="lopande">
        <p>
          Investerarnätverket är en grupp människor mellan 25 och 55 år. Vi är en del av Aktiespararna och
          samarbetar med både Aktiespararna och Unga Aktiesparare. Vi konkurrerar inte med någon av dem.
        </p>
        <p>
          Vi vill vara bryggan mellan de två: när man växer ur Unga Aktiesparare ska det vara lätt att hitta nästa
          sammanhang. Därför samlar vi event från båda på ett ställe, tillsammans med våra egna.
        </p>
        <p>Rollerna i nätverket är lösa. Var och en bidrar med det den kan och har tid med.</p>
      </div>

      {medlemmar.length > 0 && (
        <>
          <h2>Vilka vi är</h2>
          <ul className="personer">
            {medlemmar.map((m) => (
              <li key={m.namn}>
                <span className="person-namn">{m.namn}</span>
                {m.roll && <span className="person-roll">{m.roll}</span>}
              </li>
            ))}
          </ul>
        </>
      )}
    </main>
  );
}
