import type { ReactNode } from "react";

// Gradientbandet överst på varje sida: grönt (Unga Aktiesparare) till vänster
// som växer till blått (Aktiespararna) till höger. Startsidan har det stora.
export function Band({
  etikett,
  rubrik,
  ingress,
  stor = false,
  children,
}: {
  etikett?: string;
  rubrik: ReactNode;
  ingress?: ReactNode;
  stor?: boolean;
  children?: ReactNode;
}) {
  return (
    <section className={stor ? "band band-stor" : "band"}>
      <div className="inner">
        {etikett && <p className="etikett">{etikett}</p>}
        <h1>{rubrik}</h1>
        {ingress && <p className="band-ingress">{ingress}</p>}
        {children}
      </div>
    </section>
  );
}
