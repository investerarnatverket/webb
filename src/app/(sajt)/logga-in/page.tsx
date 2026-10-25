import type { Metadata } from "next";
import { Band } from "@/components/Band";
import { Inloggning } from "./Inloggning";

export const metadata: Metadata = { title: "Logga in", robots: { index: false } };

export default function LoggaIn() {
  return (
    <>
      <Band rubrik="Logga in" ingress="För medlemmar som lägger upp event. Du får en engångskod på mejlen." />
      <main>
        <section className="sektion">
          <div className="inner smal">
            <Inloggning />
          </div>
        </section>
      </main>
    </>
  );
}
