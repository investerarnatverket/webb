import type { Metadata } from "next";

export const metadata: Metadata = { title: "Integritet" };

// TODO före lansering: fyll i personuppgiftsansvarig och stäm av texten med
// Aktiespararna, eftersom nätverket är en del av dem.
export default function Integritet() {
  return (
    <main className="smal">
      <h1>Så hanterar vi din e-postadress</h1>
      <div className="lopande">
        <h2>Om du prenumererar</h2>
        <p>
          Vi sparar bara din e-postadress, och först när du har klickat på länken i bekräftelsemejlet. Den används
          enbart för att mejla dig om kommande event. Rättslig grund är ditt samtycke.
        </p>
        <p>
          Adressen lagras hos vår e-posttjänst Resend. Varje utskick har en avregistreringslänk. Klickar du på den
          slutar vi mejla dig direkt. Vill du att adressen raderas helt räcker det att svara på ett utskick.
        </p>
        <h2>Om du besöker sajten</h2>
        <p>
          Sajten sätter inga kakor för besökare och använder ingen spårning eller analys från tredje part. Typsnittet
          serveras från sajten själv. Medlemmar som loggar in får en kaka som håller dem inloggade.
        </p>
        <h2>Personuppgiftsansvarig</h2>
        <p>[Fyll i: vem som ansvarar och hur man når den personen.]</p>
      </div>
    </main>
  );
}
