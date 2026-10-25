import type { Metadata } from "next";
import Link from "next/link";
import { Band } from "@/components/Band";

export const metadata: Metadata = { title: "Prenumerationen är klar", robots: { index: false } };

export default function Klart() {
  return (
    <>
      <Band rubrik="Klart, du är med." ingress="Nästa gång ett event spikas får du ett mejl." />
      <main>
        <section className="sektion">
          <div className="inner smal">
            <Link href="/event">Se kommande event</Link>
          </div>
        </section>
      </main>
    </>
  );
}
