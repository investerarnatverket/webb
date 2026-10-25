import { Suspense } from "react";
import { ARRANGORER } from "@/lib/event";
import { kravMedlem } from "@/lib/medlem";
import { EventFormular } from "../../EventFormular";

export default function NyttEvent() {
  return (
    <main className="smal">
      <h1>Nytt event</h1>
      <Suspense fallback={<p className="laddar">Hämtar…</p>}>
        <Formular />
      </Suspense>
    </main>
  );
}

async function Formular() {
  await kravMedlem();
  return <EventFormular arrangorer={ARRANGORER} />;
}
