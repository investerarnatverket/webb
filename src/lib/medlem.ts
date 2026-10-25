import "server-only";
import { redirect } from "next/navigation";
import { inloggadKlient } from "@/lib/supabase/klienter";

export type Medlem = { id: string; namn: string; roll: string; visasPublikt: boolean };

// Inloggad OCH med en rad i medlemmar. Ett konto utan rad (t.ex. borttagen
// medlem med kvarvarande session) räknas inte.
export async function hamtaMedlem(): Promise<Medlem | null> {
  const supabase = await inloggadKlient();
  const { data: anvandare } = await supabase.auth.getUser();
  if (!anvandare.user) return null;

  const { data } = await supabase
    .from("medlemmar")
    .select("id, namn, roll, visas_publikt")
    .eq("id", anvandare.user.id)
    .maybeSingle();
  if (!data) return null;
  return { id: data.id, namn: data.namn, roll: data.roll, visasPublikt: data.visas_publikt };
}

export async function kravMedlem(): Promise<Medlem> {
  const medlem = await hamtaMedlem();
  if (!medlem) redirect("/logga-in");
  return medlem;
}
