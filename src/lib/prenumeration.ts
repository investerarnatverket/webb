import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { miljo } from "@/lib/miljo";

// Bekräftelselänken bär adressen och ett utgångsdatum, signerade med en
// hemlighet. Då behöver obekräftade adresser aldrig sparas någonstans.
const GILTIG_I_TIMMAR = 72;

function signatur(data: string) {
  return createHmac("sha256", miljo.prenumerationHemlighet()).update(data).digest("base64url");
}

export function skapaToken(epost: string) {
  const data = Buffer.from(`${epost}\n${Date.now() + GILTIG_I_TIMMAR * 3600_000}`).toString("base64url");
  return `${data}.${signatur(data)}`;
}

export function lasToken(token: string): string | null {
  const [data, sig] = token.split(".");
  if (!data || !sig) return null;
  const vantad = Buffer.from(signatur(data));
  const given = Buffer.from(sig);
  if (vantad.length !== given.length || !timingSafeEqual(vantad, given)) return null;

  const [epost, utgar] = Buffer.from(data, "base64url").toString().split("\n");
  if (!epost || Number(utgar) < Date.now()) return null;
  return epost;
}

export function normaliseraEpost(varde: unknown): string | null {
  const epost = String(varde ?? "").trim().toLowerCase();
  return epost.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(epost) ? epost : null;
}
