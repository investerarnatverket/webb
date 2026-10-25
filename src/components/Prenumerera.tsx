"use client";

import { useActionState } from "react";
import Link from "next/link";
import { prenumerera, type PrenumerationsLage } from "@/app/prenumerera/actions";

export function Prenumerera() {
  const [lage, skicka, skickar] = useActionState<PrenumerationsLage, FormData>(prenumerera, { status: "tom" });

  if (lage.status === "skickad") {
    return (
      <p className="klart" role="status">
        Kolla inkorgen. Klicka på länken i mejlet för att börja få utskicken.
      </p>
    );
  }

  return (
    <form action={skicka} className="prenumerera">
      <div className="prenumerera-rad">
        <label className="dold-etikett" htmlFor="pren-epost">
          E-post
        </label>
        <input id="pren-epost" type="email" name="epost" placeholder="din@epost.se" autoComplete="email" required />
        <button disabled={skickar}>{skickar ? "Skickar…" : "Prenumerera"}</button>
      </div>
      {/* Fälla för botar: dold för människor och skärmläsare. */}
      <input type="text" name="webbplats" tabIndex={-1} autoComplete="off" aria-hidden="true" className="falla" />
      <label className="kryss liten">
        <input type="checkbox" name="samtycke" value="ja" required />
        <span>
          Ja, mejla mig om kommande event. Jag kan avsluta när som helst. <Link href="/integritet">Så hanterar vi din adress</Link>
        </span>
      </label>
      {lage.status === "fel" && <p className="fel" role="alert">{lage.meddelande}</p>}
    </form>
  );
}
