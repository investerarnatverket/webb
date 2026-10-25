"use server";

import { Resend } from "resend";
import { miljo } from "@/lib/miljo";
import { normaliseraEpost, skapaToken } from "@/lib/prenumeration";

export type PrenumerationsLage = { status: "tom" | "skickad" | "fel"; meddelande?: string };

export async function prenumerera(_: PrenumerationsLage, formular: FormData): Promise<PrenumerationsLage> {
  // Fältet "webbplats" är dolt för människor. Fyller någon i det är det en bot,
  // och då låtsas vi att allt gick bra utan att skicka något.
  if (formular.get("webbplats")) return { status: "skickad" };

  const epost = normaliseraEpost(formular.get("epost"));
  if (!epost) return { status: "fel", meddelande: "Det ser inte ut som en e-postadress." };
  if (formular.get("samtycke") !== "ja") {
    return { status: "fel", meddelande: "Kryssa i rutan så att vi vet att det är okej att mejla dig." };
  }

  const lank = `${miljo.sajtUrl()}/prenumerera/bekrafta?t=${encodeURIComponent(skapaToken(epost))}`;
  const { error } = await new Resend(miljo.resendNyckel()).emails.send({
    from: miljo.resendFran(),
    to: epost,
    replyTo: miljo.kontaktEpost(),
    subject: "Bekräfta din prenumeration",
    text: [
      "Hej!",
      "",
      "Någon, förhoppningsvis du, vill få mejl från Investerarnätverket om kommande event.",
      "Bekräfta med länken nedan. Den gäller i tre dygn.",
      "",
      lank,
      "",
      "Var det inte du? Då kan du strunta i det här mejlet. Utan bekräftelse sparar vi ingenting.",
    ].join("\n"),
  });

  if (error) {
    console.error("Resend: bekräftelsemejlet gick inte iväg", error);
    return { status: "fel", meddelande: "Mejlet gick inte att skicka just nu. Försök igen om en stund." };
  }
  return { status: "skickad" };
}
