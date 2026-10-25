import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { DEMO } from "@/lib/demo";

// Förnyar Supabase-sessionen innan medlemssidorna renderas. Själva
// behörighetskontrollen görs i sidorna och serveråtgärderna, inte här.
export async function proxy(request: NextRequest) {
  // Utkastet har ingen inloggning: medlemssidorna leder till startsidan.
  if (DEMO) return NextResponse.redirect(new URL("/", request.url));

  let svar = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll(lista, rubriker) {
          lista.forEach(({ name, value }) => request.cookies.set(name, value));
          svar = NextResponse.next({ request });
          lista.forEach(({ name, value, options }) => svar.cookies.set(name, value, options));
          Object.entries(rubriker ?? {}).forEach(([namn, varde]) => svar.headers.set(namn, varde));
        },
      },
    },
  );

  await supabase.auth.getClaims();
  return svar;
}

export const config = {
  matcher: ["/medlem/:path*", "/logga-in"],
};
