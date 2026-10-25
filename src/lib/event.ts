import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { publikKlient } from "@/lib/supabase/klienter";

export const ARRANGORER = {
  natverket: "Investeringsnätverket",
  aktiespararna: "Aktiespararna",
  unga_aktiespararna: "Unga Aktiespararna",
  annan: "Annan arrangör",
} as const;

export type Arrangor = keyof typeof ARRANGORER;

export type Event = {
  id: string;
  titel: string;
  beskrivning: string;
  startar: string;
  slutar: string | null;
  plats: string;
  arrangor: Arrangor;
  lank: string | null;
  publicerad: boolean;
};

export const EVENT_KOLUMNER = "id, titel, beskrivning, startar, slutar, plats, arrangor, lank, publicerad";

// Publicerade event som inte är över. Cachas på servern och töms med
// updateTag("event") när en medlem sparar, så besökarna ser ändringen direkt.
export async function kommandeEvent(max?: number): Promise<Event[]> {
  "use cache";
  cacheTag("event");
  cacheLife("hours");

  // Ett event räknas som pågående i sex timmar efter start om sluttid saknas.
  const grans = new Date(Date.now() - 6 * 3600_000).toISOString();
  let fraga = publikKlient()
    .from("event")
    .select(EVENT_KOLUMNER)
    .eq("publicerad", true)
    .gte("startar", grans)
    .order("startar");
  if (max) fraga = fraga.limit(max);

  const { data, error } = await fraga;
  if (error) throw new Error(`Kunde inte hämta event: ${error.message}`);
  return data as Event[];
}

export type PublikMedlem = { namn: string; roll: string };

export async function publikaMedlemmar(): Promise<PublikMedlem[]> {
  "use cache";
  cacheTag("medlemmar");
  cacheLife("days");

  const { data, error } = await publikKlient()
    .from("medlemmar")
    .select("namn, roll")
    .eq("visas_publikt", true)
    .order("namn");
  if (error) throw new Error(`Kunde inte hämta medlemmar: ${error.message}`);
  return data;
}
