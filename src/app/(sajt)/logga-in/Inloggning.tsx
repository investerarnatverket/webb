"use client";

import { useActionState } from "react";
import { skickaKod, verifieraKod, type InloggningsLage } from "./actions";

export function Inloggning() {
  const [epostLage, skicka, skickar] = useActionState<InloggningsLage, FormData>(skickaKod, { steg: "epost" });
  const [kodLage, verifiera, verifierar] = useActionState<InloggningsLage, FormData>(verifieraKod, { steg: "kod" });

  if (epostLage.steg === "epost") {
    return (
      <form action={skicka} className="formular">
        <label>
          E-post
          <input type="email" name="epost" autoComplete="email" required autoFocus />
        </label>
        {epostLage.fel && <p className="fel" role="alert">{epostLage.fel}</p>}
        <button disabled={skickar}>{skickar ? "Skickar…" : "Skicka kod"}</button>
      </form>
    );
  }

  return (
    <form action={verifiera} className="formular">
      <p>
        Är <strong>{epostLage.epost}</strong> registrerad som medlem har en kod skickats dit. Den gäller i en
        timme.
      </p>
      <input type="hidden" name="epost" value={epostLage.epost} />
      <label>
        Kod
        <input
          name="kod"
          inputMode="numeric"
          autoComplete="one-time-code"
          pattern="[0-9 ]{6,10}"
          required
          autoFocus
        />
      </label>
      {kodLage.fel && <p className="fel" role="alert">{kodLage.fel}</p>}
      <button disabled={verifierar}>{verifierar ? "Kontrollerar…" : "Logga in"}</button>
    </form>
  );
}
