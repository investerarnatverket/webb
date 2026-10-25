import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Prenumerationen är klar", robots: { index: false } };

export default function Klart() {
  return (
    <main className="smal">
      <h1>Klart, du är med.</h1>
      <p className="ingress">Nästa gång ett event spikas får du ett mejl.</p>
      <p>
        <Link href="/event">Se kommande event</Link>
      </p>
    </main>
  );
}
