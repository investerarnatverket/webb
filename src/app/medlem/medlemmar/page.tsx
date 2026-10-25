import { Suspense } from "react";
import { kravMedlem } from "@/lib/medlem";
import { inloggadKlient } from "@/lib/supabase/klienter";
import { taBortMedlem } from "../actions";
import { NyMedlem, Profil } from "./Formular";

export default function Medlemmar() {
  return (
    <main className="smal">
      <h1>Medlemmar</h1>
      <Suspense fallback={<p className="laddar">Hämtar…</p>}>
        <Innehall />
      </Suspense>
    </main>
  );
}

async function Innehall() {
  const jag = await kravMedlem();
  const supabase = await inloggadKlient();
  const { data, error } = await supabase.from("medlemmar").select("id, namn, roll, visas_publikt").order("namn");
  if (error) throw new Error(error.message);

  return (
    <>
      <ul className="admin-lista">
        {data.map((m) => (
          <li key={m.id} className="medlem-rad">
            <span>
              <span className="admin-titel">{m.namn}</span>
              <span className="admin-meta">
                {m.roll || "Ingen roll angiven"}
                {m.visas_publikt && " · syns på Om oss"}
              </span>
            </span>
            {m.id !== jag.id && (
              <form action={taBortMedlem}>
                <input type="hidden" name="id" value={m.id} />
                <button className="lank-knapp fara-text">Ta bort</button>
              </form>
            )}
          </li>
        ))}
      </ul>

      <h2>Lägg till medlem</h2>
      <p className="hjalp">Personen loggar sedan in med sin e-post och får en kod. Inget mejl skickas nu.</p>
      <NyMedlem />

      <h2>Din profil</h2>
      <Profil namn={jag.namn} roll={jag.roll} visasPublikt={jag.visasPublikt} />
    </>
  );
}
