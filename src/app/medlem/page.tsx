import { Suspense } from "react";
import Link from "next/link";
import { ARRANGORER, EVENT_KOLUMNER, type Event } from "@/lib/event";
import { kravMedlem } from "@/lib/medlem";
import { inloggadKlient } from "@/lib/supabase/klienter";
import { visaDatum, visaKlocka } from "@/lib/tid";

export default function MedlemStart() {
  return (
    <main>
      <Suspense fallback={<p className="laddar">Hämtar…</p>}>
        <Oversikt />
      </Suspense>
    </main>
  );
}

async function Oversikt() {
  const medlem = await kravMedlem();
  const supabase = await inloggadKlient();
  // Medlemmar ser även utkast och passerade event (RLS släpper fram dem).
  const { data, error } = await supabase
    .from("event")
    .select(EVENT_KOLUMNER)
    .order("startar", { ascending: false })
    .limit(100);
  if (error) throw new Error(error.message);
  const event = data as Event[];

  return (
    <>
      <div className="rubrik-rad">
        <h1>Hej {medlem.namn.split(" ")[0]}</h1>
        <Link href="/medlem/event/ny" className="knapp">
          Nytt event
        </Link>
      </div>
      {event.length === 0 ? (
        <p>Inga event än.</p>
      ) : (
        <ul className="admin-lista">
          {event.map((e) => (
            <li key={e.id}>
              <Link href={`/medlem/event/${e.id}`}>
                <span className="admin-titel">{e.titel}</span>
                <span className="admin-meta">
                  {visaDatum(e.startar)} {visaKlocka(e.startar)} · {ARRANGORER[e.arrangor]}
                  {!e.publicerad && <span className="utkast">Utkast</span>}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
