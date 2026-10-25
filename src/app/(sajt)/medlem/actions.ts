"use server";

import { redirect } from "next/navigation";
import { updateTag } from "next/cache";
import { ARRANGORER, type Arrangor } from "@/lib/event";
import { kravMedlem } from "@/lib/medlem";
import { normaliseraEpost } from "@/lib/prenumeration";
import { adminKlient, inloggadKlient } from "@/lib/supabase/klienter";
import { franFalt } from "@/lib/tid";

export type FormularLage = { fel?: string; klart?: string };

const text = (formular: FormData, namn: string) => String(formular.get(namn) ?? "").trim();

// Event skrivs med besökarens egen session, så databasens radsäkerhet avgör
// behörigheten. kravMedlem() ovanpå ger bara ett tydligare fel.
export async function sparaEvent(_: FormularLage, formular: FormData): Promise<FormularLage> {
  await kravMedlem();

  const id = text(formular, "id");
  const startar = franFalt(text(formular, "startar"));
  const slutar = text(formular, "slutar") ? franFalt(text(formular, "slutar")) : null;
  const arrangor = text(formular, "arrangor") as Arrangor;
  const lank = text(formular, "lank") || null;

  if (text(formular, "titel").length < 3) return { fel: "Titeln behöver minst tre tecken." };
  if (!startar) return { fel: "Ange när eventet börjar." };
  if (slutar && slutar <= startar) return { fel: "Sluttiden måste ligga efter starttiden." };
  if (!(arrangor in ARRANGORER)) return { fel: "Välj arrangör." };
  if (lank && !lank.startsWith("https://")) return { fel: "Länken måste börja med https://" };

  const rad = {
    titel: text(formular, "titel"),
    beskrivning: text(formular, "beskrivning"),
    startar,
    slutar,
    plats: text(formular, "plats"),
    arrangor,
    lank,
    publicerad: formular.get("publicerad") === "ja",
  };

  const supabase = await inloggadKlient();
  const { error } = id
    ? await supabase.from("event").update(rad).eq("id", id)
    : await supabase.from("event").insert(rad);
  if (error) {
    console.error("Supabase: eventet gick inte att spara", error);
    return { fel: "Eventet gick inte att spara. Försök igen." };
  }

  updateTag("event");
  redirect("/medlem");
}

export async function raderaEvent(formular: FormData) {
  await kravMedlem();
  const supabase = await inloggadKlient();
  const { error } = await supabase.from("event").delete().eq("id", text(formular, "id"));
  if (error) throw new Error(`Eventet gick inte att ta bort: ${error.message}`);
  updateTag("event");
  redirect("/medlem");
}

export async function uppdateraProfil(_: FormularLage, formular: FormData): Promise<FormularLage> {
  const medlem = await kravMedlem();
  const namn = text(formular, "namn");
  if (!namn) return { fel: "Namnet kan inte vara tomt." };

  const supabase = await inloggadKlient();
  const { error } = await supabase
    .from("medlemmar")
    .update({ namn, roll: text(formular, "roll"), visas_publikt: formular.get("visas_publikt") === "ja" })
    .eq("id", medlem.id);
  if (error) return { fel: "Profilen gick inte att spara." };

  updateTag("medlemmar");
  return { klart: "Sparat." };
}

// Att lägga till och ta bort konton kräver den hemliga nyckeln. Alla medlemmar
// får göra det: nätverket har inga fasta roller.
export async function laggTillMedlem(_: FormularLage, formular: FormData): Promise<FormularLage> {
  await kravMedlem();
  const epost = normaliseraEpost(formular.get("epost"));
  const namn = text(formular, "namn");
  if (!epost) return { fel: "Det ser inte ut som en e-postadress." };
  if (!namn) return { fel: "Skriv personens namn." };

  const admin = adminKlient();
  const { data, error } = await admin.auth.admin.createUser({ email: epost, email_confirm: true });
  if (error || !data.user) {
    return { fel: error?.code === "email_exists" ? "Adressen finns redan." : "Kontot gick inte att skapa." };
  }

  const { error: radFel } = await admin
    .from("medlemmar")
    .insert({ id: data.user.id, namn, roll: text(formular, "roll") });
  if (radFel) {
    await admin.auth.admin.deleteUser(data.user.id);
    return { fel: "Medlemmen gick inte att spara." };
  }

  updateTag("medlemmar");
  return { klart: `${namn} är tillagd och kan logga in med ${epost}.` };
}

export async function taBortMedlem(formular: FormData) {
  const medlem = await kravMedlem();
  const id = text(formular, "id");
  if (id === medlem.id) throw new Error("Du kan inte ta bort dig själv.");

  // Raden i medlemmar försvinner med kontot (on delete cascade).
  const { error } = await adminKlient().auth.admin.deleteUser(id);
  if (error) throw new Error(`Medlemmen gick inte att ta bort: ${error.message}`);
  updateTag("medlemmar");
  redirect("/medlem/medlemmar");
}
