import "server-only";

// Läser miljövariablerna först när de behövs, så att ett saknat värde ger ett
// begripligt fel i stället för "undefined" djupt inne i ett bibliotek.
function krav(namn: string): string {
  const varde = process.env[namn];
  if (!varde) throw new Error(`Miljövariabeln ${namn} saknas. Se .env.example.`);
  return varde;
}

export const miljo = {
  sajtUrl: () => (process.env.SAJT_URL ?? "http://localhost:3000").replace(/\/$/, ""),
  supabaseUrl: () => krav("SUPABASE_URL"),
  supabasePublik: () => krav("SUPABASE_PUBLISHABLE_KEY"),
  supabaseHemlig: () => krav("SUPABASE_SECRET_KEY"),
  resendNyckel: () => krav("RESEND_API_KEY"),
  resendFran: () => krav("RESEND_FROM"),
  resendSegment: () => process.env.RESEND_SEGMENT_ID || undefined,
  kontaktEpost: () => process.env.KONTAKT_EPOST || undefined,
  prenumerationHemlighet: () => krav("PRENUMERATION_HEMLIGHET"),
};
