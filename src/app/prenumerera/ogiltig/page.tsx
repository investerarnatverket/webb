import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Länken fungerar inte", robots: { index: false } };

export default function Ogiltig() {
  return (
    <main className="smal">
      <h1>Länken fungerar inte</h1>
      <p className="ingress">
        Den kan ha gått ut (den gäller i tre dygn) eller ha blivit avklippt i mejlet.
      </p>
      <p>
        <Link href="/#utskick">Anmäl dig igen</Link>, så skickar vi en ny.
      </p>
    </main>
  );
}
