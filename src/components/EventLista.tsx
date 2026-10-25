import { ARRANGORER, type Event } from "@/lib/event";
import { visaDatum, visaKlocka } from "@/lib/tid";

const dag = new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Stockholm", day: "numeric" });
const manad = new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Stockholm", month: "short" });

const spann = (startar: string, slutar: string | null) =>
  slutar ? `${visaKlocka(startar)}–${visaKlocka(slutar)}` : visaKlocka(startar);

// "09:00–12:00 och 13:00–16:00", eller med kommatecken vid fler pass.
function passTider(tider: { startar: string; slutar: string | null }[]) {
  const delar = tider.map((t) => spann(t.startar, t.slutar));
  return `${delar.slice(0, -1).join(", ")} och ${delar.at(-1)}`;
}

export function EventLista({ event }: { event: Event[] }) {
  if (event.length === 0) {
    return <p className="tomt">Inga event inlagda just nu. Prenumerera, så hör vi av oss när nästa är spikat.</p>;
  }

  return (
    <ol className="event-lista">
      {event.map((e) => {
        const tid = e.heldag
          ? "Heldag"
          : e.tider && e.tider.length > 1
            ? passTider(e.tider)
            : spann(e.startar, e.slutar);
        return (
          <li key={e.id} className="event">
            <time className="event-datum" dateTime={e.startar} aria-label={visaDatum(e.startar)}>
              <span className="event-dag">{dag.format(new Date(e.startar))}</span>
              <span className="event-manad">{manad.format(new Date(e.startar)).replace(".", "")}</span>
            </time>
            <div className="event-text">
              <span className={`arrangor arrangor-${e.arrangor}`}>{ARRANGORER[e.arrangor]}</span>
              <h3>
                {e.lank ? (
                  <a href={e.lank} rel="noopener" target="_blank">
                    {e.titel}
                  </a>
                ) : (
                  e.titel
                )}
              </h3>
              <p className="event-meta">
                <span className="versal-forsta">{visaDatum(e.startar)}</span> · {tid}
                {e.plats && ` · ${e.plats}`}
              </p>
              {e.beskrivning && <p className="event-beskrivning">{e.beskrivning}</p>}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
