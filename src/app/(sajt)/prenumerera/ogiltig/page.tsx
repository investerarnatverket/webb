import type { Metadata } from "next";
import Link from "next/link";
import { Band } from "@/components/Band";

export const metadata: Metadata = { title: "Länken fungerar inte", robots: { index: false } };

export default function Ogiltig() {
  return (
    <>
      <Band
        rubrik="Länken fungerar inte"
        ingress="Den kan ha gått ut (den gäller i tre dygn) eller ha blivit avklippt i mejlet."
      />
      <main>
        <section className="sektion">
          <div className="inner smal">
            <Link href="/#utskick">Anmäl dig igen</Link>, så skickar vi en ny.
          </div>
        </section>
      </main>
    </>
  );
}
