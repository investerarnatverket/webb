import type { Event } from "@/lib/event";
import { franFalt, tillFalt } from "@/lib/tid";

// Demoläge: utkastet som visas för gruppen innan Supabase och Resend finns.
// Slås på med DEMO=1 (netlify.toml) och bakas in vid bygget via next.config.ts,
// eftersom Netlify inte ger funktionerna netlify.toml-variabler vid körning.
export const DEMO = process.env.DEMO === "1";

// Med en Outlook-kalender kopplad är eventen riktiga även i demoläget.
export const RIKTIGA_EVENT = Boolean(process.env.KALENDER_ICS_URL);

const DAG = 86400_000;

// Påhittade exempel för utkastet och designförslagen, märkta som exempel där de
// visas. Datumen räknas från idag så att det alltid finns kommande event.
export function exempelEvent(): Event[] {
  // Klockslag i svensk tid, så att sommar- och vintertid blir rätt.
  const kl = (dagar: number, timme: number, minut = 0) => {
    const datum = tillFalt(new Date(Date.now() + dagar * DAG).toISOString()).slice(0, 10);
    const tid = `${String(timme).padStart(2, "0")}:${String(minut).padStart(2, "0")}`;
    return franFalt(`${datum}T${tid}`)!;
  };
  // Nästa torsdag minst två dagar bort, i svensk tid.
  const veckodag = new Date(kl(0, 12)).getUTCDay();
  let torsdag = (4 - veckodag + 7) % 7;
  if (torsdag < 2) torsdag += 7;

  const ev = (id: string, falt: Omit<Event, "id" | "publicerad" | "lank"> & { lank?: string | null }): Event => ({
    id,
    lank: null,
    publicerad: true,
    ...falt,
  });
  return [
    ev("exempel-2", {
      titel: "Bolagskväll med tre presentationer",
      beskrivning: "Tre noterade bolag presenterar sig och svarar på frågor. Anmälan hos Aktiespararna.",
      startar: kl(torsdag + 5, 18),
      slutar: kl(torsdag + 5, 20, 30),
      plats: "Göteborg",
      arrangor: "aktiespararna",
    }),
    ev("exempel-3", {
      titel: "Kom igång med fondsparande",
      beskrivning: "Indexfonder, avgifter och hur man tänker kring risk. Anmälan hos Unga Aktiesparare.",
      startar: kl(torsdag + 12, 18),
      slutar: null,
      plats: "Göteborg",
      arrangor: "unga_aktiespararna",
    }),
    ev("exempel-4", {
      titel: "Så läser du en årsredovisning",
      beskrivning: "Vi går igenom resultat- och balansräkning med ett svenskt bolag som exempel. Ingen förkunskap behövs.",
      startar: kl(torsdag + 15, 18),
      slutar: kl(torsdag + 15, 20),
      plats: "Göteborg",
      arrangor: "natverket",
    }),
    ev("exempel-stamma", {
      titel: "Gemensamt besök på årsstämman i Exempelbolaget",
      beskrivning: "Vi går tillsammans. Anmälan till stämman görs hos bolaget.",
      startar: kl(torsdag + 21, 15),
      slutar: kl(torsdag + 21, 17),
      plats: "Göteborg",
      arrangor: "annan",
      arrangorNamn: "Exempelbolaget",
    }),
  ];
}
