import "server-only";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { miljo } from "@/lib/miljo";

// Tre klienter med olika behörighet:
// - publik: ingen inloggning, ser bara det RLS släpper fram. Får användas i 'use cache'.
// - inloggad: bär besökarens session via kakorna. Läser cookies(), alltså aldrig i 'use cache'.
// - admin: den hemliga nyckeln, kringgår RLS. Bara i serveråtgärder som först kontrollerat medlemskap.

export function publikKlient() {
  return createClient(miljo.supabaseUrl(), miljo.supabasePublik(), {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export async function inloggadKlient() {
  const kakor = await cookies();
  return createServerClient(miljo.supabaseUrl(), miljo.supabasePublik(), {
    cookies: {
      getAll: () => kakor.getAll(),
      setAll(lista) {
        try {
          lista.forEach(({ name, value, options }) => kakor.set(name, value, options));
        } catch {
          // Serverkomponenter får inte sätta kakor. Proxyn förnyar sessionen i stället.
        }
      },
    },
  });
}

export function adminKlient() {
  return createClient(miljo.supabaseUrl(), miljo.supabaseHemlig(), {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
