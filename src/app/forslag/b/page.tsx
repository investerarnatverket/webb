import type { Metadata } from "next";
import { Forslag, FORSLAG } from "../Forslag";

export const metadata: Metadata = { title: `Förslag B: ${FORSLAG.b.namn}` };

export default function ForslagB() {
  return <Forslag tema="b" />;
}
