import type { Metadata } from "next";
import Link from "next/link";
import { loggaUt } from "@/app/logga-in/actions";

export const metadata: Metadata = { robots: { index: false } };

export default function MedlemLayout({ children }: LayoutProps<"/medlem">) {
  return (
    <div className="medlem">
      <nav className="medlem-nav" aria-label="Medlemssidor">
        <Link href="/medlem">Event</Link>
        <Link href="/medlem/medlemmar">Medlemmar</Link>
        <form action={loggaUt}>
          <button className="lank-knapp">Logga ut</button>
        </form>
      </nav>
      {children}
    </div>
  );
}
