import { NextResponse, type NextRequest } from "next/server";
import { Resend } from "resend";
import { miljo } from "@/lib/miljo";
import { lasToken } from "@/lib/prenumeration";

// GET från länken i bekräftelsemejlet. Först här hamnar adressen i Resend.
//
// Länkskannrar (t.ex. Outlooks Safe Links) öppnar länkar innan människan gör
// det. Det är ofarligt här: att bekräfta två gånger ger samma resultat.
export async function GET(request: NextRequest) {
  const tillbaka = (sida: string) => NextResponse.redirect(new URL(sida, request.url), 303);

  const epost = lasToken(request.nextUrl.searchParams.get("t") ?? "");
  if (!epost) return tillbaka("/prenumerera/ogiltig");

  const resend = new Resend(miljo.resendNyckel());
  const segment = miljo.resendSegment();
  const skapad = await resend.contacts.create({
    email: epost,
    unsubscribed: false,
    segments: segment ? [{ id: segment }] : undefined,
  });

  if (skapad.error) {
    // Finns kontakten redan (t.ex. avregistrerad tidigare) väcker vi den i stället.
    const uppdaterad = await resend.contacts.update({ email: epost, unsubscribed: false });
    if (uppdaterad.error) {
      console.error("Resend: kunde inte spara kontakten", skapad.error, uppdaterad.error);
      return tillbaka("/prenumerera/ogiltig");
    }
    if (segment) await resend.contacts.segments.add({ email: epost, segmentId: segment });
  }

  return tillbaka("/prenumerera/klart");
}
