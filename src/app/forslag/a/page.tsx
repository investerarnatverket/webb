import type { Metadata } from "next";
import { Forslag, FORSLAG } from "../Forslag";

export const metadata: Metadata = { title: `Förslag A: ${FORSLAG.a.namn}` };

export default function ForslagA() {
  return <Forslag tema="a" />;
}
