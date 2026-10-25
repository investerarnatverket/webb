import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { DEMO, exempelEvent } from "@/lib/demo";
import { tolkaKalender } from "@/lib/ical";
import { publikKlient } from "@/lib/supabase/klienter";

export const ARRANGORER = {
  natverket: "Investerarnätverket",
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
  heldag?: boolean;
};

export const EVENT_KOLUMNER = "id, titel, beskrivning, startar, slutar, plats, arrangor, lank, publicerad";

// Event som inte är över. Källan väljs i den här ordningen:
// 1. Den publicerade Outlook-kalendern (KALENDER_ICS_URL), läses om var 15:e minut.
// 2. Påhittade exempel i demoläget.
// 3. Supabase, cachat och tömt med updateTag("event") när en medlem sparar.
export async function kommandeEvent(max?: number): Promise<Event[]> {
  "use cache";
  cacheTag("event");

  const kalender = process.env.KALENDER_ICS_URL;
  if (kalender) {
    cacheLife({ stale: 300, revalidate: 900, expire: 86400 });
    const svar = await fetch(kalender, { headers: { accept: "text/calendar" } });
    if (!svar.ok) throw new Error(`Kunde inte läsa Outlook-kalendern: HTTP ${svar.status}`);
    return tolkaKalender(await svar.text()).slice(0, max);
  }

  cacheLife("hours");
  if (DEMO) return exempelEvent().slice(0, max);

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

  // Inga påhittade personer i utkastet: avsnittet "Vilka vi är" döljs.
  if (DEMO) return [];

  const { data, error } = await publikKlient()
    .from("medlemmar")
    .select("namn, roll")
    .eq("visas_publikt", true)
    .order("namn");
  if (error) throw new Error(`Kunde inte hämta medlemmar: ${error.message}`);
  return data;
}
