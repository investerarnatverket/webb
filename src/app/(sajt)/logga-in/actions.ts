"use server";

import { redirect } from "next/navigation";
import { inloggadKlient } from "@/lib/supabase/klienter";
import { normaliseraEpost } from "@/lib/prenumeration";

export type InloggningsLage = { steg: "epost" | "kod"; epost?: string; fel?: string };

// Inloggning med engångskod i stället för magisk länk. Outlooks Safe Links
// öppnar länkar i förväg och förbrukar dem, men en kod som skrivs in klarar sig.
export async function skickaKod(_: InloggningsLage, formular: FormData): Promise<InloggningsLage> {
  const epost = normaliseraEpost(formular.get("epost"));
  if (!epost) return { steg: "epost", fel: "Det ser inte ut som en e-postadress." };

  const supabase = await inloggadKlient();
  // shouldCreateUser: false = bara befintliga medlemmar kan logga in.
  const { error } = await supabase.auth.signInWithOtp({ email: epost, options: { shouldCreateUser: false } });

  // Okänd adress ger "otp_disabled". Den besvaras som om koden skickats, så att
  // formuläret inte avslöjar vilka som är medlemmar.
  if (error && error.code !== "otp_disabled") {
    if (error.status === 429) {
      return { steg: "epost", fel: "För många försök. Vänta en minut och försök igen." };
    }
    console.error("Supabase: koden gick inte att skicka", error);
    return { steg: "epost", fel: "Koden gick inte att skicka just nu. Försök igen om en stund." };
  }
  return { steg: "kod", epost };
}

export async function verifieraKod(_: InloggningsLage, formular: FormData): Promise<InloggningsLage> {
  const epost = normaliseraEpost(formular.get("epost"));
  const kod = String(formular.get("kod") ?? "").replace(/\s/g, "");
  if (!epost) return { steg: "epost" };

  const supabase = await inloggadKlient();
  const { error } = await supabase.auth.verifyOtp({ email: epost, token: kod, type: "email" });
  if (error) return { steg: "kod", epost, fel: "Koden stämmer inte eller har gått ut." };

  redirect("/medlem");
}

export async function loggaUt() {
  const supabase = await inloggadKlient();
  await supabase.auth.signOut();
  redirect("/");
}
