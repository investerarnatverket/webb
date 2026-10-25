import type { Metadata } from "next";
import { Forslag, FORSLAG } from "../Forslag";

export const metadata: Metadata = { title: `Förslag C: ${FORSLAG.c.namn}` };

export default function ForslagC() {
  return <Forslag tema="c" />;
}
