import { Suspense } from "react";
import { notFound } from "next/navigation";
import { ARRANGORER, EVENT_KOLUMNER, type Event } from "@/lib/event";
import { kravMedlem } from "@/lib/medlem";
import { inloggadKlient } from "@/lib/supabase/klienter";
import { tillFalt } from "@/lib/tid";
import { raderaEvent } from "../../actions";
import { EventFormular } from "../../EventFormular";

export default function RedigeraEvent({ params }: PageProps<"/medlem/event/[id]">) {
  return (
    <main className="smal">
      <h1>Redigera event</h1>
      <Suspense fallback={<p className="laddar">Hämtar…</p>}>
        <Formular params={params} />
      </Suspense>
    </main>
  );
}

async function Formular({ params }: { params: Promise<{ id: string }> }) {
  await kravMedlem();
  const { id } = await params;
  const supabase = await inloggadKlient();
  const { data } = await supabase.from("event").select(EVENT_KOLUMNER).eq("id", id).maybeSingle();
  if (!data) notFound();
  const e = data as Event;

  return (
    <>
      <EventFormular
        arrangorer={ARRANGORER}
        varden={{
          ...e,
          startar: tillFalt(e.startar),
          slutar: tillFalt(e.slutar),
          lank: e.lank ?? "",
        }}
      />
      <form action={raderaEvent} className="radera">
        <input type="hidden" name="id" value={e.id} />
        <button className="fara">Ta bort eventet</button>
      </form>
    </>
  );
}
