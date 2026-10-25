import type { Event } from "@/lib/event";
import { franFalt, tillFalt } from "@/lib/tid";

// Demoläge: utkastet som visas för gruppen innan Supabase och Resend finns.
// Slås på med DEMO=1 (netlify.toml) och bakas in vid bygget via next.config.ts,
// eftersom Netlify inte ger funktionerna netlify.toml-variabler vid körning.
export const DEMO = process.env.DEMO === "1";

// Med en Outlook-kalender kopplad är eventen riktiga även i demoläget.
export const RIKTIGA_EVENT = Boolean(process.env.KALENDER_ICS_URL);

const DAG = 86400_000;

// Påhittade exempel, märkta som sådana i bannern. Datumen räknas från idag så
// att utkastet alltid har kommande event.
export function exempelEvent(): Event[] {
  // Klockslag i svensk tid, så att sommar- och vintertid blir rätt.
  const kl = (dagar: number, timme: number, minut = 0) => {
    const datum = tillFalt(new Date(Date.now() + dagar * DAG).toISOString()).slice(0, 10);
    const tid = `${String(timme).padStart(2, "0")}:${String(minut).padStart(2, "0")}`;
    return franFalt(`${datum}T${tid}`)!;
  };
  return [
    {
      id: "exempel-1",
      titel: "Nätverksträff: Så läser du en årsredovisning",
      beskrivning:
        "Vi går igenom resultat- och balansräkning steg för steg, med ett svenskt bolag som exempel. Ingen förkunskap behövs.",
      startar: kl(9, 18),
      slutar: kl(9, 20),
      plats: "Göteborg",
      arrangor: "natverket",
      lank: null,
      publicerad: true,
    },
    {
      id: "exempel-2",
      titel: "Aktiekväll med bolagspresentationer",
      beskrivning: "Tre bolag presenterar sig och svarar på frågor. Delat från Aktiespararna.",
      startar: kl(16, 18, 30),
      slutar: null,
      plats: "Stockholm",
      arrangor: "aktiespararna",
      lank: null,
      publicerad: true,
    },
    {
      id: "exempel-3",
      titel: "Kom igång med fondsparande",
      beskrivning: "Indexfonder, avgifter och hur man tänker kring risk. Delat från Unga Aktiesparare.",
      startar: kl(23, 19),
      slutar: null,
      plats: "Digitalt",
      arrangor: "unga_aktiespararna",
      lank: null,
      publicerad: true,
    },
    {
      id: "exempel-4",
      titel: "Fika och portföljsnack",
      beskrivning: "Avslappnad träff där vi pratar om hur vi sparar och vad vi lärt oss. Alla nivåer välkomna.",
      startar: kl(37, 17, 30),
      slutar: kl(37, 19),
      plats: "Malmö",
      arrangor: "natverket",
      lank: null,
      publicerad: true,
    },
  ];
}
