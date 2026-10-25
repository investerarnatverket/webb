// Allt visas och matas in i svensk tid, oavsett var servern står.
const ZON = "Europe/Stockholm";

const datumFormat = new Intl.DateTimeFormat("sv-SE", {
  timeZone: ZON,
  weekday: "long",
  day: "numeric",
  month: "long",
});
const klockFormat = new Intl.DateTimeFormat("sv-SE", {
  timeZone: ZON,
  hour: "2-digit",
  minute: "2-digit",
});
const delar = new Intl.DateTimeFormat("sv-SE", {
  timeZone: ZON,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

export function visaDatum(iso: string) {
  return datumFormat.format(new Date(iso));
}

export function visaKlocka(iso: string) {
  return klockFormat.format(new Date(iso));
}

// ISO-tid -> "2026-11-05T18:30" i svensk tid, för <input type="datetime-local">.
export function tillFalt(iso: string | null) {
  if (!iso) return "";
  const p = Object.fromEntries(delar.formatToParts(new Date(iso)).map((d) => [d.type, d.value]));
  return `${p.year}-${p.month}-${p.day}T${p.hour}:${p.minute}`;
}

// "2026-11-05T18:30" tolkat som svensk tid -> ISO i UTC. Förskjutningen tas
// fram för just det datumet, så sommar- och vintertid blir rätt.
export function franFalt(falt: string) {
  const m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/.exec(falt);
  if (!m) return null;
  const [, a, mo, d, h, mi] = m.map(Number);
  const somUtc = Date.UTC(a, mo - 1, d, h, mi);
  let gissning = somUtc;
  for (let i = 0; i < 2; i++) {
    const p = Object.fromEntries(delar.formatToParts(new Date(gissning)).map((x) => [x.type, Number(x.value)]));
    const visad = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute);
    gissning = somUtc - (visad - gissning);
  }
  return new Date(gissning).toISOString();
}
