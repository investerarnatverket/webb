import type { Metadata } from "next";
import { Inloggning } from "./Inloggning";

export const metadata: Metadata = { title: "Logga in", robots: { index: false } };

export default function LoggaIn() {
  return (
    <main className="smal">
      <h1>Logga in</h1>
      <p className="ingress">För medlemmar som lägger upp event. Du får en engångskod på mejlen.</p>
      <Inloggning />
    </main>
  );
}
