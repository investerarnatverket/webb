"use client";

import { useActionState } from "react";
import { sparaEvent, type FormularLage } from "./actions";

type Varden = {
  id?: string;
  titel?: string;
  beskrivning?: string;
  startar?: string;
  slutar?: string;
  plats?: string;
  arrangor?: string;
  lank?: string;
  publicerad?: boolean;
};

export function EventFormular({ varden = {}, arrangorer }: { varden?: Varden; arrangorer: Record<string, string> }) {
  const [lage, spara, sparar] = useActionState<FormularLage, FormData>(sparaEvent, {});

  return (
    <form action={spara} className="formular">
      {varden.id && <input type="hidden" name="id" value={varden.id} />}
      <label>
        Titel
        <input name="titel" defaultValue={varden.titel} required minLength={3} maxLength={140} />
      </label>
      <label>
        Arrangör
        <select name="arrangor" defaultValue={varden.arrangor ?? "natverket"}>
          {Object.entries(arrangorer).map(([nyckel, namn]) => (
            <option key={nyckel} value={nyckel}>
              {namn}
            </option>
          ))}
        </select>
      </label>
      <div className="falt-rad">
        <label>
          Börjar
          <input type="datetime-local" name="startar" defaultValue={varden.startar} required />
        </label>
        <label>
          Slutar <span className="valfri">valfritt</span>
          <input type="datetime-local" name="slutar" defaultValue={varden.slutar} />
        </label>
      </div>
      <label>
        Plats
        <input name="plats" defaultValue={varden.plats} maxLength={200} placeholder="Adress, stad eller Digitalt" />
      </label>
      <label>
        Beskrivning
        <textarea name="beskrivning" defaultValue={varden.beskrivning} rows={6} maxLength={4000} />
      </label>
      <label>
        Länk <span className="valfri">anmälan eller arrangörens sida</span>
        <input type="url" name="lank" defaultValue={varden.lank} placeholder="https://" />
      </label>
      <label className="kryss">
        <input type="checkbox" name="publicerad" value="ja" defaultChecked={varden.publicerad} />
        Publicera på sajten
      </label>
      {lage.fel && <p className="fel" role="alert">{lage.fel}</p>}
      <button disabled={sparar}>{sparar ? "Sparar…" : "Spara"}</button>
    </form>
  );
}
