import ICAL from "ical.js";
import type { Arrangor, Event } from "./event";

// Tolkar en publicerad Outlook-kalender (ICS) till sajtens event. Ren funktion
// utan nätverk eller Next-beroenden, så att den går att testa fristående.
//
// Konventionen för den som lägger in event i Outlook:
// - Titel, plats och tid fylls i som vanligt.
// - En länk i beskrivningen (t.ex. anmälan hos Aktiespararna) blir eventets länk.
// - Arrangören gissas från länken (aktiespararna.se, ungaaktiesparare.se),
//   annars är det nätverket. En rad "Arrangör: Unga Aktiesparare" i
//   beskrivningen går före gissningen.
// - Händelser markerade som privata i Outlook visas aldrig.

const SVENSK_ZON = "Europe/Stockholm";
const MAX_PER_SERIE = 200;

const ARRANGOR_ORD: [RegExp, Arrangor][] = [
  [/unga\s*aktiesparar/i, "unga_aktiespararna"],
  [/aktiesparar/i, "aktiespararna"],
  [/n[äa]tverk/i, "natverket"],
];

function arrangorFran(text: string): Arrangor | null {
  for (const [monster, arrangor] of ARRANGOR_ORD) if (monster.test(text)) return arrangor;
  return null;
}

function arrangorFranLank(lank: string | null): Arrangor {
  if (!lank) return "natverket";
  const vard = new URL(lank).hostname.replace(/^www\./, "");
  if (vard.endsWith("ungaaktiesparare.se")) return "unga_aktiespararna";
  if (vard.endsWith("aktiespararna.se")) return "aktiespararna";
  return "natverket";
}

// Väggklocka i Sverige -> ISO i UTC (samma metod som i tid.ts, men fristående).
const delar = new Intl.DateTimeFormat("sv-SE", {
  timeZone: SVENSK_ZON, year: "numeric", month: "2-digit", day: "2-digit",
  hour: "2-digit", minute: "2-digit", hourCycle: "h23",
});
function svenskTidTillIso(a: number, mo: number, d: number, h: number, mi: number) {
  const somUtc = Date.UTC(a, mo - 1, d, h, mi);
  let gissning = somUtc;
  for (let i = 0; i < 2; i++) {
    const p = Object.fromEntries(delar.formatToParts(new Date(gissning)).map((x) => [x.type, Number(x.value)]));
    gissning = somUtc - (Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute) - gissning);
  }
  return new Date(gissning).toISOString();
}

// Tider utan känd tidszon (heldag eller "flytande") tolkas som svensk tid.
// Annars skulle de räknas om efter serverns zon, som på Netlify är UTC.
function tillIso(t: ICAL.Time): string {
  const zon = t.zone?.tzid;
  if (t.isDate || !zon || zon === "floating") return svenskTidTillIso(t.year, t.month, t.day, t.hour, t.minute);
  return t.toJSDate().toISOString();
}

const URL_MONSTER = /https:\/\/[^\s<>"')\]]+/i;

// Länken visas för sig, så den plockas ur texten. En rad som bara var en ledtext
// till länken ("Anmälan hos Aktiespararna: https://…") försvinner helt.
function rensaBeskrivning(text: string): string {
  return text
    .split(/\r?\n/)
    .filter((rad) => !/^\s*arrang[öo]r\s*:/i.test(rad))
    .map((rad) => {
      const utanLank = rad.replace(new RegExp(URL_MONSTER, "gi"), "").replace(/[ \t]{2,}/g, " ").trim();
      return utanLank !== rad.trim() && /:$/.test(utanLank) ? "" : utanLank;
    })
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
    .slice(0, 1000);
}

export function tolkaKalender(ics: string, nu = Date.now(), dagarFram = 180): Event[] {
  const kalender = new ICAL.Component(ICAL.parse(ics));
  for (const vtz of kalender.getAllSubcomponents("vtimezone")) ICAL.TimezoneService.register(vtz);

  const fran = nu - 6 * 3600_000; // pågående event ligger kvar några timmar
  const till = nu + dagarFram * 86400_000;

  // Flyttade eller ändrade tillfällen i en serie har RECURRENCE-ID och kopplas till sin huvudhändelse.
  const veventer = kalender.getAllSubcomponents("vevent");
  const huvud = new Map<string, ICAL.Event>();
  for (const v of veventer) if (!v.hasProperty("recurrence-id")) huvud.set(String(v.getFirstPropertyValue("uid")), new ICAL.Event(v));
  for (const v of veventer) {
    if (!v.hasProperty("recurrence-id")) continue;
    const serie = huvud.get(String(v.getFirstPropertyValue("uid")));
    if (serie) serie.relateException(v);
    else huvud.set(`${v.getFirstPropertyValue("uid")}#${v.getFirstPropertyValue("recurrence-id")}`, new ICAL.Event(v));
  }

  const ut: Event[] = [];
  for (const [uid, ev] of huvud) {
    const tillfallen: { start: ICAL.Time; slut: ICAL.Time; item: ICAL.Event }[] = [];
    if (ev.isRecurring()) {
      const it = ev.iterator();
      for (let t = it.next(), n = 0; t && n < MAX_PER_SERIE * 20; t = it.next(), n++) {
        const ms = Date.parse(tillIso(t));
        if (ms > till) break;
        const d = ev.getOccurrenceDetails(t);
        if (Date.parse(tillIso(d.endDate)) < fran && ms < fran) continue;
        tillfallen.push({ start: d.startDate, slut: d.endDate, item: d.item });
        if (tillfallen.length >= MAX_PER_SERIE) break;
      }
    } else {
      tillfallen.push({ start: ev.startDate, slut: ev.endDate, item: ev });
    }

    for (const { start, slut, item } of tillfallen) {
      const k = item.component;
      const klass = String(k.getFirstPropertyValue("class") ?? "").toUpperCase();
      const status = String(k.getFirstPropertyValue("status") ?? "").toUpperCase();
      if (klass === "PRIVATE" || klass === "CONFIDENTIAL" || status === "CANCELLED") continue;

      const startar = tillIso(start);
      const slutar = slut ? tillIso(slut) : null;
      const s = Date.parse(startar);
      if (s > till || (slutar ? Date.parse(slutar) : s) < fran) continue;

      const beskrivningRa = String(item.description ?? "");
      const lank =
        String(k.getFirstPropertyValue("url") ?? "").match(URL_MONSTER)?.[0] ??
        beskrivningRa.match(URL_MONSTER)?.[0] ??
        String(item.location ?? "").match(URL_MONSTER)?.[0] ??
        null;
      const arrangorRad = (beskrivningRa.match(/^\s*arrang[öo]r\s*:\s*(.+)$/im)?.[1] ?? "").trim();
      // "Arrangör: Volvo" (t.ex. en bolagsstämma) ger arrangören "annan" med det namnet.
      const kandArrangor = arrangorFran(arrangorRad);
      const egenArrangor = arrangorRad && !kandArrangor ? arrangorRad.slice(0, 60) : undefined;
      const kategorier = k.getAllProperties("categories").flatMap((p) => p.getValues().map(String)).join(" ");

      ut.push({
        id: `${uid}@${startar}`,
        titel: String(item.summary ?? "").trim() || "Event",
        beskrivning: rensaBeskrivning(beskrivningRa),
        startar,
        // Heldag: DTEND är dagen efter, så sluttiden visas inte.
        slutar: start.isDate ? null : slutar,
        plats: String(item.location ?? "").replace(URL_MONSTER, "").trim(),
        arrangor: egenArrangor ? "annan" : (kandArrangor ?? arrangorFran(kategorier) ?? arrangorFranLank(lank)),
        arrangorNamn: egenArrangor,
        lank,
        publicerad: true,
        heldag: start.isDate,
      });
    }
  }

  return ut.sort((a, b) => a.startar.localeCompare(b.startar));
}
