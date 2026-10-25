"use client";

import { useActionState } from "react";
import { laggTillMedlem, uppdateraProfil, type FormularLage } from "../actions";

function Besked({ lage }: { lage: FormularLage }) {
  if (lage.fel) return <p className="fel" role="alert">{lage.fel}</p>;
  if (lage.klart) return <p className="klart" role="status">{lage.klart}</p>;
  return null;
}

export function NyMedlem() {
  const [lage, spara, sparar] = useActionState<FormularLage, FormData>(laggTillMedlem, {});
  return (
    <form action={spara} className="formular">
      <label>
        Namn
        <input name="namn" required maxLength={80} />
      </label>
      <label>
        E-post
        <input type="email" name="epost" required />
      </label>
      <label>
        Roll <span className="valfri">t.ex. eventansvarig, kontakt mot Unga Aktiesparare</span>
        <input name="roll" maxLength={80} />
      </label>
      <Besked lage={lage} />
      <button disabled={sparar}>{sparar ? "Lägger till…" : "Lägg till"}</button>
    </form>
  );
}

export function Profil({ namn, roll, visasPublikt }: { namn: string; roll: string; visasPublikt: boolean }) {
  const [lage, spara, sparar] = useActionState<FormularLage, FormData>(uppdateraProfil, {});
  return (
    <form action={spara} className="formular">
      <label>
        Namn
        <input name="namn" defaultValue={namn} required maxLength={80} />
      </label>
      <label>
        Roll
        <input name="roll" defaultValue={roll} maxLength={80} />
      </label>
      <label className="kryss">
        <input type="checkbox" name="visas_publikt" value="ja" defaultChecked={visasPublikt} />
        Visa mitt namn och min roll på sidan Om oss
      </label>
      <Besked lage={lage} />
      <button disabled={sparar}>{sparar ? "Sparar…" : "Spara"}</button>
    </form>
  );
}
