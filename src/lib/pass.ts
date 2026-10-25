import type { Event } from "./event";

// Flera pass av samma event visas som ett kort med alla tider. Två event räknas
// som pass av samma när titel (utan tillägg som "(förmiddag)"), dag, plats och
// arrangör är lika. I Outlook ligger de kvar som separata händelser.

const PASS_TILLAGG = /\s*\((f[öo]rmiddag|eftermiddag|morgon|lunch|kv[äa]ll|pass\s*\d+|del\s*\d+)\)\s*$/i;

const dag = new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Stockholm", dateStyle: "short" });

export function grundtitel(titel: string) {
  return titel.replace(PASS_TILLAGG, "").trim();
}

export function slaIhopPass(event: Event[]): Event[] {
  const grupper = new Map<string, Event[]>();
  for (const e of event) {
    if (e.heldag) {
      grupper.set(`${e.id}`, [e]);
      continue;
    }
    const nyckel = [grundtitel(e.titel).toLowerCase(), dag.format(new Date(e.startar)), e.plats.toLowerCase(), e.arrangor].join("|");
    grupper.set(nyckel, [...(grupper.get(nyckel) ?? []), e]);
  }

  const ut: Event[] = [];
  for (const grupp of grupper.values()) {
    if (grupp.length === 1) {
      ut.push(grupp[0]);
      continue;
    }
    const sorterad = [...grupp].sort((a, b) => a.startar.localeCompare(b.startar));
    const forsta = sorterad[0];
    ut.push({
      ...forsta,
      titel: grundtitel(forsta.titel),
      slutar: sorterad.at(-1)!.slutar,
      lank: sorterad.find((e) => e.lank)?.lank ?? null,
      tider: sorterad.map((e) => ({ startar: e.startar, slutar: e.slutar })),
    });
  }
  return ut.sort((a, b) => a.startar.localeCompare(b.startar));
}
